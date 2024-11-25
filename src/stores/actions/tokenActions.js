// Import custom redux types
import moment from 'moment';
import { tokenTypes } from '../types/tokenTypes';
import {
  ChangeGlobalIsLoading,
  generateUUIDV4,
  GlobalTranslate,
  showError,
} from '../../helpers';
import { LogoutService, TokenRefreshService } from '../../services';
import { LogoutHelper } from '../../helpers/Logout.Helper';

/**
 * logout on expire handler
 * @param payload
 * @param dispatch
 * @returns {function(*): void}
 */
const logoutHandler = (payload, dispatch) => {
  LogoutHelper(dispatch);
  LogoutService();
};
/**
 * watch token and sign logout if
 * @param payload
 * @param isFromOutsideLogin
 * @returns {function(*): void}
 */
export function watchTokenHandler(payload, isFromOutsideLogin = false) {
  if (!payload) return null;
  const remainingTime = moment
    .duration(moment(moment.unix(payload.tokenExpiry).format()).diff(moment()))
    .asMilliseconds();
  return (dispatch) => {
    if (remainingTime <= 0) logoutHandler(payload, dispatch);
    else if (
      !isFromOutsideLogin
      || ((localStorage.getItem('token')
        && JSON.parse(localStorage.getItem('token')).token)
        || '') !== payload.token
    )
      dispatch({
        type: tokenTypes.SUCCESS,
        payload,
      });
  };
}

let timeOutRef = null;

/**
 * to call the refresh API service.
 * @description delay the refresh API until the pending requests are completed.
 */
const waitForAllRequestsToComplete = () =>
  new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const requestsCounter = localStorage.getItem('APIRequestsCounter')
        ? +localStorage.getItem('APIRequestsCounter')
        : 0;
      if (requestsCounter <= 0) {
        clearInterval(intervalId);
        resolve();
      }
    }, 150); // check every 150 milliseconds
  });

/**
 * to call the refresh API service.
 * @param payload
 * @param dispatch
 */
const getRefreshTokenHandler = async (payload, dispatch) => {
  if (!payload || !localStorage.getItem('token')) return;
  ChangeGlobalIsLoading(true);
  await waitForAllRequestsToComplete();
  localStorage.setItem('isRefreshTokenInProgress', 'yes');
  const response = await TokenRefreshService();
  localStorage.setItem('isRefreshTokenInProgress', 'no');
  ChangeGlobalIsLoading(false);
  if (response && response.status === 200)
    dispatch(
      updateToken({
        token: response.data.results.token,
        tokenExpiry: response.data.results.token_expiry,
      }),
    );
  // Assuming updateToken handles updating the Redux state and local storage
  else {
    showError(
      (GlobalTranslate && GlobalTranslate.t('Shared:failed-to-refresh-token'))
        || 'Failed to refresh token!',
      response,
    );
    logoutHandler(payload, dispatch);
  }
};

/**
 * Refresh the token just before it expires.
 * @param payload
 * @param dispatch
 */
export const ScheduleTokenRefresh = (payload, dispatch) => {
  if (!payload || !localStorage.getItem('token')) return;
  const expiresIn = payload.tokenExpiry;
  const currentTime = moment().unix();
  const refreshTime = expiresIn - currentTime - 5 * 60; // Refresh 5 minutes before expiry
  if (refreshTime * 1000 >= 2147483647) return;
  timeOutRef
    = (sessionStorage.getItem('refreshTimeOutRef')
      && +sessionStorage.getItem('refreshTimeOutRef'))
    || null;
  if (refreshTime > -200) {
    if (timeOutRef) clearTimeout(timeOutRef);
    timeOutRef = setTimeout(() => {
      // this logic is to prevent multiple refresh token calls at the same time if
      // there are multiple open tabs
      if (!localStorage.getItem('tokenLeaderTab'))
        localStorage.setItem('tokenLeaderTab', sessionStorage.getItem('tabID'));
      if (localStorage.getItem('tokenLeaderTab') === sessionStorage.getItem('tabID'))
        void getRefreshTokenHandler(payload, dispatch);
      else
        setTimeout(() => {
          ScheduleTokenRefresh(JSON.parse(localStorage.getItem('token')), dispatch);
        });
    }, refreshTime * 1000);
    sessionStorage.setItem('refreshTimeOutRef', timeOutRef);
  }
  // Convert seconds to milliseconds
  else logoutHandler(payload, dispatch);
};

/**
 * update token handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateToken(payload) {
  if (!payload) return null;
  localStorage.setItem('token', JSON.stringify(payload));
  const tabUUID = generateUUIDV4();
  localStorage.setItem('tokenLeaderTab', tabUUID);
  sessionStorage.setItem('tabID', tabUUID);
  return (dispatch) => {
    if (!payload.tokenExpiry && payload.tokenExpiry !== 0)
      return dispatch({
        type: tokenTypes.SUCCESS,
        payload,
      });

    dispatch(watchTokenHandler(payload));
    ScheduleTokenRefresh(payload, dispatch); // Add your actual refresh token API call function here
  };
}

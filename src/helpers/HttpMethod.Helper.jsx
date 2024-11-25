import axios from 'axios';
// import * as Sentry from '@sentry/react';
import { storageService } from 'utils/functions/storage';
import {
  GetGlobalCompanyId,
  GlobalHistory,
  // GlobalToast,
  GlobalDispatch,
  GetGlobalAccountUuid,
  generateUUIDV4,
} from './Middleware.Helper';
import { watchTokenHandler } from '../stores/actions/tokenActions';
import moment from 'moment';
import { ThirdPartiesEnum } from '../enums';
import { LogoutHelper } from './Logout.Helper';

const replaceUrlParam = (url, paramName, paramValue) => {
  if (paramValue == null) paramValue = '';

  const pattern = new RegExp(`\\b(${paramName}=).*?(&|#|$)`);
  if (url.search(pattern) >= 0) return url.replace(pattern, `$1${paramValue}$2`);

  url = url.replace(/[?#]$/, '');
  return `${url + (url.indexOf('?') > 0 ? '&' : '?') + paramName}=${paramValue}`;
};

function renderByStatusCode(statusCode) {
  switch (statusCode) {
  // case 400:
  //   GlobalHistory.push('/recruiter/400');
  //   break;
  // case 401:
  //   GlobalHistory.push('/recruiter/401');
  //   break;
  case 402:
    GlobalHistory.push('/recruiter/no-subscriptions');
    break;
    // case 404:
    //   GlobalHistory.push('/recruiter/404');
    //   break;
    // case 406:
    //   break;
    // case 422:
    //   GlobalHistory.push('/recruiter/422');
    //   break;
    // case 429:
    //   GlobalHistory.push('/recruiter/429');
    //   break;
    // case 500:
    //   GlobalHistory.push('/recruiter/500');
    //   break;
  default:
    break;
  }
}

const allPendingRequestsRecord = [];
const getUniqueId = (config) =>
  (config && `url=${config.url}&method=${config.method}`) || generateUUIDV4();

export const removeAllPendingRequestsRecordHttp = () => {
  allPendingRequestsRecord.forEach((item) => {
    if (item) item.cancel('page changes'); // cancel request
  });
  allPendingRequestsRecord.splice(0); // remove all records
};

export let CurrentTabInProgressAPIs = 0;

axios.interceptors.request.use(
  (configurations) => {
    const configurationsLocal = configurations;
    // a counter for the progress APIs
    const requestsCounter = localStorage.getItem('APIRequestsCounter')
      ? +localStorage.getItem('APIRequestsCounter')
      : 0;
    CurrentTabInProgressAPIs += 1;
    localStorage.setItem('APIRequestsCounter', requestsCounter + 1 + '');
    // Add a cancelToken to the request configuration
    if (configurationsLocal && axios && axios.CancelToken)
      configurationsLocal.cancelToken = new axios.CancelToken((cancel) => {
        // Add record, record the unique value of the request and cancel method
        allPendingRequestsRecord.push({ id: getUniqueId(configurations), cancel });
      });
    const localToken = localStorage.getItem('token');

    const isExpired
      = !localToken
      || moment().isAfter(
        moment.unix(JSON.parse(localStorage.getItem('token'))?.tokenExpiry).format(),
      );

    if (
      !configurationsLocal.headers.isPublic
      && !configurationsLocal.headers.isSkipTokenCheck
      && !configurationsLocal.headers['recipient-token']
      && (isExpired || !localStorage.getItem('token'))
    ) {
      LogoutHelper(true);
      // Get the current URL
      const url = new URL(window.location.href);

      // Get the query parameters
      const query = new URLSearchParams(url.search);

      if (GlobalHistory)
        if (query && query.toString())
          GlobalHistory.push(`/el/login?${query.toString()}`);
        else GlobalHistory.push('/el/login');
      return configurationsLocal;
    }

    if (GlobalDispatch && localStorage.getItem('token'))
      GlobalDispatch(
        watchTokenHandler(JSON.parse(localStorage.getItem('token')), true),
      );
    const companyId = GetGlobalCompanyId();
    const account_uuid = GetGlobalAccountUuid();
    const userToken = (localToken && JSON.parse(localToken).token) || '';

    const currentLanguage = localStorage.getItem('platform_language');
    const userCompanyId = localStorage.getItem('company_id') || '';
    const accountUuid = localStorage.getItem('account_uuid') || '';
    const is_provider
      = (localStorage.getItem('user')
        && JSON.parse(localStorage.getItem('user'))?.results?.user.is_provider)
      || '';

    if (
      (is_provider && !configurationsLocal.headers.isPublic)
      || (!is_provider
        && !configurationsLocal.headers.customHeaders
        && !configurationsLocal.headers.isPublic
        && (userCompanyId || companyId))
    )
      configurationsLocal.headers = {
        ...configurationsLocal.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Company':
          configurationsLocal.headers['Accept-Company']
          || companyId
          || userCompanyId,
        'Accept-Account':
          configurationsLocal.headers['Accept-Account']
          || account_uuid
          || accountUuid,
        'Accept-Language': currentLanguage,
        Authorization: `Bearer ${userToken}`,
        // 'Access-Control-Allow-Origin': headers
        ...(configurationsLocal.headers.Authorization
          && !configurationsLocal.headers['recipient-token'] && {
          Authorization: configurationsLocal.headers.Authorization,
        }),
      };
    else
      configurationsLocal.headers = {
        ...(configurationsLocal?.headers?.customHeaders && {
          ...configurationsLocal.headers,
        }),
        ...(configurationsLocal.headers.Authorization
          && !configurationsLocal.headers['recipient-token'] && {
          Authorization: configurationsLocal.headers.Authorization,
        }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': currentLanguage,
      };
    if (configurationsLocal.url.includes('query=')) {
      const queryPortion = configurationsLocal.url
        .split('query=')
        .pop()
        .split('&')[0];
      const escapedQuery = queryPortion.replace('*', '\\*');
      configurationsLocal.url = replaceUrlParam(
        configurationsLocal.url,
        'query',
        escapedQuery,
      );
    }
    delete configurationsLocal.headers.customHeaders;
    delete configurationsLocal.headers.isSkipTokenCheck;

    if (configurationsLocal?.headers?.['Accept-Company'] === 'no-company')
      delete configurationsLocal.headers['Accept-Company'];
    configurationsLocal.headers['X-Frame-Options'] = 'SAMEORIGIN';

    return configurationsLocal;
  },
  (error) => {
    // a counter for the progress APIs
    const requestsCounter = localStorage.getItem('APIRequestsCounter')
      ? +localStorage.getItem('APIRequestsCounter')
      : 0;
    CurrentTabInProgressAPIs -= 1;
    localStorage.setItem('APIRequestsCounter', requestsCounter - 1 + '');
    Promise.reject(error);
  },
);

// interceptors for a handle any response
axios.interceptors.response.use(
  (response) => {
    // a counter for the progress APIs
    const requestsCounter = localStorage.getItem('APIRequestsCounter')
      ? +localStorage.getItem('APIRequestsCounter')
      : 0;
    CurrentTabInProgressAPIs -= 1;
    localStorage.setItem('APIRequestsCounter', requestsCounter - 1 + '');
    return response;
  },
  (error) => {
    // a counter for the progress APIs
    const requestsCounter = localStorage.getItem('APIRequestsCounter')
      ? +localStorage.getItem('APIRequestsCounter')
      : 0;
    CurrentTabInProgressAPIs -= 1;
    localStorage.setItem('APIRequestsCounter', requestsCounter - 1 + '');
    if (!error.response) return Promise.reject(error);
    const {
      response: { status },
    } = error;

    const url = new URL(window.location.href);
    const query = new URLSearchParams(url.search);
    const isNotLoginPage
      = !url.pathname.includes('/el')
      && !url.pathname.includes('/recipient-login')
      && !url.pathname.includes('/onboarding/invitations');
    // Do something with response error
    if (status === 406) {
      // showError(
      //   GlobalTranslate && GlobalTranslate.t('Shared:LoginView.token-not-valid'),
      //   error
      // );
      LogoutHelper(true);
      // Get the current URL

      // Get the query parameters
      if (
        GlobalHistory
        && isNotLoginPage
        && !Object.values(ThirdPartiesEnum).some((item) =>
          url.pathname.includes(item.path),
        )
      )
        GlobalHistory.push(`/el/login?${query.toString()}`);
      return Promise.reject(error);
    }
    if (status === 401)
      if (process.env.REACT_APP_DEBUG === 'false') {
        if (
          error.response?.data?.message === 'invalid_credentials'
          || error.response?.data?.message
            === 'Incorrect email address or password, please try again'
          || error.response?.data?.message
            === "Your organization's account has been suspended. please contact your organization administrator"
        )
          return Promise.reject(error);

        // If the Session is expired, clear
        // the session and local storage then redirect to the login page.
        if (error?.response?.data?.token_error) {
          storageService.clearLocalStorage();
          GlobalHistory.push('/el/login');
          return Promise.reject(error);
        }
      }
    if (
      isNotLoginPage
      && (error.response.data?.identifiers?.status === 'invalid_token'
        || error.response.data?.identifiers?.status === 'expired_token')
    ) {
      LogoutHelper(true);
      GlobalHistory.push(`/el/login?${query.toString()}`);
      return Promise.reject(error);
    }
    renderByStatusCode(status);
    // if (error.response.error === 'permission') {
    //   renderByStatusCode(error.response.status, 'permission');
    // } else if (error.response.token_error === true) {
    //   renderByStatusCode(error.response.status, 'token_error');
    // }

    // if (error.response && error.response.status === 406)
    //   renderByStatusCode(error.response.status);

    // if (error.response && error.response.status === 500)
    //   // Report error to Sentry
    //   Sentry.withScope((scope) => {
    //     scope.setTag('type', 'server-error');
    //     Sentry.captureException(error);
    //   });

    // if (status === 422 || status === 429)
    //   GlobalToast('An error has occurred, Please try again', {
    //     appearance: 'error',
    //     autoDismiss: true,
    //   });
    return Promise.reject(error);
  },
);

export const HttpServices = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  request: axios.request,
};

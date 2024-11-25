import { SelectedBranchTypes } from '../types/SelectedBranchTypes';
import { GetRecruiterDetails } from '../../services';
import {
  ChangeGlobalIsLoading,
  GlobalHistory,
  GlobalLocation,
  GlobalRerender,
  GlobalTranslate,
  showError,
} from '../../helpers';
import { companyIdTypes } from '../types/companyIdTypes';
import { ThirdPartiesEnum } from '../../enums';

/**
 * watch token and sign logout if
 * @param dispatch
 * @param payload
 * @param userData
 * @returns {function(*): void}
 */
// const getSubscriptionOnInit = (dispatch, payload) => {
//   administrationAPI
//     .GetCurrentPlan({ company_uuid: payload?.uuid })
//     .then((response) => {
//       const results = (response && response.data && response.data.results) || [];
//       ChangeGlobalIsLoading(false);
//       if (results && results.length > 0) {
//         const subscriptionList = results?.map((el) => ({
//           ...el.service,
//           is_active: true,
//           service: el.service.product,
//         }));
//
//         localStorage.setItem(
//           'UserSubscriptions',
//           JSON.stringify({
//             subscriptions: subscriptionList,
//           })
//         );
//         dispatch({
//           type: userSubscription.SUCCESS,
//           payload: {
//             subscriptions: subscriptionList,
//           },
//         });
//       }
//       GlobalRerender();
//       dispatch({
//         type: SelectedBranchTypes.SUCCESS,
//         payload,
//       });
//     })
//     .catch((error) => {
//       ChangeGlobalIsLoading(false);
//       showError('', error);
//       dispatch({
//         type: SelectedBranchTypes.FAILED,
//         payload,
//       });
//     });
// };

const getBranchDetails = async (dispatch, payload, userData) => {
  if (
    localStorage.getItem('token')
    && JSON.parse(localStorage.getItem('token')).token
  ) {
    ChangeGlobalIsLoading(true);
    if (userData?.is_provider) {
      localStorage.setItem('company_id', payload?.uuid || null);
      dispatch({
        type: companyIdTypes.SUCCESS,
        payload: payload?.uuid || null,
      });
      if (
        GlobalLocation
        && GlobalLocation.pathname
        && !GlobalLocation.pathname.includes('/el/')
        && !GlobalLocation.pathname.includes('/recipient-login')
        && !Object.values(ThirdPartiesEnum).some((item) =>
          GlobalLocation.pathname.includes(item.path),
        )
      ) {
        ChangeGlobalIsLoading(false);
        GlobalRerender();
        dispatch({
          type: SelectedBranchTypes.SUCCESS,
          payload,
        });
      } else {
        ChangeGlobalIsLoading(false);
        // GlobalRerender();
        dispatch({
          type: SelectedBranchTypes.SUCCESS,
          payload,
        });
        if (userData?.member_type !== 'member')
          GlobalHistory.push('/provider/overview');
        else GlobalHistory.push('/provider/profile'); // select first accessible account when login
      }
    } else {
      const response = await GetRecruiterDetails({ company_uuid: payload?.uuid });
      if (response && response.status === 200) {
        const { results } = response.data;
        localStorage.setItem('gateway_urls', JSON.stringify(results.gateway_urls));
        localStorage.setItem('company_id', payload?.uuid || null);
        localStorage.setItem('userDetails', JSON.stringify(results) || null);
        localStorage.setItem('careerPortalUrl', payload?.full_domain || '');
        dispatch({
          type: companyIdTypes.SUCCESS,
          payload: payload.uuid || null,
        });
        if (
          GlobalLocation
          && GlobalLocation.pathname
          && !GlobalLocation.pathname.includes('/el/')
          && !GlobalLocation.pathname.includes('/recipient-login')
          && !Object.values(ThirdPartiesEnum).some((item) =>
            GlobalLocation.pathname.includes(item.path),
          )
        ) {
          console.log("GetRecruiterDetails")
          // getSubscriptionOnInit(dispatch, payload);}
          // to be removed when reactive the subscriptions
          ChangeGlobalIsLoading(false);
          GlobalRerender();
          dispatch({
            type: SelectedBranchTypes.SUCCESS,
            payload,
          });
        } else {
          ChangeGlobalIsLoading(false);
          GlobalRerender();
          dispatch({
            type: SelectedBranchTypes.SUCCESS,
            payload,
          });
          if (
            response
            && response.data
            && response.data.results
            && response.data.results.redirect_to
          )
            GlobalHistory.push(response.data.results.redirect_to);
          //   do not add redirect here since the login handler will redirect to overflow
          //   or to the desired link after call for the details
        }
      } else {
        ChangeGlobalIsLoading(false);
        dispatch({
          type: SelectedBranchTypes.FAILED,
          payload,
        });
        showError(GlobalTranslate.t('Shared:failed-to-get-saved-data'), response);
      }
    }
  }
};
/**
 * update branch handler
 * @param payload
 * @param userData
 * @returns {function(*): void}
 */
export function updateSelectedBranch(payload, userData) {
  localStorage.setItem('selectedBranch', JSON.stringify(payload));
  return (dispatch) => {
    getBranchDetails(dispatch, payload, userData);
  };
}

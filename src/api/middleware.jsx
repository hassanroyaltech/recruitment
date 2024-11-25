/**
 * For later to unify the API interface.
 *
 * It would be smart to handle redirects to 400, 401, 422, 429 and 500 error pages.
 */

// Axios
import axios from 'axios';

// import * as Sentry from '@sentry/react';
import { generateUUIDV4, GlobalHistory } from '../helpers';

/**
 * Render a static page by status code
 * @param statusCode
 // * @param slug
 * @returns {string}
 */
const renderByStatusCode = (statusCode) => {
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
  case 404:
    GlobalHistory.push('/recruiter/404');
    break;
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
};

const allPendingRequestsRecord = [];
const getUniqueId = (config) =>
  (config && `url=${config.url}&method=${config.method}`) || generateUUIDV4();

axios.interceptors.request.use(
  (config) => {
    if (config && axios && axios.CancelToken)
      config.cancelToken = new axios.CancelToken((cancel) => {
        // Add record, record the unique value of the request and cancel method
        allPendingRequestsRecord.push({ id: getUniqueId(config), cancel });
      });
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const removeAllPendingRequestsRecord = () => {
  allPendingRequestsRecord.forEach((item) => {
    item.cancel(); // cancel request
  });
  allPendingRequestsRecord.splice(0); // remove all records
};

// Every single API we have in the dashboard will go through
//  this interceptor (middleware-like) first.
axios.interceptors.response.use(
  (response) =>
    // Do nothing, return the valid response as it is.
    response,
  (error) => {
    // Validations for rejected responses.
    if (error && error.status) renderByStatusCode(error.status);
    // this state temp commented
    // if (error?.response && error?.response.status === 401)
    //   if (process.env.REACT_APP_DEBUG === 'false') {
    //     if (
    //       error?.response?.data?.message === 'invalid_credentials'
    //       || error?.response?.data?.message
    //         === 'Incorrect email address or password, please try again'
    //       || error?.response?.data?.message
    //         === "Your organization's account has been suspended. please contact your organization administrator"
    //     )
    //       return Promise.reject(error);
    //
    //     // If Session is out of date clear
    //     // the session and local storage then redirect to login page.
    //     if (error?.response?.data?.token_error) {
    //       storageService.clearLocalStorage();
    //       GlobalHistory.push('/el/login');
    //       return true;
    //     }
    //     renderByStatusCode(error?.response.status);
    //   }
    // if (error.response.error === 'permission') {
    //   renderByStatusCode(error.response.status, 'permission');
    // } else if (error.response.token_error === true) {
    //   renderByStatusCode(error.response.status, 'token_error');
    // }

    // if (error?.response && error?.response?.status === 406)
    //   renderByStatusCode(error.response.status);

    // if (error?.response && error.response.status === 500)
    //   // Report error to Sentry
    //   Sentry.withScope((scope) => {
    //     scope.setTag('type', 'server-error');
    //     Sentry.captureException(error);
    //   });

    // Return the rejected promise as it is with the same error.
    return Promise.reject(error);
  }
);

export default axios;

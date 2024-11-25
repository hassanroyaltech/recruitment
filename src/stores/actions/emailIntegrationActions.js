import { EmailIntegrationAccountTypes } from '../types/emailIntegrationTypes';
/**
 * update user handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateEmailIntegration(payload) {
  if (payload) localStorage.setItem('nylasAccountInfo', JSON.stringify(payload));
  else localStorage.removeItem('nylasAccountInfo');

  if (payload)
    return (dispatch) => {
      dispatch({
        type: EmailIntegrationAccountTypes.SUCCESS,
        payload,
      });
    };
  return (dispatch) => {
    dispatch({
      type: EmailIntegrationAccountTypes.DELETE,
      payload,
    });
  };
}

import { AccountTypes } from '../types/accountTypes';
/**
 * update user handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateAccount(payload) {
  localStorage.setItem('account', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: AccountTypes.SUCCESS,
      payload,
    });
  };
}

export function updateAccountsList(payload) {
  return (dispatch) => {
    dispatch({
      type: AccountTypes.UPDATE_LIST,
      payload,
    });
  };
}

export function updateSelectedAccount(payload) {
  localStorage.setItem('account_uuid', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: AccountTypes.UPDATE_ACCOUNT,
      payload,
    });
  };
}

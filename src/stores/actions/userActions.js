import { UserTypes } from '../types/userTypes';
/**
 * update user handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateUser(payload) {
  localStorage.setItem('user', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: UserTypes.SUCCESS,
      payload,
    });
  };
}

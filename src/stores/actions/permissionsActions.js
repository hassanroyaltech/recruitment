import { permissionsTypes } from '../types/permissionsTypes';
/**
 * @param payload
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @returns {function(*): void}
 * @description update permissions handler
 */
export function updatePermissions(payload) {
  if (!payload) return null;
  localStorage.setItem('permissionsReducer', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: permissionsTypes.SUCCESS,
      payload,
    });
  };
}

import { SET_ADMIN_NAVBAR_TITLE } from '../types/navTypes';

export function setAdminNavbarTitle(payload) {
  return (dispatch) => {
    dispatch({
      type: SET_ADMIN_NAVBAR_TITLE,
      payload,
    });
  };
}

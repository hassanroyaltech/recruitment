import { SET_ADMIN_NAVBAR_TITLE } from '../types/navTypes';

export default function navReducer(state = {}, action) {
  const { type } = action;

  switch (type) {
  case SET_ADMIN_NAVBAR_TITLE: {
    const { payload } = action;
    return {
      ...state,
      navbarTitle: payload,
    };
  }
  default:
    return state;
  }
}

import { UserTypes } from '../types/userTypes';

const INITIAL_STATE = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : '';

export const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case UserTypes.SUCCESS:
    return { ...payload, reducer_status: UserTypes.SUCCESS };

  case UserTypes.UPDATE_SOURCE_UUID:
    return { ...state, user: { ...state.user, source_uuid: payload } };

  case UserTypes.FAILED:
    return { ...payload, reducer_status: UserTypes.FAILED };

  case UserTypes.RESET:
    return { ...INITIAL_STATE };

  case UserTypes.DELETE:
    return null;

  default:
    return state;
  }
};

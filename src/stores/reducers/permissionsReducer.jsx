import { permissionsTypes } from '../types/permissionsTypes';

const INITIAL_STATE = localStorage.getItem('permissionsReducer')
  ? JSON.parse(localStorage.getItem('permissionsReducer'))
  : '';

export const permissionsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case permissionsTypes.DELETE:
    return null;
  case permissionsTypes.EXPIRE:
    return { reducer_status: permissionsTypes.EXPIRE };

  case permissionsTypes.SUCCESS:
    return { ...payload, reducer_status: permissionsTypes.SUCCESS };

  case permissionsTypes.FAILED:
    return { ...payload, reducer_status: permissionsTypes.FAILED };

  case permissionsTypes.RESET:
    return INITIAL_STATE;

  default:
    return state;
  }
};

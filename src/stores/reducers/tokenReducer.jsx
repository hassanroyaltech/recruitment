import { tokenTypes } from '../types/tokenTypes';

const INITIAL_STATE = localStorage.getItem('token')
  ? JSON.parse(localStorage.getItem('token'))
  : '';

export const tokenReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case tokenTypes.DELETE: {
    localStorage.removeItem('token');
    return null;
  }
  case tokenTypes.EXPIRE: {
    const newValue = { ...state, reducer_status: tokenTypes.EXPIRE };
    localStorage.setItem('token', JSON.stringify(newValue));
    return newValue;
  }

  case tokenTypes.SUCCESS: {
    const newValue = { ...state, ...payload, reducer_status: tokenTypes.SUCCESS };
    localStorage.setItem('token', JSON.stringify(newValue));
    return newValue;
  }

  case tokenTypes.FAILED: {
    const newValue = { ...payload, reducer_status: tokenTypes.FAILED };
    localStorage.setItem('token', JSON.stringify(newValue));
    return newValue;
  }

  default:
    return state;
  }
};

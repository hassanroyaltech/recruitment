import { companyIdTypes } from '../types/companyIdTypes';

const INITIAL_STATE = localStorage.getItem('company_id')
  ? localStorage.getItem('company_id')
  : '';

export const companyIdReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case companyIdTypes.REQUEST:
    return INITIAL_STATE;
  case companyIdTypes.DELETE:
    return null;

  case companyIdTypes.SUCCESS:
    if (!localStorage.getItem('company_id'))
      localStorage.setItem('company_id', payload);
    return payload;

  case companyIdTypes.FAILED:
    return INITIAL_STATE;

  case companyIdTypes.RESET:
    return INITIAL_STATE;

  default:
    return state;
  }
};

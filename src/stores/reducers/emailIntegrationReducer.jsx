import { EmailIntegrationAccountTypes } from '../types/emailIntegrationTypes';

const INITIAL_STATE = localStorage.getItem('nylasAccountInfo')
  ? JSON.parse(localStorage.getItem('nylasAccountInfo'))
  : '';

export const emailIntegrationReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case EmailIntegrationAccountTypes.DELETE:
    return null;
  case EmailIntegrationAccountTypes.SUCCESS:
    return { ...payload, reducer_status: EmailIntegrationAccountTypes.SUCCESS };

  case EmailIntegrationAccountTypes.FAILED:
    return { ...payload, reducer_status: EmailIntegrationAccountTypes.FAILED };

  case EmailIntegrationAccountTypes.RESET:
    return { ...INITIAL_STATE };

  default:
    return state;
  }
};

import { AccountTypes } from '../types/accountTypes';

const INITIAL_STATE = localStorage.getItem('account')
  ? JSON.parse(localStorage.getItem('account'))
  : '';

export const accountReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case AccountTypes.SUCCESS:
    localStorage.setItem(
      'account',
      JSON.stringify({ ...payload, reducer_status: AccountTypes.SUCCESS }),
    );
    return { ...payload, reducer_status: AccountTypes.SUCCESS };

  case AccountTypes.FAILED:
    localStorage.setItem(
      'account',
      JSON.stringify({ ...payload, reducer_status: AccountTypes.FAILED }),
    );
    return { ...payload, reducer_status: AccountTypes.FAILED };

  case AccountTypes.RESET:
    localStorage.setItem(
      'account',
      JSON.stringify({ ...INITIAL_STATE, reducer_status: AccountTypes.RESET }),
    );
    return { ...INITIAL_STATE, reducer_status: AccountTypes.RESET };

  case AccountTypes.UPDATE_LIST:
    localStorage.setItem(
      'account',
      JSON.stringify({
        ...state,
        accountsList: payload,
        reducer_status: AccountTypes.UPDATE_LIST,
      }),
    );
    return {
      ...state,
      accountsList: payload,
      reducer_status: AccountTypes.UPDATE_LIST,
    };

  case AccountTypes.UPDATE_ACCOUNT:
    localStorage.setItem(
      'account',
      JSON.stringify({
        ...state,
        account_uuid: payload,
        reducer_status: AccountTypes.UPDATE_ACCOUNT,
      }),
    );
    return {
      ...state,
      account_uuid: payload,
      reducer_status: AccountTypes.UPDATE_ACCOUNT,
    };
  case AccountTypes.DELETE:
    localStorage.removeItem('account');
    return null;

  default:
    return state;
  }
};

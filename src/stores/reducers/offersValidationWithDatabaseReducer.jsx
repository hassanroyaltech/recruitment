import { OffersValidationWithDatabaseTypes } from '../types/offersValidationWithDatabaseTypes';

const INITIAL_STATE = localStorage.getItem('offerValidationWithDatabase')
  ? JSON.parse(localStorage.getItem('offerValidationWithDatabase'))
  : '';

export const offersValidationWithDatabaseReducer = (
  state = INITIAL_STATE,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
  case OffersValidationWithDatabaseTypes.SUCCESS:
    return {
      ...payload,
      reducer_status: OffersValidationWithDatabaseTypes.SUCCESS,
    };

  case OffersValidationWithDatabaseTypes.FAILED:
    return {
      ...payload,
      reducer_status: OffersValidationWithDatabaseTypes.FAILED,
    };

  case OffersValidationWithDatabaseTypes.RESET:
    return { ...INITIAL_STATE };

  default:
    return state;
  }
};

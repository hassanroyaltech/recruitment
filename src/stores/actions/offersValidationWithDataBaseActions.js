import { OffersValidationWithDatabaseTypes } from '../types/offersValidationWithDatabaseTypes';
/**
 * update offer validation with database handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateOffersValidationWithDatabase(payload) {
  localStorage.setItem('offerValidationWithDatabase', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: OffersValidationWithDatabaseTypes.SUCCESS,
      payload,
    });
  };
}

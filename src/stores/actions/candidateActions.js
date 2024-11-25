import { CandidateUserTypes } from '../types/candidateUserTypes';
import { CandidateTypes } from '../types/candidateTypes';
/**
 * update user handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateCandidateUser(payload) {
  sessionStorage.setItem('candidate_user_data', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: CandidateUserTypes.SUCCESS,
      payload,
    });
  };
}

export function removeCandidateUser() {
  sessionStorage.removeItem('candidate_user_data');
  sessionStorage.removeItem('signed');
  return (dispatch) => {
    dispatch({
      type: CandidateUserTypes.CLEAR,
    });
  };
}

/**
 * update candidate user data
 * @param payload
 * @returns {function(*): void}
 */
export function updateCandidate(payload) {
  localStorage.setItem('candidateReducer', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: CandidateTypes.SUCCESS,
      payload,
    });
  };
}

export function removeCandidate() {
  return (dispatch) => {
    dispatch({
      type: CandidateTypes.CLEAR,
    });
  };
}
export function submittedCandidate(payload) {
  return (dispatch) => {
    dispatch({
      type: CandidateTypes.SUBMITTED,
      payload,
    });
  };
}
export function rejectedCandidate(payload) {
  return (dispatch) => {
    dispatch({
      type: CandidateTypes.REJECTED,
      payload,
    });
  };
}

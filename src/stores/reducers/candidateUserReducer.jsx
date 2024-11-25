import { CandidateUserTypes } from '../types/candidateUserTypes';

const INITIAL_STATE = sessionStorage.getItem('candidate_user_data')
  ? JSON.parse(sessionStorage.getItem('candidate_user_data'))
  : '';

export const candidateUserReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case CandidateUserTypes.SUCCESS:
    return { ...payload, reducer_status: CandidateUserTypes.SUCCESS };

  case CandidateUserTypes.FAILED:
    return { ...payload, reducer_status: CandidateUserTypes.FAILED };

  case CandidateUserTypes.RESET:
    return { ...INITIAL_STATE };

  case CandidateUserTypes.CLEAR:
    return null;

  default:
    return state;
  }
};

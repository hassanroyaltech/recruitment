import { CandidateTypes } from '../types/candidateTypes';

const INITIAL_STATE = localStorage.getItem('candidateReducer')
  ? JSON.parse(localStorage.getItem('candidateReducer'))
  : '';

export const candidateReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case CandidateTypes.SUCCESS:
    localStorage.setItem(
      'candidateReducer',
      JSON.stringify({ ...payload, reducer_status: CandidateTypes.SUCCESS }),
    );
    return { ...payload, reducer_status: CandidateTypes.SUCCESS };

  case CandidateTypes.FAILED:
    localStorage.setItem(
      'candidateReducer',
      JSON.stringify({ ...payload, reducer_status: CandidateTypes.FAILED }),
    );
    return { ...payload, reducer_status: CandidateTypes.FAILED };

  case CandidateTypes.RESET:
    localStorage.setItem(
      'candidateReducer',
      JSON.stringify({ ...INITIAL_STATE, reducer_status: CandidateTypes.RESET }),
    );
    return { ...INITIAL_STATE, reducer_status: CandidateTypes.RESET };
  case CandidateTypes.SUBMITTED: {
    const submittedForms = state.submittedForms || [];
    submittedForms.push({
      ...payload,
      status: CandidateTypes.SUBMITTED,
    });
    localStorage.setItem(
      'candidateReducer',
      JSON.stringify({
        ...state,
        submittedForms,
        reducer_status: CandidateTypes.SUBMITTED,
      }),
    );
    return {
      ...state,
      submittedForms,
      reducer_status: CandidateTypes.SUBMITTED,
    };
  }
  case CandidateTypes.REJECTED: {
    const submittedForms = state.submittedForms || [];
    submittedForms.push({
      ...payload,
      status: CandidateTypes.REJECTED,
    });
    localStorage.setItem(
      'candidateReducer',
      JSON.stringify({
        ...state,
        submittedForms,
        reducer_status: CandidateTypes.REJECTED,
      }),
    );
    return {
      ...state,
      submittedForms,
      reducer_status: CandidateTypes.REJECTED,
    };
  }
  case CandidateTypes.CLEAR:
    localStorage.removeItem('candidateReducer');
    return null;

  default:
    return state;
  }
};

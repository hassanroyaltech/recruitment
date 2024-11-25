import {
  GET_JOB_DETAIL_REQUEST,
  GET_JOB_DETAIL_SUCCESS,
  GET_JOB_DETAIL_FAILED,
  GET_JOB_PIPELINE_REQUEST,
  GET_JOB_PIPELINE_SUCCESS,
  GET_JOB_PIPELINE_FAILED,
  RESET_PIPELINE,
} from '../types/jobTypes';

const INITIAL_STATE = {
  loading: false,
  currentJob: null,
  currentPipeline: null,
};

export default function jobReducer(state = INITIAL_STATE, action) {
  const { type } = action;

  switch (type) {
  /** Get job detail */
  case GET_JOB_DETAIL_REQUEST:
    return {
      ...state,
      loading: true,
    };
  case GET_JOB_DETAIL_SUCCESS: {
    const { payload } = action;
    return {
      ...state,
      currentJob: payload,
      loading: false,
    };
  }
  case GET_JOB_DETAIL_FAILED:
    return { ...state, loading: false, currentJob: null };

    /** Get job pipeline */
  case GET_JOB_PIPELINE_REQUEST:
    return {
      ...state,
      loading: true,
    };
  case GET_JOB_PIPELINE_SUCCESS: {
    const { payload } = action;
    return {
      ...state,
      currentPipeline: payload,
      loading: false,
    };
  }
  case GET_JOB_PIPELINE_FAILED:
    return {
      ...state,
      loading: false,
      currentPipeline: null,
    };

  case RESET_PIPELINE:
    return {
      loading: false,
      currentJob: null,
      currentPipeline: null,
    };

  default:
    return state;
  }
}

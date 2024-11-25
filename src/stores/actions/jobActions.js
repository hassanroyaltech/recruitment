// Import custom redux types
import { evarecAPI } from 'api/evarec';
import {
  GET_JOB_LIST_REQUEST,
  GET_JOB_DETAIL_REQUEST,
  GET_JOB_DETAIL_FAILED,
  GET_JOB_DETAIL_SUCCESS,
  GET_JOB_PIPELINE_REQUEST,
  GET_JOB_PIPELINE_SUCCESS,
  GET_JOB_PIPELINE_FAILED,
  GET_CANDIDATE_DETAIL_REQUEST,
  GET_CANDIDATE_DETAIL_SUCCESS,
  GET_CANDIDATE_DETAIL_FAILED,
  RESET_PIPELINE,
} from '../types/jobTypes';

// Import mock data
import {
  jobDetailMockData,
  jobPipelineMockData,
  candidateDetailMockData,
} from '../../pages/evarec/services/mockData';

// API

/**
 * Get a list of jobs
 * @param payload
 * @returns {function(*): void}
 */
export function getJobList(payload) {
  return (dispatch) => {
    dispatch({
      type: GET_JOB_LIST_REQUEST,
      payload,
    });
  };
}

export function resetPipeline() {
  return (dispatch) => {
    dispatch({
      type: RESET_PIPELINE,
    });
  };
}

/**
 * Views a job's details
 * @param uuid
 * @returns {function(*): Promise<any|null|undefined>}
 */
export function getJobDetail(uuid) {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem('user'))?.results;

    dispatch({
      type: GET_JOB_DETAIL_REQUEST,
    });

    // TODO: Remove this part to use data from backend api
    // dispatch({
    //   type: GET_JOB_DETAIL_SUCCESS,
    //   payload: jobDetailMockData.results,
    // });
    //
    // return jobDetailMockData.results;

    evarecAPI
      .viewJob(uuid)
      .then((result) => {
        dispatch({
          type: GET_JOB_DETAIL_SUCCESS,
          payload: result.data.results,
        });
        return result.data.results;
      })
      .catch((e) => {
        console.log(e);
        dispatch({
          type: GET_JOB_DETAIL_FAILED,
        });

        return null;
      });
  };
}

/**
 * This is already built in Redux and using a different format will prove
 * consequential. When refactored into an ordinary API request, it enters an
 * infinite loop of requests.
 * @param uuid
 * @param params
 * @returns {function(*): Promise<*|null|undefined>}
 */
export function getJobPipeline(uuid, params) {
  return async (dispatch) => {
    // Dispatch "get" message
    dispatch({
      type: GET_JOB_PIPELINE_REQUEST,
    });

    // TODO: Remove this part to use data from backend api
    // dispatch({
    //   type: GET_JOB_PIPELINE_SUCCESS,
    //   payload: jobPipelineMockData.results,
    // });
    //
    // return jobPipelineMockData.results;

    // TODO: Uncomment to re-enable API
    evarecAPI
      .getPipeline({ uuid, params })
      .then((result) => {
        // Dispatch "success" message
        dispatch({
          type: GET_JOB_PIPELINE_SUCCESS,
          payload: result.data.results,
        });
        return result.data.results;
      })
      .catch((e) => {
        // Dispatch "failed" message
        dispatch({
          type: GET_JOB_PIPELINE_FAILED,
        });
        console.log(e);
        return null;
      });
  };
}

/**
 * This is the Applicant Modal, there is no specific request for this yet.
 * So we are using the mock data to map out what we need.
 * Some information should be passed from the card (as obtained in the pipeline)
 * such as the user's name, email, etc...
 *
 * Tab information is currently scattered over multiple requests and endpoints.
 *
 * @param uuid
 * @returns {function(*): Promise<any|null|undefined>}
 */
export function getJobCandidate(uuid) {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem('user'))?.results;

    dispatch({
      type: GET_CANDIDATE_DETAIL_REQUEST,
    });

    // TODO: Remove this part to use data from backend api
    // dispatch({
    //   type: GET_CANDIDATE_DETAIL_SUCCESS,
    //   payload: candidateDetailMockData.results,
    // });
    //
    // return candidateDetailMockData.results;

    // TODO: Uncomment to re-enable API
    evarecAPI
      .getCandidate(uuid)
      .then((result) => {
        dispatch({
          type: GET_CANDIDATE_DETAIL_SUCCESS,
          payload: result.data.results,
        });

        return result.data.results;
      })
      .catch((e) => {
        dispatch({
          type: GET_CANDIDATE_DETAIL_FAILED,
        });

        return null;
      });
  };
}

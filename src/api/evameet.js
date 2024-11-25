/**
 * API class containing all APIs that are used in EVA-MEET.
 *
 * @example
 * // To get weights
 * let api = new evameetAPI(body).getWeights();
 *
 * @example
 * // To update weights
 * let api = new evameetAPI(body).updateWeights();
 */

// Headers
import { generateHeaders } from 'api/headers';

// URLs
import urls from 'api/urls';

// Axios
import axios from 'api/middleware';

/**
 * Get a list of all meetings
 * @param type
 * @param sizePerPage
 * @param page
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getAllMeetings(type, sizePerPage, page) {
  return axios.get(
    type,
    {
      params: {
        limit: sizePerPage,
        page,
      },
      headers: generateHeaders(),
    },
  );
}
/**
 * Get a list of all Interviews (previous, incoming)
 * @param is_upcoming
 * @param page
 * @param limit
 */
async function getAllInterviews(is_upcoming, page, limit) {
  return axios.get(
    urls.overview.interviews_GET,
    {
      params: {
        is_upcoming,
        page,
        limit
      },
      headers: generateHeaders(),
    },
  );
}

/**
 * Create scheduled Interview
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function scheduleInterview(data) {
  return axios
    .post(
      urls.overview.interviews_WRITE,
      data,
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * View scheduled Interview
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function viewScheduleInterview(uuid) {
  return axios.request(urls.overview.interviews_GET,
    {
      method: 'view',
      params: {
        uuid,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update scheduled Interview
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateScheduleInterview(data) {
  return axios
    .put(
      urls.overview.interviews_WRITE,
      data,
      {
        header: {
          Accept: 'application/json',
        },
        headers: generateHeaders(),
      });
}

/**
 * Cancel scheduled Interview
 * @param uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function cancelScheduleInterview(uuid) {
  return axios.delete(
    urls.overview.interviews_WRITE, {
      headers: generateHeaders(),
      params: {
        uuid,
      },
    },
  );
}

/**
 * Delete a meeting
 * @returns {Promise<void>}
 * @constructor
 */
export async function DeleteMeeting() {
  return Promise.resolve();
}

/**
 * Export the API service
 */
export const evameetAPI = {
  getAllMeetings,
  DeleteMeeting,
  getAllInterviews,
  scheduleInterview,
  updateScheduleInterview,
  viewScheduleInterview,
  cancelScheduleInterview,

};

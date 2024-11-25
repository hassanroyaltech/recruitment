/** A service containing all APIs that are used commonly throughout the system
 *
 * @example
 * import { preferencesAPI } from 'api/preferences';
 *
 * @example
 * // To obtain a list of career levels
 * commonAPI.getCareerLevels();
 *
 */

// Axios
import axios from 'api/middleware';

// Headers
import { generateHeaders } from 'api/headers';

// URLs
import urls from 'api/urls';

/**
 * Get the list of pipelines from recruiter preferences
 * @param lang
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getPipelineList() {
  return axios.get(urls.preferences.pipelineDropdown, {
    headers: generateHeaders(),
  });
  // return axios.get(
  //   urls.preferences.pipelineList,
  //   {
  //     params: {
  //       language_id: lang[0].id,
  //     },
  //     headers: generateHeaders(),
  //   },
  //
  // );

  // Implementation in fetch [Not playing around with this.]
  // const languageId = lang[0].id;
  // const requestOptions = {
  //   method: 'GET',
  //   headers: generateHeaders(),
  // };
  //
  // const response = await fetch(
  //   `${urls.preferences.pipelineDropdown}`,
  //   requestOptions,
  // );
  // return response.json();
}

/**
 * Obtain the list of templates available
 * @returns {Promise<any>}
 */
async function getTemplates(params) {
  return axios.get(urls.evarec.ats.TEMPLATES_DROPDOWN, {
    headers: generateHeaders(),
    params,
  });
}

async function getTemplateBySlug(slug, languageId, pipeline_uuid) {
  return axios.request({
    method: 'view',
    url: urls.preferences.MailTemplateBySlug,
    headers: generateHeaders(),
    params: {
      slug,
      language_id: languageId,
      pipeline_uuid: pipeline_uuid,
    },
  });
}

/**
 * View Mail template by ID
 * @param {} id
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getTemplateById(id) {
  return axios.request({
    method: 'view',
    url: urls.preferences.emailtemplates,
    headers: generateHeaders(),
    params: {
      id,
    },
  });
}
/**
 * Get data for email annotations
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getEmailVariables() {
  return axios.get(urls.preferences.TEMPLATES_COLLECTION, {
    headers: generateHeaders(),
  });
}

async function CreatePermission(params) {
  return axios.post(urls.company.profileBuilderWRITE, params, {
    headers: generateHeaders(),
  });
}
async function UpdatePermission(params) {
  return axios.put(urls.company.profileBuilderWRITE, params, {
    headers: generateHeaders(),
  });
}

async function FindPermission(uuid) {
  return axios.request(urls.company.profileBuilderGET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

async function DeletePermission(uuid) {
  return axios.delete(urls.company.profileBuilderWRITE, {
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

async function getPermissionData(params) {
  return axios.get(urls.company.profileBuilderGET, {
    headers: generateHeaders(),
    params,
  });
}

async function getPermissionOptions() {
  return axios.get(urls.company.profileBuilderOptions, {
    headers: generateHeaders(),
  });
}

/**
 * Create Evaluation Function
 * @returns {Promise<any>}
 */
async function CreateEvaluation(params) {
  return axios.post(urls.preferences.EVALUATION_WRITE, params, {
    headers: generateHeaders(),
  });
}

/**
 * Update Evaluation Function
 * @returns {Promise<any>}
 */
async function UpdateEvaluation(params) {
  return axios.put(urls.preferences.EVALUATION_WRITE, params, {
    headers: generateHeaders(),
  });
}

/**
 * Find Evaluation Function
 * @returns {Promise<any>}
 */
async function FindEvaluation(uuid) {
  return axios.request(urls.preferences.EVALUATION_GET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Delete Evaluation Function
 * @returns {Promise<any>}
 */
async function DeleteEvaluation(uuid) {
  return axios.delete(urls.preferences.EVALUATION_WRITE, {
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Evaluation Data Function
 * @returns {Promise<any>}
 */
async function getEvaluationData(params) {
  return axios.get(urls.preferences.EVALUATION_GET, {
    params,
    headers: generateHeaders(),
  });
}

/**
 * Get Stages Data
 * @param {pipeline_uuid}
 * @returns {Promise<any>}
 */
async function getStagesData(pipeline_uuid) {
  return axios.get(urls.preferences.STAGES_DROPDOWN, {
    params: {
      pipeline_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Exports a preferencesAPI service
 * @type {{
 *   getPipelineList: (function(): Promise<*>)
 * }}
 */
export const preferencesAPI = {
  getPipelineList,
  getTemplates,
  getTemplateBySlug,
  getTemplateById,
  getPermissionOptions,
  getPermissionData,
  getEmailVariables,
  DeletePermission,
  FindPermission,
  UpdatePermission,
  CreatePermission,
  CreateEvaluation,
  UpdateEvaluation,
  FindEvaluation,
  DeleteEvaluation,
  getEvaluationData,
  getStagesData,
};

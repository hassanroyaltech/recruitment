/**  A service containing all APIs that are used commonly throughout the system
 *
 *
 * @example
 * // To obtain a list of career levels
 * commonAPI.getCareerLevels();
 *
 * @example
 * // To obtain a list of countries
 * commonAPI.getCountries();
 *
 * @example
 * // To obtain a list of degrees
 * commonAPI.getDegrees();
 *
 * @example
 * // To obtain a list of evaluations
 * commonAPI.getEvaluations();
 *
 * @example
 * // To obtain a list of industries
 * commonAPI.getIndustries();
 *
 * @example
 * // To obtain a list of majors
 * commonAPI.getJobMajors();
 *
 * @example
 * // To obtain a list of job types
 * commonAPI.getJobTypes();
 *
 * @example
 * // To obtain a list of languages
 * commonAPI.getLanguages();
 *
 * @example
 * // To obtain a list of nationalities
 * commonAPI.getNationalities();
 *
 *  @example
 * // To obtain a list of profile builder requirements
 * commonAPI.getProfileBuildersList();
 *
 * @example
 * // To obtain a list of questionnaires
 * commonAPI.getQuestionnaires();
 *
 * @example
 * // To obtain a reference number (for a role)
 * commonAPI.getReferenceNumber();
 */
// Axios
import axios from 'api/middleware';

// Headers
import { generateHeaders } from 'api/headers';

// URLs
import urls from 'api/urls';
import { HttpServices } from '../helpers';

/**
 * Upload media of any kind: (pdfs, docx, mp4, etc..)
 * @param formData
 * @returns {Promise<*>}
 */
async function createMedia(formData) {
  return axios.post(urls.common.media, formData, {
    headers: generateHeaders(),
    onUploadProgress: (progressEvent) => console.log(progressEvent),
  });
}

/**
 * Upload media for specific candidate
 * @param {job_candidate_uuid, media_uuid}
 * @returns {Promise<*>}
 * @note media_uuid is the result from createMedia API response
 */
async function uploadMedia(job_candidate_uuid, media_uuid) {
  return axios.post(
    urls.common.CREATE_MEDIA,
    {
      job_candidate_uuid,
      media_uuid,
    },
    {
      headers: generateHeaders(),
    }
  );
}

/**
 * Delete any stored media
 * @param params
 * @returns {Promise<*>}
 */
async function deleteMedia(params) {
  return axios.delete(urls.common.media, {
    params,
    headers: generateHeaders(),
  });
}

/**
 * Async function to get job types
 * @returns {Promise<any>}
 * @constructor
 */
async function getJobTypes({ status }) {
  const queryList = [];
  if (status) queryList.push(`status=${status}`);

  return axios.get(`${urls.helpers.JOB_TYPES}?${queryList.join('&')}`, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get job majors
 * @returns {Promise<any>}
 * @constructor
 */
async function getJobMajors() {
  return axios.get(urls.helpers.JOB_MAJORS, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get career levels
 * @returns {Promise<any>}
 * @constructor
 */
async function getCareerLevels({ status }) {
  const queryList = [];
  if (status) queryList.push(`status=${status}`);

  return axios.get(`${urls.helpers.CAREER_LEVEL}?${queryList.join('&')}`, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get industries
 * @returns {Promise<any>}
 * @constructor
 */
async function getIndustries() {
  return axios.get(urls.helpers.INDUSTRY, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Degrees
 * @returns {Promise<any>}
 * @constructor
 */
async function getDegrees() {
  return axios.get(urls.helpers.DEGREE_TYPES, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Reference Number
 * @returns {Promise<any>}
 * @constructor
 */
async function getReferenceNumber() {
  return axios.get(urls.evarec.ats.reference_number, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Languages
 * @returns {Promise<any>}
 * @constructor
 */
async function getLanguages({ status }) {
  const queryList = [];
  if (status) queryList.push(`status=${status}`);

  return axios.get(`${urls.helpers.LANGUAGES_PROFICIENCY}?${queryList.join('&')}`, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get countries
 * @returns {Promise<any>}
 * @constructor
 */
async function getCountries({ status }) {
  const queryList = [];
  if (status) queryList.push(`status=${status}`);

  return axios.get(`${urls.helpers.GET_COUNTRIES}?${queryList.join('&')}`, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Nationalities
 * @returns {Promise<any>}
 * @constructor
 */
async function getNationalities({ status }) {
  const queryList = [];
  if (status) queryList.push(`status=${status}`);

  return axios.get(`${urls.helpers.nationality}?${queryList.join('&')}`, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Evaluations
 * @returns {Promise<any>}
 * @constructor
 */
async function getEvaluations() {
  return axios.get(urls.evaluation_dropdown, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Categories
 * @returns {Promise<any>}
 * @constructor
 */
async function getCategories() {
  return axios.get(urls.evarec.ats.CATEGORY_DROPDOWN, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get ProfileBuilder requirements on signup
 * @returns {Promise<any>}
 * @constructor
 */
async function getProfileBuildersList(pipeline_uuid) {
  return axios.get(urls.company.profileBuilderList, {
    params: { pipeline_uuid },
    headers: generateHeaders(),
  });
}

/**
 * Async function to get company providers
 * @returns {Promise<any>}
 * @constructor
 */
async function getCompanyProvider(type) {
  return axios.get(urls.common.CHECK_PROVIDERS, {
    params: { type },
    headers: generateHeaders(),
  });
}

/**
 * Async function to get email templates
 * @returns {Promise<any>}
 * @constructor
 */
async function getEmailTemplates() {
  return axios.get(urls.preferences.emailtemplates, {
    headers: generateHeaders(),
  });
}

/**
 * Get offer list
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getOffersList() {
  return axios.get(urls.preferences.OFFER_DROPDOWN, {
    headers: generateHeaders(),
  });
}

/**
 * Get annotation list
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getAnnotationList() {
  return axios.get(urls.preferences.OFFERS_COLLECTION, {
    headers: generateHeaders(),
  });
}

/**
 * view offer
 * @param offer_uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function viewOffers(uuid) {
  return axios.request(urls.preferences.OFFER, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get default offer Slug
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getOfferSlug(slug, language_id) {
  return axios.get(urls.preferences.TEMPLATE_BY_SLUG, {
    params: {
      slug,
      language_id,
    },
    headers: generateHeaders(),
  });
}

/**
 * Send Offer Function
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function sendOffer(data) {
  return axios.post(urls.preferences.SEND_OFFER, data, {
    headers: generateHeaders(),
  });
}

/**
 * Send Offer Function (RMS)
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function sendOfferRMS(data) {
  return axios.post(urls.evarec.rms.SEND_OFFER, data, {
    headers: generateHeaders(),
  });
}

/**
 *
 * @param token
 * @returns {Promise<*>}
 */
async function sendUserDeviceToken(token) {
  return axios.post(
    urls.helpers.DEVICE_TOKEN,
    {
      device_token: token,
    },
    {
      headers: generateHeaders(),
    }
  );
}

/**
 * Async function to get Timezones
 * @returns {Promise<any>}
 * @constructor
 */
async function getTimeZones() {
  return axios.get(urls.helpers.TIMEZONE, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Overview Cards statistics
 * @returns {Promise<any>}
 * @constructor
 */
async function getOverviewStatistics(from, to) {
  return axios.get(urls.overview.statistics, {
    params: {
      from,
      to,
    },
    headers: generateHeaders(),
  });
}

/**
 * Async function to get Ads Card Data
 * @returns {Promise<any>}
 * @constructor
 */
async function getAdsData() {
  return HttpServices.get(urls.helpers.ELEVATUS_ADS);
}

/**
 * Async function to get Chart statistics
 * @returns {Promise<any>}
 * @constructor
 */
async function getChartStatistics() {
  return HttpServices.get(urls.overview.CHART_STATISTICS);
}

/**
 * Async function to get File Types
 * @returns {Promise<any>}
 * @constructor
 */
async function getFileTypes() {
  return axios.get(urls.helpers.FILE_TYPES, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get File Types
 * @returns {Promise<any>}
 * @constructor
 */
async function getFileSizes() {
  return axios.get(urls.helpers.FILE_SIZES, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get chainer keywords from YoshiGraph API
 * @returns {Promise<any>}
 * @constructor
 */
async function getChainerKeywords(role) {
  // Define a request object
  const requestOptions = {
    method: 'POST',
    body: {
      uuid: 'c6487deb-a3cf-481d-8653-eb9dd87f6988',
      input: {
        orientation: 1,
        lang_code: 'en',
        N: 10,
        data: {
          ROLE: role,
        },
      },
    },
  };
  // Use fetch to perform the request
  const response = await fetch(
    'http://35.204.147.16:80/api/v1/yoshigraph/inference/chainer',
    requestOptions
  );
  // Return Data
  return response.json();
}

/**
 * Exports a commonAPI service
 * @type {{
 *   createMedia: (function(): Promise<*>)
 *   deleteMedia: (function(): Promise<*>)
 *   uploadMedia: (function(): Promise<*>)
 *   getProfileBuildersList: (function(): Promise<*>),
 *   getCountries: (function(): Promise<*>),
 *   getCareerLevels: (function(): Promise<*>),
 *   getDegrees: (function(): Promise<*>),
 *   getJobMajors: (function(): Promise<*>),
 *   getLanguages: (function(): Promise<*>),
 *   getIndustries: (function(): Promise<*>),
 *   getEvaluations: (function(): Promise<*>),
 *   getNationalities: (function(): Promise<*>),
 *   getReferenceNumber: (function(): Promise<*>),
 *   getJobTypes: (function(): Promise<*>)
 * }}
 */
export const commonAPI = {
  createMedia,
  deleteMedia,
  uploadMedia,
  getCompanyProvider,
  getEmailTemplates,
  getCareerLevels,
  getCountries,
  getDegrees,
  getEvaluations,
  getCategories,
  getIndustries,
  getJobMajors,
  getJobTypes,
  getLanguages,
  getNationalities,
  getProfileBuildersList,
  getReferenceNumber,
  getTimeZones,
  getChainerKeywords,
  getOffersList,
  viewOffers,
  getAnnotationList,
  getOfferSlug,
  sendOffer,
  sendOfferRMS,
  getChartStatistics,
  getOverviewStatistics,
  getAdsData,
  getFileTypes,
  getFileSizes,
  sendUserDeviceToken,
};

/* eslint-disable camelcase */
/**
 * ----------------------------------------------------------------------------------
 * @title evassess.js
 * ----------------------------------------------------------------------------------
 * API service containing all APIs that are used in EVA-SSESS.
 *
 * @example
 * import { evassessAPI } from 'api/evassess';
 *
 * @example
 * // To obtain a list of assessment categories
 * evassessAPI.getVideoAssessmentCategories();
 *
 * @example
 * // To obtain a list of valid time limits to set in the assessment
 * evassessAPI.getVideoAssessmentTimeLimits();
 *
 * @example
 * // To obtain a list of 'number of retakes'
 * evassessAPI.getVideoAssessmentNumberOfRetakes();
 * ----------------------------------------------------------------------------------
 */

import urls from '../api/urls';
import { generateHeaders } from '../api/headers';
import { retrieveLanguage } from '../utils/functions/helpers';

import axios from 'api/middleware';

/**
 * Async function to get video assessment categories
 * @returns {Promise<any>}
 * @constructor
 */
async function getVideoAssessmentCategories() {
  return axios.get(urls.evassess.GET_CATEGORIES, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get video assessment time limits
 * @returns {Promise<any>}
 * @constructor
 */
async function getVideoAssessmentTimeLimits() {
  return axios.get(urls.evassess.time_limits, {
    headers: generateHeaders(),
  });
}

/**
 * Async function to get video assessment number of retakes
 * @returns {Promise<any>}
 * @constructor
 */
async function getVideoAssessmentNumberOfRetakes() {
  return axios.get(urls.evassess.number_of_retake, {
    headers: generateHeaders(),
  });
}

/**
 * Create an Assessment
 * @param title
 * @param pipeline
 * @param type
 * @param questions
 * @param emailSubject
 * @param emailBody
 * @param date
 * @param candidates
 * @param video
 * @param teams
 * @param candidatesFromCSV
 * @param selectedCategory
 * @param privacy
 * @param evaluation
 * @param attachment
 * @returns {Promise<any>}
 */
async function createAssessment(
  title,
  pipeline,
  type,
  questions,
  emailSubject,
  emailBody,
  date,
  candidates,
  video,
  teams,
  candidatesFromCSV,
  selectedCategory,
  privacy,
  evaluation,
  attachment,
  template_uuid,
) {
  const lang = retrieveLanguage();
  const list = [];
  for (let i = 0; i < candidates.length; i += 1)
    if (candidates[i].first_name && candidates[i].last_name && candidates[i].email)
      list.push(candidates[i]);

  return axios.post(
    urls.evassess.ASSESSMENT_WRITE,
    {
      language_id: lang[0].id,
      title,
      type: parseInt(type, 10),
      questions,
      user_invited: list.length > 0 ? list : [],
      email_subject: emailSubject,
      email_body: emailBody,
      deadline: date,
      video_uuid: video,
      media_uuid: candidatesFromCSV?.uuid,
      pipeline_uuid: pipeline,
      teams_invited: teams,
      // Added the uuid if the user close the modal without select, take the default.
      category_uuid: selectedCategory
        ? selectedCategory.uuid
        : '16124b56-344e-4b28-8871-ec988bdf4bb8',
      is_public: privacy === 'private' ? 0 : 1,
      evaluation_uuid: evaluation,
      attachment,
      template_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Edit an Assessment
 * @param uuid
 * @param title
 * @param pipeline
 * @param type
 * @param questions
 * @param emailSubject
 * @param emailBody
 * @param date
 * @param candidates
 * @param video
 * @param teams
 * @param candidatesFromCSV
 * @param selectedCategory
 * @param privacy
 * @param evaluation
 * @param attachment
 * @returns {Promise<any>}
 */
async function editAssessment(
  uuid,
  title,
  pipeline,
  type,
  questions,
  emailSubject,
  emailBody,
  date,
  candidates,
  video,
  teams,
  candidatesFromCSV,
  selectedCategory,
  privacy,
  evaluation,
  attachment,
  selectedCSV_file,
  template_uuid,
) {
  const lang = retrieveLanguage();
  const list = [];
  for (let i = 0; i < candidates.length; i += 1)
    if (candidates[i].first_name && candidates[i].last_name && candidates[i].email)
      list.push(candidates[i]);

  return axios.put(
    urls.evassess.ASSESSMENT_WRITE,
    {
      uuid,
      language_id: lang[0].id,
      title,
      type: parseInt(type, 10),
      questions,
      user_invited: list.length > 0 ? list : [],
      email_subject: emailSubject,
      email_body: emailBody,
      deadline: date,
      video_uuid: video,
      media_uuid: candidatesFromCSV?.uuid || selectedCSV_file?.[0]?.uuid,
      pipeline_uuid: pipeline,
      teams_invited: teams,
      category_uuid: selectedCategory ? selectedCategory.uuid : null,
      is_public: privacy === 'private' ? 0 : 1,
      evaluation_uuid: evaluation,
      attachment,
      csv_file: selectedCSV_file,
      template_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get a specific assessment
 * @param uuid
 * @returns {Promise<any>}
 */
async function getAssessment(uuid) {
  return axios.request(urls.evassess.ASSESSMENT_GET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get list of templates
 * @returns {Promise<any>}
 */
async function getTemplateList() {
  return axios.get(urls.evassess.template_dropdown, {
    headers: generateHeaders(),
  });
}

/**
 * Get a specific template (this is used for loading templates into the stepper)
 * @param uuid
 * @returns {Promise<any>}
 */
export async function getTemplate(uuid) {
  return axios.request(urls.evassess.template_GET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Search team members
 * @param name
 * @returns {Promise<any>}
 * @constructor
 */
export async function TeamSearch({ all }) {
  return axios.get(urls.evassess.TEAM_SEARCH, {
    headers: generateHeaders(),
    params: { all },
  });
}

/**
 * Add a comment to the assessment (used in modal)
 * @param prepAssessmentAnswerUuid
 * @param comment
 * @param mediaUuid
 * @returns {Promise<*>}
 */
async function addComment(prepAssessmentAnswerUuid, comment, mediaUuid) {
  return axios.post(
    urls.evassess.getComments_WRITE,
    {
      prep_assessment_answer_uuid: prepAssessmentAnswerUuid,
      comment,
      media_uuid: mediaUuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Delete a comment by uuid
 * @param UUID
 * @returns {Promise<*>}
 */
async function deleteComment(UUID) {
  return axios.delete(urls.evassess.getComments_WRITE, {
    headers: generateHeaders(),
    params: {
      uuid: UUID,
    },
  });
}

/**
 * Update Comments
 * @param uuid
 * @param comment
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateComment(uuid, comment) {
  return axios.put(
    urls.evassess.getComments_WRITE,
    {
      uuid,
      comment,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Delete a discussion by uuid
 * @param UUID
 * @returns {Promise<*>}
 */
async function deleteDiscussion(UUID) {
  return axios.delete(urls.evassess.getDiscussion_WRITE, {
    headers: generateHeaders(),
    params: {
      uuid: UUID,
    },
  });
}

/**
 * Get the discussion (used in modal)
 * @param candidateUuid
 * @param comment
 * @param mediaUuid
 * @returns {Promise<*>}
 */
async function getDiscussion(candidateUuid, comment, mediaUuid) {
  return axios.post(
    urls.evassess.getDiscussion_WRITE,
    {
      candidate_uuid: candidateUuid,
      comment,
      media_uuid: mediaUuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Share Candidate Profile
 * @param assessment_candidates_uuid
 * @param assessment_uuid
 * @param recruiters
 * @returns {Promise<*>}
 */
async function shareCandidateProfile(
  assessment_candidates_uuid,
  assessment_uuid,
  recruiters,
) {
  return axios.post(
    urls.evassess.SHARE_CANDIDATE,
    {
      assessment_candidates_uuid,
      assessment_uuid,
      recruiters,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get Shared Candidate Profiles
 * @param key
 * @returns {Promise<*>}
 */
async function getSharedCandidateProfile(key) {
  return axios.get(urls.evassess.VIEW_SHARED_CANDIDATE_GET, {
    params: {
      key,
    },
    headers: generateHeaders(),
  });
}
/**
 * Rate a candidate
 * @param rating
 * @param prep_assessment_answer_uuid
 * @returns {Promise<*>}
 */
async function rateCandidate(prep_assessment_candidate_uuid, rating) {
  return axios.post(
    urls.evassess.RATE_CANDIDATE_WRITE,
    {
      prep_assessment_candidate_uuid,
      rate: rating,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get the candidate rating by recruiter
 * @param recruiter_uuid
 * @param prep_assessment_answer_uuid
 * @returns {Promise<*>}
 */
async function getRecruiterRating(recruiter_uuid, prep_assessment_answer_uuid) {
  return axios.get(urls.evassess.Rating_GET, {
    headers: generateHeaders(),
    params: {
      recruiter_uuid,
      prep_assessment_answer_uuid,
    },
  });
}

/**
 * Get Recruiter rate
 * @param prep_assessment_candidate_uuid
 * @param recruiter_uuid
 * @returns {Promise<*>}
 */
async function getRecruiterRate(prep_assessment_candidate_uuid, recruiter_uuid) {
  return axios.get(urls.evassess.RATE_CANDIDATE_GET, {
    headers: generateHeaders(),
    params: {
      prep_assessment_candidate_uuid,
      recruiter_uuid,
    },
  });
}

/**
 * Get Discussion List by recruiter
 * @param candidate_uuid
 * @param recruiter_uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getDiscussionFiltered(candidate_uuid, recruiter_uuid) {
  return axios.get(urls.evassess.DISCUSSION_Filter, {
    params: {
      candidate_uuid,
      recruiter_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Active/Archived Assessments
 * @param limit
 * @param page
 * @param url
 * @returns {Promise<void>}
 */
async function getAssessments(url, limit, page) {
  return axios.get(url, {
    params: {
      limit,
      page: page + 1,
    },
    headers: generateHeaders(),
  });
}

/**
 * Export All Assessments
 * @returns {Promise<void>}
 */
const ExportAllAssessments = async () =>
  axios.get(urls.evassess.EXPORT_ALL_ASSESSMENTS, {
    headers: generateHeaders(),
  });

/**
 * Delete invite status
 * @returns {Promise<void>}
 */
const deleteInvitedStatus = async (assessment_uuid, assessment_invite_uuid) =>
  axios.post(
    urls.evassess.DELETE_INVITED_STATUS,
    {
      assessment_uuid: assessment_uuid,
      assessment_invite_uuid: assessment_invite_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );

/**
 * Export All Assessments
 * @returns {Promise<void>}
 */
const GetRemainingCredits = async () =>
  axios.get(urls.evassess.SUBSCRIPTION, {
    headers: generateHeaders(),
  });

/**
 * Invite Candidate In EVE-SSESS (Invite Status)
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
async function inviteCandidate(params) {
  return axios.put(urls.evassess.INVITE_CANDIDATE, params, {
    headers: generateHeaders(),
  });
}

/**
 * Get Invited Candidates (Invite Status)
 * @param data
 * @returns {Promise<void>}
 */
async function getInvitedCandidates(data) {
  return axios.get(urls.evassess.GET_INVITED_CANDIDATES, {
    params: data,
    headers: generateHeaders(),
  });
}

/**
 * Export Assessment from SAP
 * @returns {Promise<void>}
 */
async function getSapAssessments() {
  return axios.get(urls.evassess.EXPORTS_ASSESSMENTS_SAP, {
    headers: generateHeaders(),
  });
}

/**
 * Get Assessments Weights
 * @returns {Promise<any>}
 */
async function getWeights(data) {
  return axios.get(urls.evassess.GET_WEIGHTS_GET, {
    params: data,
    headers: generateHeaders(),
  });
}

/**
 * Update Assessments Weights
 * @returns {Promise<any>}
 */
async function updateWeights(data) {
  return axios.put(urls.evassess.GET_WEIGHTS_WRITE, data, {
    headers: generateHeaders(),
  });
}

/**
 * Get Invited Candidates Summary in Invite Status
 * @param uuid
 * @returns {Promise<any>}
 */
async function getCandidatesSummary(uuid, job_uuid) {
  return axios.get(urls.evassess.CANDIDATE_SUMMARY_GET, {
    params: {
      assessment_uuid: uuid,
      ...(job_uuid && { job_uuid }),
    },
    headers: generateHeaders(),
  });
}

/**
 * Update Invited Candidates Summary in Invite Status
 * @param uuid
 * @param event
 * @param job_uuid
 * @param deadline
 * @returns {Promise<any>}
 */
async function updateCandidatesSummary(uuid, event, job_uuid, deadline) {
  return axios.post(
    urls.evassess.CANDIDATE_SUMMARY_WRITE,
    {
      assessment_uuid: uuid,
      event,
      deadline,
      job_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Exports Candidates Rates Average
 * @param data
 * @returns {Promise<void>}
 */
async function exportCandidatesRates(data) {
  return axios.get(urls.evassess.EXPORT_CANDIDATES_RATES, {
    params: data,
    headers: generateHeaders(),
  });
}
/**
 * Get Candidate Questionnaire list
 * @param prep_assessment_candidate_uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
async function getCandidatesQuestionnaire(prep_assessment_candidate_uuid) {
  return axios.get(urls.evassess.CANDIDATES_QUESTIONNAIRES_LIST, {
    params: {
      prep_assessment_candidate_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Questionnaire details
 * @param assessmentCandidateUuid
 * @param questionnaireUuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getCandidatesQuestionnairesDetails(
  assessmentCandidateUuid,
  questionnaireUuid,
) {
  return axios.get(urls.evassess.VIEW_QUESTIONNAIRE, {
    params: {
      prep_assessment_candidate_uuid: assessmentCandidateUuid,
      questionnaire_uuid: questionnaireUuid || null,
    },
    headers: generateHeaders(),
  });
}

/**
 * Export EVA-SSESS service
 * @type {{
 *   getVideoAssessmentCategories: (function(): Promise<*>),
 *   getVideoAssessmentTimeLimits: (function(): Promise<*>),
 *   getVideoAssessmentNumberOfRetakes: (function(): Promise<*>)
 * }}
 */
export const evassessAPI = {
  getVideoAssessmentCategories,
  getVideoAssessmentNumberOfRetakes,
  getVideoAssessmentTimeLimits,
  createAssessment,
  editAssessment,
  getAssessment,
  getTemplateList,
  getTemplate,
  TeamSearch,
  addComment,
  deleteComment,
  updateComment,
  deleteDiscussion,
  getDiscussion,
  getDiscussionFiltered,
  shareCandidateProfile,
  getSharedCandidateProfile,
  rateCandidate,
  getRecruiterRating,
  getRecruiterRate,
  getAssessments,
  inviteCandidate,
  getInvitedCandidates,
  getSapAssessments,
  getWeights,
  updateWeights,
  getCandidatesSummary,
  updateCandidatesSummary,
  exportCandidatesRates,
  getCandidatesQuestionnaire,
  getCandidatesQuestionnairesDetails,
  ExportAllAssessments,
  deleteInvitedStatus,
  GetRemainingCredits,
};

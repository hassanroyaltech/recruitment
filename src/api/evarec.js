/* eslint-disable camelcase */
/**
 * API class containing all APIs that are used in EVA-REC.
 *
 * @example
 * import { evarecAPI } from 'api/evarec';
 *
 * @example
 * // To get weights
 * evarecAPI.getWeights(data);
 *
 * @example
 * // To update weights
 * evarecAPI.updateWeights(data);
 *
 * @example
 * // To create a job
 * evarecAPI.createJob(data);
 *
 * @example
 * // To update a job
 * evarecAPI.updateJob(data);
 *
 * @example
 * // To view a job
 * evarecAPI.viewJob(data);
 *
 * @example
 * // To get List of Jobs [paginated]
 * evarecAPI.getJobList(uuid, stageUUID, limit = 10, page = 0)
 *
 * @example
 * // To search for a job by title or reference number
 * evarecAPI.searchJob(query);
 *
 * @example
 * // To get an entire pipeline with its applicants
 * evarecAPI.getPipeline(uuid, params);
 *
 * @example
 * // To get the list of stages for a job
 * evarecAPI.getStages(jobUUID);
 *
 * @example
 * // To move candidate(s) to another stage
 * evarecAPI.moveToStage(
 *    prepJobUUID,
 *    prepJobStageUUID,
 *    prepJobCandidateUUID,
 *    moveId,
 *    action
 *  );
 *
 * @example
 * // To update the order of the stages [does not affect the pipeline
 * itself, just the appearance order]
 * evarecAPI.updateStageOrder(newStageOrder);
 *
 * @example
 * // Get candidate information [URL is not valid]
 * evarecAPI.getCandidate(uuid);
 *
 * @example
 * // Create a note
 * evarecAPI.createNote(jobUUID, note, media);
 *
 * @example
 * // Get the list of invited team members for a job
 * evarecAPI.getInvitedTeamsOnJob(jobUUID);
 *
 * @example
 * // Invite team members to a job
 * evarecAPI.inviteTeamMembers(jobUUID, teamMembersToInvite)
 */

// Headers
import { generateHeaders } from 'api/headers';

// Axios
import axios from 'api/middleware';

// URLs
import urls from 'api/urls';
import { PipelineBulkSelectTypesEnum, ProfileSourcesTypesEnum } from '../enums';
import { HttpServices } from '../helpers';

/**
 * Get Active/Archived Jobs
 * @param limit
 * @param url
 * @param page
 * @param search
 * @param filters
 * @returns {Promise<void>}
 */
async function getJobs(url, limit, page, search, filters) {
  return axios.get(url, {
    params: {
      limit,
      page: page + 1,
      query: search,
      ...filters,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get weights
 * @returns {Promise<any>}
 */
async function getWeights(data) {
  return axios.get(urls.evarec.ats.viewJob, {
    params: data,
    headers: generateHeaders(),
  });
}

/**
 * Update weights
 * @returns {Promise<any>}
 */
async function updateWeights(data) {
  return axios.put(urls.evarec.ats.MANAGE_WEIGHTS, data, {
    headers: generateHeaders(),
  });
}

/**
 * Update the stage order
 * @param jobUUID
 * @param newStageOrder
 * @returns Promise<AxiosResponse<any>>
 */
async function updateStageOrder(jobUUID, newStageOrder) {
  return axios.put(
    urls.evarec.ats.REORDER_STAGE,
    {
      job_uuid: jobUUID,
      uuid: newStageOrder,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Move to another stage
 * @param {uuid|null} jobUUID The job UUID
 * @param {uuid|null} jobStageUUID The stage UUID
 * @param {any[]|null} jobCandidateUUID The candidate UUID
 * @param {uuid|null} moveId The id of the move
 * @param {boolean|null} action The action of the move (do/undo)
 * @returns Promise<AxiosResponse<any>>
 */
async function moveToStage(
  jobUUID = null,
  jobStageUUID = null,
  jobCandidateUUID = null,
  moveId = null,
  action = null,
) {
  if (!moveId)
    return axios.put(
      urls.evarec.ats.MOVE_STAGE,
      {
        job_uuid: jobUUID,
        job_stage_uuid: jobStageUUID,
        job_candidate_uuid: jobCandidateUUID,
        // move_id: moveId,
        // action,
      },
      {
        headers: generateHeaders(),
      },
    );

  return axios.put(
    urls.evarec.ats.MOVE_STAGE,
    {
      move_id: moveId,
      action,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get a list of jobs (a pipeline)
 * @param uuid
 * @param stageUUID
 * @param limit
 * @param page
 * @returns {Promise<void>}
 */
async function getJobList(uuid, stageUUID, limit = 10, page = 0) {
  return axios.get(urls.evarec.ats.PIPELINE_STAGE, {
    params: {
      uuid,
      stage_uuid: stageUUID,
      limit,
      page: page + 1,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get a list of jobs (a pipeline)
 * @param jobUUID
 * @param stageUUID
 * @param limit
 * @param page
 * @param sort
 * @param { filters, tags, limit, page }
 * @returns {Promise<void>}
 */
async function getPipelineStage(
  jobUUID,
  stageUUID,
  sort,
  { filters, tags, limit, page },
) {
  return axios.get(urls.evarec.ats.GET_PIPELINE_STAGE, {
    params: {
      job_uuid: jobUUID,
      stage_uuid: stageUUID,
      order_type: sort ? sort.order_type : null,
      order_by: sort ? sort.order_by : null,
      limit,
      page,
      is_include:
        filters?.is_include === true || filters?.is_include === 'true' ? true : 0,
      major: filters?.major ? filters?.major.map((item) => item.uuid) : [],
      job_type: filters?.job_type ? filters?.job_type.map((item) => item.uuid) : [],
      degree_type: filters?.degree_type
        ? filters?.degree_type.map((item) => item.uuid)
        : [],
      industry: filters?.industry ? filters?.industry.map((item) => item.uuid) : [],
      career_level: filters?.career_level
        ? filters?.career_level.map((item) => item.uuid)
        : [],
      country: filters?.country ? filters?.country.map((item) => item.uuid) : [],
      nationality: filters?.nationality
        ? filters?.nationality.map((item) => item.uuid)
        : [],
      languages_proficiency: filters?.language
        ? filters?.language.map((item) => item.uuid)
        : [],
      gender: filters?.gender ? filters?.gender.uuid : null,
      years_of_experience:
        filters?.years_of_experience > 0 ? filters?.years_of_experience : null,
      score: filters?.score > 0 ? filters?.score : null,
      query: filters?.query ? filters?.query.map((item) => item) : [],
      tag: tags
        ?.filter((item) => item?.key)
        .map((item) => ({ ...item, value: item?.value.map((val) => val?.uuid) })),
      candidate_property: filters?.candidate_property,
      source_type: filters?.source_type && filters?.source_type.key,
      source_uuid:
        filters?.source_type?.key
        && (((filters?.source_type?.key === ProfileSourcesTypesEnum.Agency.key
          || filters?.source_type?.key === ProfileSourcesTypesEnum.University.key)
          && filters?.source?.user_uuid)
          || filters?.source?.uuid),
      assigned_employee_uuid: filters?.assigned_employee_uuid?.map(
        (it) => it?.user_uuid,
      ),
      assigned_user_uuid: filters?.assigned_user_uuid?.map((it) => it?.uuid),
    },
    headers: generateHeaders(),
  });
}

/**
 * Create an application (job)
 */
async function createJob(data) {
  return axios.post(urls.evarec.ats.job, data, {
    headers: generateHeaders(),
  });
}

/**
 * Update an application (job)
 */
async function updateJob(data) {
  return axios.put(urls.evarec.ats.job, data, {
    headers: generateHeaders(),
  });
}

/**
 * View an application
 * @param data
 * @returns {Promise<*>}
 */
async function viewJob(data) {
  return axios.get(urls.evarec.ats.viewJob, {
    params: {
      uuid: data,
    },
    headers: generateHeaders(),
  });
}

/**
 * A function to obtain the pipeline data from the indexer
 * - Used as a Redux Action under stores/actions/*
 * @param {filters,uuid, pipeline_uuid, params, filter, tags}
 * @returns {Promise<*>}
 */
async function getPipeline({ filters, uuid, pipeline_uuid, params, filter, tags }) {
  return axios.get(urls.evarec.ats.GET_PIPELINE, {
    params: {
      pipeline_uuid,
      job_uuid: uuid,
      is_include: filter?.is_include === true || filter?.is_include === 'true',
      major: filter?.major ? filter?.major.map((item) => item.uuid) : [],
      job_type: filter?.job_type ? filter?.job_type.map((item) => item.uuid) : [],
      degree_type: filter?.degree_type
        ? filter?.degree_type.map((item) => item.uuid)
        : [],
      industry: filter?.industry ? filter?.industry.map((item) => item.uuid) : [],
      career_level: filter?.career_level
        ? filter?.career_level.map((item) => item.uuid)
        : [],
      country: filter?.country ? filter?.country.map((item) => item.uuid) : [],
      nationality: filter?.nationality
        ? filter?.nationality.map((item) => item.uuid)
        : [],
      languages_proficiency: filter?.language
        ? filter?.language.map((item) => item.uuid)
        : [],
      gender: filter?.gender ? filter?.gender.uuid : null,
      years_of_experience:
        filter?.years_of_experience > 0 ? filter?.years_of_experience : null,
      score: filter?.score > 0 ? filter?.score : null,
      query: filter?.query || [],
      skills: filter?.skills || [],
      job_position: filter?.job_position || [],
      limit: 30,
      page: 0,
      national_id: filter?.national_id || null,
      candidate_name: filter?.candidate_name || null,
      reference_number: filter?.reference_number || null,
      applicant_number: filter?.applicant_number || null,
      tag: tags
        ?.filter((item) => item?.key)
        .map((item) => ({ ...item, value: item?.value.map((val) => val?.uuid) })),
      candidate_property: filters?.candidate_property,
      source_type: filters?.source_type && filters?.source_type.key,
      source_uuid:
        filters?.source_type?.key
        && (((filters?.source_type?.key === ProfileSourcesTypesEnum.Agency.key
          || filters?.source_type?.key === ProfileSourcesTypesEnum.University.key)
          && filters?.source?.user_uuid)
          || filters?.source?.uuid),
      assigned_employee_uuid: filter?.assigned_employee_uuid?.map(
        (it) => it?.user_uuid,
      ),
      assigned_user_uuid: filter?.assigned_user_uuid?.map((it) => it?.uuid),
      ...params,
    },
    headers: generateHeaders(),
  });
}

/**
 * Gets a candidate
 * @param profile_uuid
 * @param company_uuid
 * @returns {Promise<*>}
 */
async function getCandidate(profile_uuid, company_uuid = undefined) {
  return axios.get(urls.evarec.ats.CANDIDATE_PROFILE, {
    params: {
      profile_uuid,
    },
    headers: {
      ...generateHeaders(),
      'Accept-Company': company_uuid || generateHeaders()['Accept-Company'],
    },
  });
}

/**
 * Create a note
 * @param jobUUID
 * @param note
 * @param media
 * @returns Promise<AxiosResponse<any>>
 */
async function createNote(jobUUID, note, media) {
  return axios.post(
    urls.evarec.ats.NOTES,
    {
      job_uuid: jobUUID,
      note,
      media,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get the list of currently invited members on the job
 * @param url
 * @param jobUUID
 * @param job_candidates_uuid
 * @param is_team
 * @param type
 * @returns Promise<AxiosResponse<any>>
 */
async function getInvitedTeamsOnJob(
  url,
  jobUUID,
  job_candidates_uuid,
  is_team,
  type,
) {
  return axios.get(url, {
    params: {
      ...(type?.toLowerCase() === 'ats' ? { job_uuid: jobUUID } : { uuid: jobUUID }),
      job_candidates_uuid,
      is_team,
    },
    headers: generateHeaders(),
  });
}

/**
 * Invite team members to a job
 * @param url
 * @param jobUUID
 * @param teamMembersToInvite
 * @param type
 * @param {job_poster, job_recruiter}
 * @returns {Promise<any>}
 * @constructor
 */
async function inviteTeamMembers(
  url,
  jobUUID,
  teamMembersToInvite,
  type,
  { job_poster, job_recruiter },
) {
  return axios.put(
    url,
    {
      ...(type?.toLowerCase() === 'ats'
        ? { job_uuid: jobUUID, job_poster, job_recruiter }
        : { uuid: jobUUID }),
      teams_invited: teamMembersToInvite,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get the stages for a job pipeline (has a specific order)
 * @param jobUUID
 * @returns Promise<AxiosResponse<any>>
 */
export async function getStages(jobUUID) {
  return axios.get(urls.evarec.ats.JOB_STAGES, {
    params: {
      job_uuid: jobUUID,
    },
    headers: generateHeaders(),
  });
}

/**
 * Search for a job by title or reference number
 * @param query
 * @param uuid
 * @param action
 * @param use_for
 * @param category_code
 * @returns Promise<AxiosResponse<any>>
 */
async function searchJob(query, uuid, action, use_for, category_code) {
  let data = {};
  if (action === 'rms')
    data = {
      for_delete: query,
      candidate_uuid: uuid,
    };
  else
    data = {
      for_delete: query,
      profile_uuid: uuid,
      use_for,
      category_code,
    };

  return axios.get(urls.evarec.ats.ACTIVE, {
    params: data,
    headers: generateHeaders(),
  });
}

/**
 * Parse Job Template
 * @param formData
 * @returns Promise<AxiosResponse<any>>
 */
async function parseJobTemplate(formData) {
  return axios.post(urls.evarec.ats.PARSE_JOB_TEMPLATE, formData, {
    headers: generateHeaders(),
  });
}

/**
 * Get list of QuestionnaireByPipeline
 * @param pipeline_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getQuestionnaireByPipeline(pipeline_uuid) {
  return axios.get(urls.questionnaire.LIST_BY_PIPELINE, {
    params: {
      pipeline_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get the list of Video Assessments
 * @returns Promise<AxiosResponse<any>>
 */
async function getVideoAssessments() {
  return axios.get(urls.evassess.GET_VIDEO_ASSESSMENTS, {
    headers: generateHeaders(),
  });
}

/**
 * Send Video Assessments
 * @param job_uuid, prep_assessment_uuid, user_invited, deadline, type
 * @returns Promise<AxiosResponse<any>>
 * @note Two scenario to send video assessment inside popup modal || from pipeline tab => type param
 * determine which scenario
 */
async function SendVideoAssessment(
  job_uuid,
  prep_assessment_uuid,
  user_invited,
  deadline,
  type,
) {
  let params = null;
  if (type === 'popup')
    params = {
      job_uuid,
      prep_assessment_uuid: prep_assessment_uuid.map(
        (assessment) => assessment.value,
      ),
      user_invited: [
        { type: PipelineBulkSelectTypesEnum.Candidate.key, uuid: user_invited },
      ],
      deadline,
    };
  else
    params = {
      job_uuid,
      prep_assessment_uuid: prep_assessment_uuid.map(
        (assessment) => assessment.value,
      ),
      user_invited: user_invited.map((item) => ({
        type: PipelineBulkSelectTypesEnum.Candidate.key,
        uuid: item,
      })),
      deadline,
    };

  return axios.post(urls.evarec.ats.SEND_VIDEO_ASSESSMENT, params, {
    headers: generateHeaders(),
  });
}

// Job Candidate popup Modal => Functions to Connect Tabs

/**
 * Get Discussion List
 * @param job_candidate_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getDiscussionList(job_candidate_uuid, page, limit) {
  return axios.get(urls.evarec.ats.DISCUSSION_GET, {
    params: {
      job_candidate_uuid,
      page,
      limit,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Discussion List by recruiter
 * @param job_candidate_uuid
 * @param recruiter_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getDiscussion(job_candidate_uuid, recruiter_uuid) {
  return axios.get(urls.evarec.ats.DISCUSSION_Filter, {
    params: {
      job_candidate_uuid,
      recruiter_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Update Discussion
 * @param url
 * @param uuid
 * @param comment
 * @returns Promise<AxiosResponse<any>>
 */
async function updateDiscussion(url, uuid, comment) {
  return axios.put(
    url,
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
 * Get Candidate Rating List
 * @param job_candidate_uuid
 * @returns Promise<AxiosResponse<any>
 */
async function getCandidateRating(job_candidate_uuid) {
  return axios.get(urls.evarec.ats.CANDIDATE_RATING_LIST_GET, {
    params: {
      job_candidate_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Rate Candidate API
 * @param job_candidate_uuid
 * @param rating
 * @returns Promise<AxiosResponse<any>
 */

export const rateCandidate = async (job_candidate_uuid, rating) =>
  axios.post(
    urls.evarec.ats.CANDIDATE_RATING_LIST_WRITE,
    {
      job_candidate_uuid,
      rate: rating,
    },
    {
      headers: generateHeaders(),
    },
  );

/**
 * Get Attachments List
 * @param job_candidate_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getAttachments(job_candidate_uuid) {
  return axios.get(urls.evarec.ats.ATTACHMENTS_GET, {
    params: {
      job_candidate_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Delete Attachment API
 * @param job_candidate_uuid
 * @param uuid
 * @param media_uuid
 * @returns Promise<AxiosResponse<any>
 */
async function deleteAttachments(uuid, job_candidate_uuid, media_uuid) {
  return axios.delete(urls.evarec.ats.ATTACHMENTS_WRITE, {
    params: {
      uuid,
      job_candidate_uuid,
      media_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Evaluation list
 * @param uuid
 * @param job_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getEvaluation(candidate_uuid, job_uuid) {
  return axios.get(urls.evarec.ats.CANDIDATE_EVALUATION_GET, {
    params: {
      candidate_uuid,
      job_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get invited video assessments list
 * @param candidate_uuid
 * @param job_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getInvitedVideoAsessments(job_uuid, candidate_uuid) {
  return axios.get(urls.evarec.ats.INVITED_VIDEO_ASSESSMENT_LIST, {
    params: {
      job_uuid,
      candidate_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Candidate Questionnaire list
 * @param job_candidate_uuid
 * @returns Promise<AxiosResponse<any>>
 */
async function getCandidateQuestionnaire(job_candidate_uuid) {
  return axios.get(urls.evarec.ats.QUESTIONNAIRE_LIST, {
    params: {
      job_candidate_uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get Questionnaire details
 * @param jobCandidateUuid
 * @param questionnaireUuid
 * @param isSignupQuestionnaire
 * @returns Promise<AxiosResponse<any>>
 */
async function getQuestionnaireDetails(
  jobCandidateUuid,
  questionnaireUuid,
  isSignupQuestionnaire,
) {
  return axios.get(urls.evarec.ats.QUESTIONNAIRE_VIEW, {
    params: {
      candidate_uuid: jobCandidateUuid,
      questionnaire_uuid: questionnaireUuid || null,
      is_sing_up_questionnaire: isSignupQuestionnaire,
    },
    headers: generateHeaders(),
  });
}

/**
 * Create scheduled Interview
 * @param data
 * @returns Promise<AxiosResponse<any>>
 */
async function scheduleInterview(data) {
  return axios.post(urls.overview.interviews_WRITE, data, {
    headers: generateHeaders(),
  });
}

/**
 * Update scheduled Interview
 * @param data
 * @returns Promise<AxiosResponse<any>>
 */
// async function updateScheduleInterview(data) {
//   return axios.put(urls.overview.interviews_WRITE, data, {
//     header: {
//       Accept: 'application/json',
//     },
//     headers: generateHeaders(),
//   });
// }

/**
 * Check the status of resumes (ready or not)
 * @returns {Promise<any>}
 */
async function checkResumesStatus() {
  return axios.get(urls.evarec.rms.STATUS, {
    headers: generateHeaders(),
  });
}

/**
 * Create resumes by uploading them
 * @param media
 * @returns {Promise<any>}
 */
export async function createResumes(media) {
  const data = media.map((item) => item.uuid);
  return axios.post(
    urls.evarec.rms.RMS_CREATE,
    {
      media_uuid: data,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Adds resume to the ATS pipeline
 * @param rms_uuid
 * @param job_uuid
 * @param job_stage_uuid
 * @param email
 * @param items
 * @param is_multiple
 * @returns {Promise<any>}
 * @constructor
 */
async function addToATS(
  rms_uuid,
  job_uuid,
  job_stage_uuid,
  email,
  items,
  is_multiple,
) {
  return axios.post(
    urls.evarec.rms.ADD_TO_ATS,
    {
      job_uuid,
      items: [{ rms_uuid, email }],
      ...(items && is_multiple && { is_multiple: 1, items }),
      stage_uuid: job_stage_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Adds a candidate to the ATS pipeline from the search database
 * @returns {Promise<any>}
 * @constructor
 * @param jobUUID
 * @param jobStageUUID
 * @param profile_uuid
 * @param use_for
 * @param category_code
 * @param pre_candidate_approval_uuid
 * @param addToPipelineDataProvider
 * @param branch_uuid
 * @param items
 * @param is_multiple
 */
async function addToATSFromDatabase(
  jobUUID,
  jobStageUUID,
  profile_uuid,
  use_for,
  category_code,
  pre_candidate_approval_uuid,
  addToPipelineDataProvider,
  branch_uuid,
  items,
  is_multiple,
) {
  return axios.post(
    urls.evarec.ats.ADD_TO_ATS,
    {
      job_uuid: jobUUID,
      stage_uuid: jobStageUUID,
      ...(is_multiple && items
        ? { is_multiple: 1, profile_uuid: items }
        : { profile_uuid }),
      use_for,
      category_code,
      pre_candidate_approval_uuid,
      ...addToPipelineDataProvider,
      branch_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Share an ATS profile
 * @param job_candidates
 * @param recruiters_emails
 * @param job_uuid
 * @param message
 * @returns {Promise<any>}
 */
async function shareATSProfile({
  job_candidates,
  job_uuid,
  recruiters_emails,
  message,
}) {
  return axios.post(
    urls.evarec.ats.SHARE_PROFILE,
    {
      job_candidates: (job_candidates || []).map((item) => ({
        type: PipelineBulkSelectTypesEnum.Candidate.key,
        uuid: item,
      })),
      job_uuid,
      recruiters: recruiters_emails,
      message,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get the list of shared Applicants
 * @param key
 * @returns {Promise<any>}
 */
// async function getSharedApplicants(key) {
//   return axios.get(urls.evarec.ats.VIEW_PROFILE, {
//     params: {
//       key,
//     },
//     headers: generateHeaders(),
//   });
// }

/**
 * Get the list of shared Applicants v2
 * @param key
 * @returns {Promise<any>}
 */
async function getEvaRecScoreByToken(key) {
  return axios.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/candidate/score`,
    {
      params: {
        key,
      },
      headers: generateHeaders(),
    },
  );
}

/**
 * Share an RMS profile
 * @param rms_uuid
 * @param recruiters_emails
 * @returns {Promise<any>}
 */
async function shareRMSProfile(rms_uuid, recruiters_emails) {
  return axios.post(
    urls.evarec.rms.SHARE_PROFILE,
    {
      rms_uuid,
      recruiters: recruiters_emails,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Share a Candidate <Search Database>
 * @param candidate_uuid
 * @param recruiters
 * @returns {Promise<any>}
 */
async function shareCandidateProfile(candidate_uuid, recruiters) {
  return axios.post(
    urls.evarec.ats.SHARE_CANDIDATE_SEARCH_DATABASE,
    {
      candidate_uuid,
      recruiters,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get the list of shared Candidate <Search Database>
 * @param key
 * @returns {Promise<any>}
 */
async function getSharedCandidate(key) {
  return axios.get(urls.evarec.ats.GET_SHARED_CANDIDATE_SEARCH, {
    params: {
      key,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get the list of shared resumes
 * @param key
 * @returns {Promise<any>}
 */
async function getSharedResumes(key) {
  return axios.get(urls.evarec.rms.VIEW_PROFILE, {
    params: {
      key,
    },
    headers: generateHeaders(),
  });
}

/**
 * Get the list of recent uploads
 * @param limit
 * @returns {Promise<any>}
 */
const getRecentUploads = async (limit) =>
  axios
    .get(urls.evarec.ats.RECENT_UPLOADS, {
      params: {
        limit,
      },
      headers: generateHeaders(),
    })
    .then((res) => res.data.results);

/**
 * Get indexed industries
 * @returns {Promise<any>}
 */
async function getIndexedIndustries() {
  return axios.get(urls.evarec.rmsindexer.INDUSTRY, {
    headers: generateHeaders(),
  });
}

/**
 * Get indexed skills
 * @returns {Promise<any>}
 */
async function getIndexedSkills() {
  return axios.get(urls.evarec.rmsindexer.SKILLS, {
    headers: generateHeaders(),
  });
}

/**
 * Get indexed majors
 * @returns {Promise<any>}
 */
async function getIndexedMajors() {
  return axios.get(urls.evarec.rmsindexer.JOB_MAJORS, {
    headers: generateHeaders(),
  });
}

/**
 * Get indexed resumes (and apply a filter)
 * @param is_include
 * @param filters
 * @param job_uuid
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
async function getIndexedResumes(filters, job_uuid, page = 0, limit = 20, tags) {
  // Define body constant to pass as JSON in the API
  const info = {
    is_include: filters?.is_include === true || filters?.is_include === 'true',
    job_uuid,
    work_year: [],
    skills: filters?.skills || [],
    job_position: filters?.job_position || [],
    gender: filters?.gender?.uuid || null,
    major: filters?.major ? filters?.major.map((item) => item.uuid) : [],
    job_type: filters?.job_type ? filters?.job_type.map((item) => item.uuid) : [],
    degree_type: filters?.degree_type
      ? filters?.degree_type.map((item) => item.uuid)
      : [],
    country: filters?.country ? filters?.country.map((item) => item.uuid) : [],
    industry: filters?.industry ? filters?.industry.map((item) => item.uuid) : [],
    nationality: filters?.nationality
      ? filters?.nationality.map((item) => item.uuid)
      : [],
    languages_proficiency: filters?.language
      ? filters?.language.map((item) => item.uuid)
      : [],
    career_level: filters?.career_level
      ? filters?.career_level.map((item) => item.uuid)
      : [],
    query: filters?.query || [],
    tag: tags
      ?.filter((item) => item?.key)
      .map((item) => ({ ...item, value: item?.value.map((val) => val?.uuid) })),
    national_id: filters?.national_id,
    candidate_name: filters?.candidate_name,
    applicant_number: filters?.applicant_number,
    reference_number: filters?.reference_number,
    assigned_employee_uuid: filters?.assigned_employee_uuid?.map(
      (it) => it?.user_uuid,
    ),
    assigned_user_uuid: filters?.assigned_user_uuid?.map((it) => it?.uuid),
    candidate_property: filters?.candidate_property,
    source_type: filters?.source_type && filters?.source_type.key,
    source_uuid:
      filters?.source_type?.key
      && (((filters?.source_type?.key === ProfileSourcesTypesEnum.Agency.key
        || filters?.source_type?.key === ProfileSourcesTypesEnum.University.key)
        && filters?.source?.user_uuid)
        || filters?.source?.uuid),
    page,
    limit,
  };
  return axios.post(urls.evarec.rmsindexer.RMS, info, {
    headers: generateHeaders(),
  });
}

// Indexer APIs
/**
 * Get skills and wait map response
 * @param query
 * @returns Promise<AxiosResponse<any>>
 */
async function getSkillsAsync(query) {
  return axios
    .get(urls.evarec.rmsindexer.SKILLS, {
      params: {
        query,
      },
      headers: generateHeaders(),
    })
    .then((res) => res.data.results?.map((o, i) => ({ value: i, label: o })));
}

/**
 * Get majors and map response
 * @param query
 * @returns Promise<AxiosResponse<any>>
 */
async function getMajorsAsync(query) {
  return axios
    .get(urls.evarec.rmsindexer.MAJOR, {
      params: {
        query,
      },
      headers: generateHeaders(),
    })
    .then((res) => res.data.results?.map((o, i) => ({ value: i, label: o })));
}

/**
 * Get industries and map response
 * @param query
 * @returns Promise<AxiosResponse<any>>
 */
async function getIndustriesAsync(query) {
  return axios
    .get(urls.evarec.rmsindexer.INDUSTRY, {
      params: {
        query,
      },
      headers: generateHeaders(),
    })
    .then((res) => res.data.results?.map((o, i) => ({ value: i, label: o })));
}

/**
 * Get a list of company candidate (candidate search database)
 * @param limit
 * @param page
 * @returns {Promise<void>}
 */
async function candidateSearchDataBase(filters, job_uuid, limit, page, tags) {
  const info = {
    is_include: filters?.is_include === 'true' || filters?.is_include === true,
    job_uuid,
    work_year: [],
    skills: filters?.skills || [],
    major: filters?.major ? filters?.major.map((item) => item.uuid) : [],
    job_type: filters?.job_type ? filters?.job_type.map((item) => item.uuid) : [],
    degree_type: filters?.degree_type
      ? filters?.degree_type.map((item) => item.uuid)
      : [],
    industry: filters?.industry ? filters?.industry.map((item) => item.uuid) : [],
    job_position: filters?.job_position || [],
    query_company: filters?.query_company || [],
    career_level: filters?.career_level
      ? filters?.career_level.map((item) => item.uuid)
      : [],
    country: filters?.country ? filters?.country.map((item) => item.uuid) : [],
    languages_proficiency: filters?.language
      ? filters?.language.map((item) => item.uuid)
      : [],
    nationality: filters?.nationality
      ? filters?.nationality.map((item) => item.uuid)
      : [],
    query: filters?.query || [],
    gender: filters?.gender?.uuid || null,
    right_to_work: filters?.checkboxFilters?.right_to_work === true,
    willing_to_travel: filters?.checkboxFilters?.willing_to_travel === true,
    willing_to_relocate: filters?.checkboxFilters?.willing_to_relocate === true,
    owns_a_car: filters?.checkboxFilters?.owns_a_car === true,
    is_completed_profile: filters?.checkboxFilters?.is_completed_profile,
    un_completed_profile: filters?.checkboxFilters?.un_completed_profile,
    tag: tags
      ?.filter((item) => item?.key)
      ?.map((item) => ({
        candidate_tag_key: item.key,
        candidate_tag_value: item.value?.map((val) => val?.uuid),
      })),
    national_id: filters?.national_id,
    candidate_name: filters?.candidate_name,
    applicant_number: filters?.applicant_number,
    reference_number: filters?.reference_number,
    assigned_employee_uuid: filters?.assigned_employee_uuid?.map(
      (it) => it?.user_uuid,
    ),
    assigned_user_uuid: filters?.assigned_user_uuid?.map((it) => it?.uuid),
    candidate_property: filters?.candidate_property,
    source_type: filters?.source_type && filters?.source_type.key,
    source_uuid:
      filters?.source_type?.key
      && (((filters?.source_type?.key === ProfileSourcesTypesEnum.Agency.key
        || filters?.source_type?.key === ProfileSourcesTypesEnum.University.key)
        && filters?.source?.user_uuid)
        || filters?.source?.uuid),
    page,
    limit,
  };
  [
    'right_to_work',
    'willing_to_travel',
    'willing_to_relocate',
    'owns_a_car',
    'is_completed_profile',
    'un_completed_profile',
  ].forEach((item) => {
    if (!info[item]) delete info[item];
  });
  return axios.post(urls.evarec.ats.CANDIDATE_SEARCH_DATABASE, info, {
    headers: generateHeaders(),
  });
}

/**
 * Create an job template
 */
async function createJobTemplate(data) {
  return axios.post(urls.evarec.ats.TEMPLATES_WRITE, data, {
    headers: generateHeaders(),
  });
}

/**
 * Get Job Templates
 * @param limit
 * @param page
 * @returns {Promise<void>}
 */
async function getTemplates(limit, page, query) {
  return axios.get(urls.evarec.ats.TEMPLATES_GET, {
    params: {
      limit,
      page,
      query,
    },
    headers: generateHeaders(),
  });
}

/**
 * View Job Template
 * @param data
 * @returns Promise<AxiosResponse<any>>
 */
async function viewJobTemplate(uuid) {
  return axios.request(urls.evarec.ats.TEMPLATES_GET, {
    method: 'view',
    params: {
      uuid,
    },
    headers: generateHeaders(),
  });
}

/**
 * Update Job Template
 */
async function updateJobTemplate(data) {
  return axios.put(urls.evarec.ats.TEMPLATES_WRITE, data, {
    headers: generateHeaders(),
  });
}

/**
 * Delete Job Template
 * @param {uuid}
 */
async function deleteJobTemplate(uuid) {
  return axios.delete(urls.evarec.ats.TEMPLATES_WRITE, {
    header: {
      Accept: 'application/json',
    },
    headers: generateHeaders(),

    params: {
      uuid,
    },
  });
}

export const GetJobTemplateProjectionDropdown = async ({ slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/projection`,
    {
      params: {
        slug,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GenerateJobTemplateReport = async ({ uuids, projection }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dynamic-analytics/job-templates/generate-report`,
    {
      user_uuid: uuids,
      projection,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GenerateComprehensiveReport = async (filters) =>
  await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/static-analytics/comprehensive-report/generate-report`,
    undefined,
    {
      params: filters,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllJobTemplateReports = async (filters) =>
  await HttpServices.get(`${process.env.REACT_APP_ANALYTICS_SDB_API}/reports`, {
    params: filters,
  })
    .then((data) => data)
    .catch((error) => error.response);

/**
 * Toggle favourite in search database
 * @param candidateUuid
 * @returns Promise<AxiosResponse<any>>
 */
async function favouriteCandidate(candidateUuid) {
  return axios.post(
    urls.evarec.ats.FAVOURITE_CANDIDATE,
    {
      candidate_uuid: candidateUuid,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Compare Candidate Profiles in search database
 * @param {Array} profileUUIDs
 * @returns {Promise<*>}
 */
async function compareCandidate(profileUUIDs) {
  return axios.get(urls.evarec.ats.COMPARE_PROFILE, {
    params: {
      profile_uuid: profileUUIDs,
    },
    headers: generateHeaders(),
  });
}

/**
 * Show candidate profile in the search database
 * @param profileUUIDs
 * @param company_uuid
 * @returns {Promise<*>}
 */
async function viewCandidateProfile(profileUUIDs, company_uuid = undefined) {
  return HttpServices.get(urls.evarec.ats.APPLICANT_PROFILE, {
    params: {
      profile_uuid: profileUUIDs,
    },
    headers: (company_uuid && { 'Accept-Company': company_uuid }) || undefined,
  });
}

/**
 * Toogle Publish Job
 */
async function togglePublished(uuid, is_published) {
  return axios.put(
    urls.evarec.ats.TOGGLE_PUBLISH,
    {
      uuid,
      is_published,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Toggle Internal Job
 */
async function toggleExternalInternal(uuid, option) {
  return axios.put(
    urls.evarec.ats.TOGGLE_External,
    {
      uuid,
      option,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get Job Categories
 * @param limit
 * @param page
 * @returns {Promise<void>}
 */
async function getCategories(limit, page) {
  return axios.get(urls.evarec.ats.CATEGORY_LIST, {
    params: {
      limit,
      page: page + 1,
    },
    headers: generateHeaders(),
  });
}

/**
 * Create New Category
 * @param title
 * @param titleAr
 */
async function createNewCategory(title, titleAr) {
  const localBody = { title };
  if (titleAr) localBody.title_ar = titleAr;
  return axios.post(urls.evarec.ats.CATEGORY_WRITE, localBody, {
    headers: generateHeaders(),
  });
}

/**
 * Delete Category
 * @param uuid
 */
async function deleteCategory(uuid) {
  return axios.delete(urls.evarec.ats.CATEGORY_WRITE, {
    header: {
      Accept: 'application/json',
    },
    headers: generateHeaders(),
    params: {
      uuid,
    },
  });
}

/**
 * Update Category
 * @param uuid
 * @param title
 */
async function updateCategory(uuid, title, title_ar) {
  return axios.put(
    urls.evarec.ats.CATEGORY_WRITE,
    {
      uuid,
      title,
      title_ar,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Get All Assessment Tests
 * @returns {Promise<void>}
 */
const GetAllAssessmentTests = async (category) =>
  axios.get(`${urls.evarec.ats.assessment_test}?category=${category}`, {
    headers: generateHeaders(),
  });

/**
 * Get All Assessment Tests
 * @returns {Promise<void>}
 */
const GetAllCategories = async () =>
  axios.get(urls.evarec.ats.assessment_test_category, {
    headers: generateHeaders(),
  });

/**
 * Invite for Assessment Tests
 * @returns {Promise<void>}
 */
const PostAssessmentTests = async (body) =>
  axios.post(urls.evarec.ats.assessment_test_invite, body, {
    headers: generateHeaders(),
  });

/**
 * Get All Candidate response
 * @returns {Promise<void>}
 */
const GetAllCandidateResponse = async ({ relation, relation_candidate_uuid }) =>
  axios.get(urls.evarec.ats.candidate_response, {
    params: {
      relation,
      relation_candidate_uuid,
    },
    headers: generateHeaders(),
  });

/**
 * Get All Candidate offers
 * @returns {Promise<void>}
 */
const GetAllCandidateOffers = async ({
  relation,
  relation_uuid,
  relation_candidate_uuid,
}) =>
  axios.post(
    urls.evarec.ats.candidate_offers,
    {
      relation,
      relation_uuid,
      relation_candidate_uuid,
    },
    {
      headers: generateHeaders(),
    },
  );

/**
 * Export the EVA-REC service
 */
export const evarecAPI = {
  GetAllCandidateOffers,
  GetAllCandidateResponse,
  GetAllCategories,
  PostAssessmentTests,
  GetAllAssessmentTests,
  getWeights,
  updateWeights,
  viewJob,
  updateJob,
  getJobList,
  getPipelineStage,
  updateStageOrder,
  moveToStage,
  createJob,
  getPipeline,
  getCandidate,
  createNote,
  getInvitedTeamsOnJob,
  inviteTeamMembers,
  getStages,
  searchJob,
  parseJobTemplate,
  getQuestionnaireByPipeline,
  getVideoAssessments,
  SendVideoAssessment,
  getDiscussionList,
  getDiscussion,
  updateDiscussion,
  getAttachments,
  deleteAttachments,
  checkResumesStatus,
  createResumes,
  addToATS,
  addToATSFromDatabase,
  shareRMSProfile,
  shareCandidateProfile,
  getEvaRecScoreByToken,
  getSharedCandidate,
  getSharedResumes,
  getRecentUploads,
  getEvaluation,
  getInvitedVideoAsessments,
  scheduleInterview,
  getCandidateRating,
  rateCandidate,
  getCandidateQuestionnaire,
  getQuestionnaireDetails,
  shareATSProfile,
  createJobTemplate,
  viewJobTemplate,
  updateJobTemplate,
  getJobs,
  getTemplates,
  deleteJobTemplate,
  GetJobTemplateProjectionDropdown,
  GetAllJobTemplateReports,
  GenerateJobTemplateReport,
  favouriteCandidate,
  compareCandidate,
  togglePublished,
  toggleExternalInternal,
  viewCandidateProfile,
};

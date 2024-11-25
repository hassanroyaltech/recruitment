import { HttpServices } from '../helpers';

export const GetAllEvaRecPipelines = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  job_uuid,
  language_uuid,
  with_than,
  other_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/pipelines/${
      process.env.REACT_APP_VERSION_API_V2
    }/pipeline?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// export const GetEvaRecPipelinesById = async ({ uuid }) => {
//   const queryList = [];
//   if (uuid) queryList.push(`uuid=${uuid}`);
//
//   const result = await HttpServices.get(
//     `${process.env.REACT_APP_API_URL_HMG}/api/${
//       process.env.REACT_APP_VERSION_API
//     }/pipeline/view?${queryList.join('&')}`
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
//   return result;
// };

export const CreateEvaRecPipelines = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateEvaRecPipelineTemplate = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPipelineEmailTemplates = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${
      process.env.REACT_APP_VERSION_API
    }/template?${queryList.join('&')}`,
    {
      params: {
        with_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPipelineEmailTemplateById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${
      process.env.REACT_APP_VERSION_API
    }/template/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPipelineAssessments = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/prep_assessment/${
      process.env.REACT_APP_VERSION_API
    }/assessment/list?${queryList.join('&')}`,
    {
      params: {
        with_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllStagesCandidates = async ({
  job_pipeline_uuid, // required
  job_uuid, // required
  filters = {},
  // use_for = 'dropdown',
}) => {
  const queryList = [];
  if (job_pipeline_uuid) queryList.push(`pipeline_uuid=${job_pipeline_uuid}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  // queryList.push(`use_for=${use_for}`);
  const localFilter = { ...filters };
  const localDynamicCandidateProperties = [
    ...(localFilter?.dynamic_properties || []),
  ];
  if (localFilter?.dynamic_properties) delete localFilter?.dynamic_properties;
  const dynamicCandidatePropertiesParams = {};
  localDynamicCandidateProperties
    ?.filter((item) => item?.value?.length > 0)
    .map((item, index) => {
      dynamicCandidatePropertiesParams[`dynamic_properties[${index}][uuid]`]
        = item.uuid;
      dynamicCandidatePropertiesParams[`dynamic_properties[${index}][value]`]
        = item.value;
      return undefined;
    });

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/jobs/candidates?${queryList.join('&')}`,
    {
      params: {
        ...localFilter,
        ...dynamicCandidatePropertiesParams,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPipelineAssessmentById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.request({
    url: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/prep_assessment/${
      process.env.REACT_APP_VERSION_API
    }/assessment?${queryList.join('&')}`,
    method: 'view',
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllJobCandidates = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/candidate/job/application`,
    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        with_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPipelineAnnotations = async () => {
  // const queryList = [];
  // if (pipeline_uuid) queryList.push(`pipeline_uuid=${pipeline_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/template/collection`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPipelineQuestionnaireById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.request({
    url: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/questionnaires/${
      process.env.REACT_APP_VERSION_API
    }/questionnaire?${queryList.join('&')}`,
    method: 'view',
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPipelineQuestionnaires = async ({ pipeline_uuid }) => {
  const queryList = [];
  if (pipeline_uuid) queryList.push(`pipeline_uuid=${pipeline_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/questionnaires/${
      process.env.REACT_APP_VERSION_API
    }/list?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllEvaRecPipelineStages = async ({
  uuid,
  is_first_movable,
  company_uuid,
}) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);
  if (is_first_movable) queryList.push(`is_first_movable=${is_first_movable}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/pipelines/${
      process.env.REACT_APP_VERSION_API_V2
    }/pipeline/view?${queryList.join('&')}`,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreatePipelineStage = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/stage`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdatePipelineStage = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/stage`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdatePipelineStagesReorder = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/stage/reorder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ChangeOrConfirmCandidateStage = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/move-stage`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeletePipelineStage = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/stage`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteEvaRecPipeline = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/pipelines/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllEvaRecPipelineLogs = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  job_uuid,
  with_than,
  other_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${
      process.env.REACT_APP_ENDPOINT_API
    }/ats/${process.env.REACT_APP_VERSION_API}/job/log?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreatePipelineNote = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${process.env.REACT_APP_ENDPOINT_API}/ats/${process.env.REACT_APP_VERSION_API}/notes`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllEvaRecPipelineNotes = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  job_uuid,
  with_than,
  other_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${
      process.env.REACT_APP_ENDPOINT_API
    }/ats/${process.env.REACT_APP_VERSION_API}/notes?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteEvaRecPipelineNote = async ({ job_uuid, uuid }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);

  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${
      process.env.REACT_APP_ENDPOINT_API
    }/ats/${process.env.REACT_APP_VERSION_API}/notes?${queryList.join('&')}`,
    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaRecPipelineTeams = async ({
  job_uuid,
  job_candidates_uuid,
  is_team,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${process.env.REACT_APP_ENDPOINT_API}/ats/${process.env.REACT_APP_VERSION_API}/recruiter`,
    {
      params: {
        job_uuid,
        job_candidates_uuid,
        is_team,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllEvaRecPipelineTeams = async ({
  limit, // all those options are not currently implemented by backend but should be implemented
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
  company_uuid,
  all = true, // to return the current login user
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/team/${process.env.REACT_APP_VERSION_API}/team/search`,
    {
      params: {
        limit,
        page,
        search,
        status,
        use_for,
        company_uuid,
        all,
        with_than,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AddEvaRecPipelineTeam = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${process.env.REACT_APP_ENDPOINT_API}/ats/${process.env.REACT_APP_VERSION_API}/recruiter/invite`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaRecPipelineWeights = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${process.env.REACT_APP_ENDPOINT_API}/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AddEvaRecPipelineWeights = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${process.env.REACT_APP_ENDPOINT_API}/ats/${process.env.REACT_APP_VERSION_API}/job/weight`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllEvaRecPipelineJobs = async ({
  for_delete,
  profile_uuid,
  use_for,
  category_code,
  company_uuid,
  candidate_uuid,
}) => {
  const queryList = [];
  if (for_delete || for_delete === 0) queryList.push(`for_delete=${for_delete}`);
  if (profile_uuid) queryList.push(`profile_uuid=${profile_uuid}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (category_code) queryList.push(`category_code=${category_code}`);
  if (candidate_uuid) queryList.push(`candidate_uuid=${candidate_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/dropdown?${queryList.join('&')}`,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllJobStagesByJobUUID = async ({ job_uuid, company_uuid }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/stage/list?${queryList.join('&')}`,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobRequirementsByJobId = async ({ job_uuid, company_uuid }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/candidate/${
      process.env.REACT_APP_VERSION_API_V2
    }/recruiter/job/job-requirements?${queryList.join('&')}`,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSignupRequirementsByCategories = async ({
  category_uuid,
  language_profile_uuid,
  company_uuid,
  job_uuid,
}) => {
  const queryList = [];
  if (language_profile_uuid)
    queryList.push(`language_profile_uuid=${language_profile_uuid}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (category_uuid instanceof Array)
    category_uuid?.forEach((item, index) => {
      queryList.push(`category_uuid[${index}]=${item}`);
    });
  else queryList.push(`category_uuid[]=${category_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/candidate/${
      process.env.REACT_APP_VERSION_API_V2
    }/recruiter/signup-requirements?${queryList.join('&')}`,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ConnectCandidateWithProfile = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/init-profile`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const AddJobToPipeline = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/add-ats`,
    body,
    {
      headers:
        (body.company_uuid && {
          'Accept-Company': body.company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPipelineStageCandidates = async ({
  page,
  limit,
  stage_uuid,
  pipeline_uuid,
  job_uuid,
  selected_candidates,
  order_by,
  order_type,
  search,
  company_uuid,
  ...rest
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/jobs/stage-candidates`,
    {
      params: {
        page,
        limit,
        stage_uuid,
        pipeline_uuid,
        job_uuid,
        selected_candidates,
        order_by,
        order_type,
        search,
        ...rest,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobPipelineCandidates = async ({
  page,
  limit,
  stage_uuid,
  pipeline_uuid,
  job_uuid,
  selected_candidates,
  order_by,
  order_type,
  with_than,
  other_than,
  search,
  company_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/jobs/candidate-pipeline`,
    {
      params: {
        page,
        limit,
        stage_uuid,
        pipeline_uuid,
        job_uuid,
        selected_candidates,
        order_by,
        order_type,
        with_than,
        other_than,
        query: typeof search === 'string' ? (search && [search]) || null : search,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaRecPipelineQuestionnaires = async ({ job_uuid }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/questionnaire/manage?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetInitialJobTeam = async ({ job_uuid }) => await HttpServices.get(
  `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/job/other-users`,
  {
    params: {
      job_uuid,
    },
  },
)
  .then((data) => data)
  .catch((error) => error.response);

export const GetAllEvaRecJobPipelinesByUUID = async ({ job_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    {
      params: {
        job_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateEvaRecJobPipeline = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateEvaRecJobPipelineStagesReorder = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/pipeline/stage/reorder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteEvaRecJobPipeline = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaRecPipelineQuestionnaireCandidate = async ({
  job_questionnaire_uuid,
  status,
}) => {
  const queryList = [];
  if (job_questionnaire_uuid)
    queryList.push(`job_questionnaire_uuid=${job_questionnaire_uuid}`);
  if (status) queryList.push(`status=${status}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/questionnaire/candidates?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateCandidateQuestionnaireStatus = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/questionnaire/candidates/change/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendEvaRecQuestionnaire = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${process.env.REACT_APP_ENDPOINT_API}/ats/${process.env.REACT_APP_VERSION_API}/candidate/send-questionnaire`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ShareEvaRecCandidateProfile = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/share-profile`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// this is to move the selected candidates stages
export const PipelineMoveTo = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/candidate/move`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// this is to check before move the selected candidates stages
export const PipelinePreMoveTo = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/candidate/prep-move`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateEvaRecPipelineStage = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/pipeline/stage/edit`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEvaRecPipeline = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/pipeline`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaRecVideoAssessment = async ({ job_uuid } = {}) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/prep_assessment/${
      process.env.REACT_APP_VERSION_API
    }/assessment/list?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendEvaRecVideoAssessment = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${process.env.REACT_APP_ENDPOINT_API}/ats/${process.env.REACT_APP_VERSION_API}/job/assessment/invite`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaRecPipelineLogs = async ({ job_uuid, page, limit }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (page) queryList.push(`page=${page}`);
  if (limit) queryList.push(`limit=${limit}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/log?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

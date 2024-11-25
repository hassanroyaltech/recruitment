import { HttpServices } from '../helpers';

export const GetAllActiveJobs = async ({
  limit,
  page,
  search,
  with_than,
  other_than,
  job_uuid,
  user_for,
  company_uuid,
  account_uuid,
  job_type = 'active',
  profile_uuid,
  use_for,
}) => {
  const queryList = [];
  if (search) queryList.push(`query=${search}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (user_for) queryList.push(`user_for=${user_for}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/${job_type}?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
        profile_uuid,
      },
      headers:
        company_uuid || account_uuid
          ? {
            ...(company_uuid && {
              'Accept-Company': company_uuid,
            }),
            ...(account_uuid && {
              'Accept-Account': account_uuid,
            }),
          }
          : undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllCampaignActiveJobs = async ({ limit, page, query, job_uuid }) => {
  const queryList = [];
  if (query) queryList.push(`query=${query}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/campaign/active?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobById = async ({ job_uuid, company_uuid }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`uuid=${job_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/view?${queryList.join('&')}`,
    {
      headers: {
        ...(company_uuid && {
          'Accept-Company': company_uuid,
        }),
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetActivePipelineByUUID = async ({ pipeline_uuid }) => {
  const queryList = [];
  if (pipeline_uuid) queryList.push(`pipeline_uuid=${pipeline_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/pipelines/${
      process.env.REACT_APP_VERSION_API_V2
    }/pipeline/detailed?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ATSUpdateAssignedUser = async ({
  assigned_user_uuid,
  job_uuid,
  assigned_user_type,
  job_candidate_uuid,
  candidate_uuid,
}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/assigned`,
    {
      assigned_user_uuid,
      job_uuid,
      assigned_user_type,
      job_candidate_uuid,
      candidate_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ATSPipelineActionsExport = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/download`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllAppliedJobsByCandidate = async ({ limit, page, uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/ats-jobs`,
    {
      params: { limit, page, uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllJobsAccountLevel = async ({
  limit,
  page,
  query,
  with_than,
  job_uuid,
  user_for,
  company_uuid,
  account_uuid,
  profile_uuid,
  use_for,
}) => {
  const queryList = [];
  if (query) queryList.push(`query=${query}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (user_for) queryList.push(`user_for=${user_for}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/all?${queryList.join('&')}`,
    {
      params: {
        with_than,
        profile_uuid,
      },
      headers:
        company_uuid || account_uuid
          ? {
            ...(company_uuid && {
              'Accept-Company': company_uuid,
            }),
            ...(account_uuid && {
              'Accept-Account': account_uuid,
            }),
          }
          : undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const ATSUpdateJobVacancyStatus = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/job/vacancy-status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// start for the quick filters APIs
export const GetQuickFiltersService = async ({ key }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/filters`,
    {
      params: {
        key,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateQuickFiltersService = async ({ key, filters }) => await HttpServices.post(
  `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/filters`,
  {
    filters,
    key,
  },
)
  .then((data) => data)
  .catch((error) => error.response);

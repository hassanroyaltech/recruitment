import { HttpServices } from '../helpers';

export const GetAllScorecardProfileFields = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (other_than) queryList.push(`other_than[]=${other_than}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${
      process.env.REACT_APP_VERSION_API
    }/profile-fields?${queryList.join('&')}`,
    {
      params: { ...(with_than && { with_than }) },
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
export const CreateScorecardTemplate = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/scorecard`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateScorecardTemplate = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/scorecard`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const ViewScorecardTemplate = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${process.env.REACT_APP_VERSION_API}/scorecard/view`,
    {
      params: { ...(uuid && { uuid }) },
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

export const DeleteScorecardTemplate = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/scorecard`,
    {
      params: { ...(uuid && { uuid }) },
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

export const GetAllScorecardTemplates = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (other_than) queryList.push(`other_than[]=${other_than}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/scorecard?${queryList.join('&')}`,
    {
      params: { ...(with_than && { with_than }) },
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
export const ToggleScorecardStatus = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/scorecard/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ScorecardGetOtherUsersToAssign = async ({
  limit,
  page,
  search,
  company_uuid,
  job_requisition_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/other-users`,
    {
      params: {
        job_requisition_uuid,
        limit,
        page,
        search,
        company_uuid,
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

export const AssignScorecardMembers = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/members`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AssignScorecardMembersToCandidate = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/members`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetCandidateScorecard = async ({
  job_candidate_uuid,
  company_uuid,
  job_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/list`,
    {
      params: {
        job_uuid,
        job_candidate_uuid,
        company_uuid,
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

export const ViewCandidateScorecardDetails = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/view`,
    {
      params: {
        candidate_score_card_uuid: uuid,
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
export const GetCandidateScoreForm = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/get`,
    {
      params: {
        candidate_score_card_uuid: uuid,
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

export const SubmitCandidateScorecard = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/submit`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobScoresSummary = async ({
  limit,
  page,
  search,
  company_uuid,
  uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/summary`,
    {
      params: {
        limit,
        page,
        search,
        job_score_card_uuid: uuid,
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
export const GetJobBestPerformer = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/summary/best-performer`,
    {
      params: {
        job_score_card_uuid: uuid,
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

export const SubmitScoreFinalDecision = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/final-decision`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ScorecardManualReminder = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/manual-reminder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobFinalDecisions = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/summary/final-decisions`,
    {
      params: {
        job_score_card_uuid: uuid,
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

export const DownloadCandidateScorecard = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/export`,
    {
      params: {
        candidate_score_card_uuid: uuid,
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
export const DownloadJobScorecardSummary = async ({ uuid, company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/summary/export`,
    {
      params: {
        job_score_card_uuid: uuid,
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

export const JobScorecardManualReminder = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/manual-reminder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ShareScorecardSummary = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/summary/share`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateCandidateScorecard = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/scorecard/${process.env.REACT_APP_VERSION_API}/job/candidate/create`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

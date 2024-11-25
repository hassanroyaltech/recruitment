import { HttpServices } from '../helpers';

export const GetCandidatesProfileById = async ({
  candidate_uuid,
  profile_uuid,
  from_feature,
}) => {
  const queryList = [];
  if (profile_uuid) queryList.push(`profile_uuid=${profile_uuid}`);
  if (candidate_uuid) queryList.push(`candidate_uuid=${candidate_uuid}`);
  if (from_feature) queryList.push(`from_feature=${from_feature}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/candidate/${
      process.env.REACT_APP_VERSION_API_V2
    }/recruiter/candidate-profile?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateCandidatesProfile = async (
  { candidate_uuid, job_uuid, pipeline_uuid, candidate_data },
  company_uuid,
) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/candidate/${process.env.REACT_APP_VERSION_API_V2}/recruiter/candidate-profile`,
    {
      candidate_uuid,
      job_uuid,
      pipeline_uuid,
      ...candidate_data,
    },
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

export const UpdateCandidatesProfileSource = async (body, company_uuid) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/candidate/${process.env.REACT_APP_VERSION_API_V2}/recruiter/candidate-profile/source`,
    body,
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

export const CreateCandidatesProfile = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/candidate/${process.env.REACT_APP_VERSION_API_V2}/recruiter/candidate-profile`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

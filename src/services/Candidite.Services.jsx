import { HttpServices } from '../helpers';

export const GetATSLogs = async ({ job_uuid, job_candidate_uuid, limit, page }) => {
  const queryList = [];
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (job_candidate_uuid) queryList.push(`job_candidate_uuid=${job_candidate_uuid}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  return await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/candidate/logs?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error);
};

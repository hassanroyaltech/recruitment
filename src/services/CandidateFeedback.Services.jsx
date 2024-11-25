import { HttpServices } from '../helpers';

export const GetAllCandidateFeedback = async ({
  candidate_uuid,
  job_uuid,
  page,
  limit,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API_V2}/candidate/feedback/all`,
    {
      params: {
        candidate_uuid,
        job_uuid,
        page,
        limit,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

import { HttpServices } from 'helpers';
// ${domain}/${endpoint}/schedule/${version}/interview
export const GetCandidatesInterviews = async ({ candidate_uuid, page, limit }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/schedule/${process.env.REACT_APP_VERSION_API}/interview`,
    {
      params: {
        candidate_uuid,
        page,
        limit,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

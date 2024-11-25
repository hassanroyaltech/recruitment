import { HttpServices } from 'helpers';

export const GetCandidatesTags = async ({ candidate_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/candidate/${
      process.env.REACT_APP_VERSION_API_V2
    }/recruiter/candidate-tag${
      candidate_uuid ? `?candidate_uuid=${candidate_uuid}` : ''
    }`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateCandidatesTag = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/candidate/${process.env.REACT_APP_VERSION_API_V2}/recruiter/candidate-tag`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateCandidatesTag = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/candidate/${process.env.REACT_APP_VERSION_API_V2}/recruiter/candidate-tag`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteCandidatesTag = async ({ candidate_uuid, tag_uuid }) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/candidate/${process.env.REACT_APP_VERSION_API_V2}/recruiter/candidate-tag`,
    { data: { candidate_uuid, tag_uuid } },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

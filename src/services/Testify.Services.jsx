import { HttpServices } from '../helpers';

export const GetAllTestifyAssessments = async ({
  limit = 10,
  page,
  query,
  col_name,
  in_order,
  is_archived,
  candidate_uuid, // required
  candidate_profile_uuid, // optional
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/testlify/all-assessments`,
    {
      params: {
        limit,
        page,
        query,
        col_name,
        in_order,
        is_archived,
        candidate_uuid,
        candidate_profile_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllTestifyCandidateAssessments = async ({
  candidate_uuid, // required
  candidate_profile_uuid, // required
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/testlify/assessment/candidate/results`,
    {
      params: {
        candidate_uuid,
        candidate_profile_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateTestifyAssessment = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/testlify/invite-candidates`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteTestifyAssessment = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/testlify/assessment/candidate`,
    {
      data: body
    }
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendReminderTestifyAssessment = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/testlify/assessment/candidate/reminder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

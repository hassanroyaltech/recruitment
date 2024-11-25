import { HttpServices } from 'helpers';

export const SendAssessmentTestReminder = async ({
  assessment_ids,
  assessment_test_uuid,
  category_id,
  invited_members,
  relation_uuid,
  relation,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/assessment_test/${process.env.REACT_APP_VERSION_API}/reminder`,
    {
      ...(assessment_ids && { assessment_ids }),
      ...(invited_members && {
        assessment_test_uuid,
        category_id,
        invited_members,
        relation_uuid,
        relation,
      }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteAssessmentTest = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/assessment_test/${process.env.REACT_APP_VERSION_API}/delete/assessment`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

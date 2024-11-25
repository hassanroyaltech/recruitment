import { HttpServices } from '../helpers';
import RecuiterPreference from '../utils/RecuiterPreference';

export const SendAssessmentReminder = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/prep_assessment/${process.env.REACT_APP_VERSION_API}/candidate/send_reminder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetReminderEmailTemplate = async ({ slug, language_id }) => {
  const queryList = [];
  if (slug) queryList.push(`slug=${slug}`);
  if (language_id) queryList.push(`language_id=${language_id}`);

  const result = await HttpServices.get(
    `${RecuiterPreference.TEMPLATE_BY_SLUG}?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

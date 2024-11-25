import { HttpServices } from '../helpers';

export const GetOnboardingEmailSetting = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/email/setting`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateOnboardingEmailSetting = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/email/setting`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

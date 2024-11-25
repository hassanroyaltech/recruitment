import { HttpServices } from '../helpers';

const HMGBASEURL = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;

export const GetInfoCompanyInfo = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/company/${process.env.REACT_APP_VERSION_API}/settings/get_company_information`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ChangeSubDomain = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/company/${process.env.REACT_APP_VERSION_API}/settings/change_information`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SetCarbonCopyUsers = async (body) => {
  const result = await HttpServices.put(
    `${HMGBASEURL}/api/${process.env.REACT_APP_VERSION_API}/user/cc-email-toggle`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

import { HttpServices } from '../helpers';

export const GetCandidateDocumentsData = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/candidate/service/information/employee/documents`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SaveCandidateDocumentsData = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/candidate/service/information/employee/documents`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SubmitCandidateDocumentsData = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/candidate/service/information/employee/documents/submit`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SendCandidateDocumentsEmail = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/candidate/service/information/employee/documents/sent/email`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

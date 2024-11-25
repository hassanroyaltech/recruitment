import { HttpServices } from '../helpers';

export const GetAllSetupsCandidatesSettings = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/account/settings/candidate/registration`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsCandidatesSettings = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/candidate/registration`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

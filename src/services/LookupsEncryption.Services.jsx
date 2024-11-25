import { HttpServices } from '../helpers';

export const GetLookupEncryptionStatus = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/lookup/${process.env.REACT_APP_VERSION_API}/setting/status`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const ToggleLookupEncryptionStatus = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/lookup/${process.env.REACT_APP_VERSION_API}/setting/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

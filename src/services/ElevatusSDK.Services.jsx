import { HttpServices } from 'helpers';

export const GetElevatusSDKDetails = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/sdk/application`
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GenerateElevatusSDK = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/sdk/application`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);

export const RevokeElevatusSDK = async () =>
  await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/sdk/application`,
  )
    .then((data) => data)
    .catch((error) => error.response);
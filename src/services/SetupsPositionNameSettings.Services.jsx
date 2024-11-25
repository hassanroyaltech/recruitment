import { HttpServices } from '../helpers';

export const GetAllSetupsPositionNameSettings = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/account/settings/position/name`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateSetupsPositionNameSettings = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/position/name`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

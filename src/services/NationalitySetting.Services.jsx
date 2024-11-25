import { HttpServices } from '../helpers';

export const CreateNationalitySetting = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/nationality`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateNationalitySetting = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/nationality`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteNationalitySetting = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/nationality`,
    { data },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllNationalitySettings = async ({ limit, page, search }) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/account/settings/nationality`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

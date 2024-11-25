import { HttpServices } from '../helpers';

export const GetAllSetupsGOSI = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/service/gosi?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsGOSIById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/service/gosi/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsGOSI = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/gosi`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsGOSI = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/gosi`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsGOSI = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/gosi`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

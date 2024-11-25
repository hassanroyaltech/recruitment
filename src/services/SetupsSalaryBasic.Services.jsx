import { HttpServices } from '../helpers';

export const GetAllSetupsSalaryBasic = async ({
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
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/salary-basic?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsSalaryBasicById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/salary-basic/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsSalaryBasic = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/salary-basic`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsSalaryBasic = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/salary-basic`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsSalaryBasic = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/salary-basic`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

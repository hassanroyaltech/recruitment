import { HttpServices } from '../helpers';

export const GetAllEmployeeExperienceJob = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  employee_uuid,
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (employee_uuid) queryList.push(`employee_uuid=${employee_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/employees/${
      process.env.REACT_APP_VERSION_API
    }/employee/job-experience?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEmployeeExperienceJobById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/employees/${
      process.env.REACT_APP_VERSION_API
    }/employee/job-experience/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateEmployeeExperienceJob = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/employees/${process.env.REACT_APP_VERSION_API}/employee/job-experience`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEmployeeExperienceJob = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/employees/${process.env.REACT_APP_VERSION_API}/employee/job-experience`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteEmployeeExperienceJob = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/employees/${process.env.REACT_APP_VERSION_API}/employee/job-experience`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

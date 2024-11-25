import { HttpServices } from '../helpers';

export const GetAllJobRequisitions = async ({
  limit,
  page,
  search,
  status = true,
  with_than,
  filters,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/requisition/${
      process.env.REACT_APP_VERSION_API
    }/dispatcher?${queryList.join('&')}`,
    {
      params: { with_than, ...filters },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllJobRequisitionUsers = async ({
  limit,
  page,
  search,
  job_requisition_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (job_requisition_uuid)
    queryList.push(`job_requisition_uuid=${job_requisition_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/user/users-by-category?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobRequisitionById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/requisition/${
      process.env.REACT_APP_VERSION_API
    }/request/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateJobRequisitions = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/requisition/${process.env.REACT_APP_VERSION_API}/dispatcher/assign_users`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPendingVacancies = async ({
  limit,
  page,
  search,
  status = true,
  with_than,
  filters,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/pending?${queryList.join('&')}`,
    {
      params: { with_than, ...filters },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

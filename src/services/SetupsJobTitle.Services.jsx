import { HttpServices } from '../helpers';

const HMGBASEURLGET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const HMGBASEURLGETWRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const JOBTITLEURLGET = `${HMGBASEURLGET}/api/${VERSION}`;
const JOBTITLEURLWRITE = `${HMGBASEURLGETWRITE}/api/${VERSION}`;

export const GetAllSetupsJobTitle = async ({
  limit,
  page,
  search,
  user_type,
  status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (user_type || user_type === 0) queryList.push(`user_type=${user_type}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${JOBTITLEURLGET}/service/job-title?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsJobTitleById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${JOBTITLEURLGET}/service/job-title/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsJobTitle = async (body) => {
  const result = await HttpServices.post(
    `${JOBTITLEURLWRITE}/service/job-title`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsJobTitle = async (body) => {
  const result = await HttpServices.put(
    `${JOBTITLEURLWRITE}/service/job-title`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsJobTitle = async (params) => {
  const result = await HttpServices.delete(`${JOBTITLEURLWRITE}/service/job-title`, {
    params,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

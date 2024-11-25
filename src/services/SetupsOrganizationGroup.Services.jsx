import { HttpServices } from '../helpers';

const HMGBASEURLGET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const HMGBASEURLWRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const JOBTITLEURLGET = `${HMGBASEURLGET}/api/setup/${VERSION}`;
const JOBTITLEURLWRITE = `${HMGBASEURLWRITE}/api/setup/${VERSION}`;

export const GetAllSetupsOrganizationGroup = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${JOBTITLEURLGET}/organizational/organization_group?${queryList.join('&')}`,
    {
      params: { with_than, other_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsOrganizationGroupById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${JOBTITLEURLGET}/organizational/organization_group/view?${queryList.join(
      '&',
    )}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsOrganizationGroup = async (body) => {
  const result = await HttpServices.post(
    `${JOBTITLEURLWRITE}/organizational/organization_group`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsOrganizationGroup = async (body) => {
  const result = await HttpServices.put(
    `${JOBTITLEURLWRITE}/organizational/organization_group`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsOrganizationGroup = async (params) => {
  const result = await HttpServices.delete(
    `${JOBTITLEURLWRITE}/organizational/organization_group`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

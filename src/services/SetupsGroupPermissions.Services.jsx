import { HttpServices } from '../helpers';

const HMGBASEURL = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const HMGBASEURLWRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const TEAMSURLGET = `${HMGBASEURL}/api/${VERSION}`;
const TEAMSURLWRITE = `${HMGBASEURLWRITE}/api/${VERSION}`;

export const GetAllSetupsGroupPermissions = async ({
  limit,
  page,
  search,
  user_type,
  status = true,
  use_for = 'dropdown',
  with_than,
  other_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (user_type || user_type === 0) queryList.push(`user_type=${user_type}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${TEAMSURLGET}/team?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsGroupPermissionById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${TEAMSURLGET}/team/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsGroupPermissions = async (body) => {
  const result = await HttpServices.post(`${TEAMSURLWRITE}/team`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsGroupPermissions = async (body) => {
  const result = await HttpServices.put(`${TEAMSURLWRITE}/team`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsGroupPermission = async (params) => {
  const result = await HttpServices.delete(`${TEAMSURLWRITE}/team`, {
    params,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

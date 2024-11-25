import { HttpServices } from '../helpers';

const REACT_APP_DOMIN_PHP_API_GET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const REACT_APP_DOMIN_PHP_API = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const CATEGORIESURLGET = `${REACT_APP_DOMIN_PHP_API_GET}/api/${VERSION}`;
const CATEGORIESURLWRITE = `${REACT_APP_DOMIN_PHP_API}/api/${VERSION}`;

export const GetAllSetupsCategoriesPermissions = async ({
  limit,
  page,
  search,
  user_type,
  // status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (user_type || user_type === 0) queryList.push(`user_type=${user_type}`);
  // if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${CATEGORIESURLGET}/category-permission?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsCategoriesPermissionsById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${CATEGORIESURLGET}/category-permission/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsCategoryPermission = async (body) => {
  const result = await HttpServices.post(
    `${CATEGORIESURLWRITE}/category-permission`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsCategoryPermission = async (body) => {
  const result = await HttpServices.put(
    `${CATEGORIESURLWRITE}/category-permission`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsCategoryPermission = async (params) => {
  const result = await HttpServices.delete(
    `${CATEGORIESURLWRITE}/category-permission`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

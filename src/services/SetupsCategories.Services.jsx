import { HttpServices } from '../helpers';

const HMGBASEURLGET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const CATEGORIESURLGET = `${HMGBASEURLGET}/api/setup/${VERSION}`;
const BASEURL = `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${VERSION}`;

export const GetAllSetupsCategories = async ({
  limit,
  page,
  search,
  user_type,
  status = true,
  use_for = 'dropdown',
  branch_uuid,
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
    `${CATEGORIESURLGET}/category/list?${queryList.join('&')}`,
    {
      params: { with_than },
      headers: {
        'Accept-Company': branch_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsCategoriesById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${CATEGORIESURLGET}/category?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsCategory = async (body) => {
  const result = await HttpServices.post(`${BASEURL}/category`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsCategory = async (body) => {
  const result = await HttpServices.put(`${BASEURL}/category`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsCategory = async (params) => {
  const result = await HttpServices.delete(`${BASEURL}/category`, {
    params,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

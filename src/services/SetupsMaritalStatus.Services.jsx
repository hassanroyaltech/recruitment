import { HttpServices } from '../helpers';

export const GetAllSetupsMaritalStatus = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
  company_uuid,
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
    }/service/marital?${queryList.join('&')}`,
    {
      params: { with_than },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsMaritalStatusById = async ({ uuid, company_uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/service/marital/view?${queryList.join('&')}`,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsMaritalStatus = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/marital`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateSetupsMaritalStatus = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/marital`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsMaritalStatus = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/marital`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

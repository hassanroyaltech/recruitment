import { HttpServices } from '../helpers';

export const GetAllSetupsPositions = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  hierarchy_uuid,
  with_than,
  company_uuid,
  with_alias,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (hierarchy_uuid) queryList.push(`hierarchy_uuid=${hierarchy_uuid}`);
  if (with_alias) queryList.push(`with_alias=${with_alias}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/personnel/position?${queryList.join('&')}`,
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
export const GetAllSetupsDirectManagers = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  hierarchy_uuid,
  with_than,
  company_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (hierarchy_uuid) queryList.push(`hierarchy_uuid=${hierarchy_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/organizational/hierarchy/direct/managers/list?${queryList.join('&')}`,
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
export const getSetupsPositionsById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/personnel/position/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsPositions = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/personnel/position`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateSetupsPositions = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/personnel/position`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsPosition = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/personnel/position`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

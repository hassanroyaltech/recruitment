import { HttpServices } from '../helpers';

export const getSetupsHierarchy = async ({
  uuid,
  use_for = 'dropdown',
  other_than,
  to_list,
  search,
  page,
  limit,
  with_than,
} = {}) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (search) queryList.push(`query=${search}`);
  if (page) queryList.push(`page=${page}`);
  if (limit) queryList.push(`limit=${limit}`);
  if (to_list) queryList.push(`to_list=${to_list}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/organizational/hierarchy?${queryList.join('&')}`,
    {
      params: { with_than, other_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsHierarchy = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/organizational/hierarchy`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

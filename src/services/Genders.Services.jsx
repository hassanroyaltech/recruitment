import { HttpServices } from '../helpers';

export const GetAllGenders = async (
  status = true,
  use_for = 'dropdown',
  with_than,
) => {
  const queryList = [];
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push('use_for=dropdown');

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${
      process.env.REACT_APP_VERSION_API
    }/account_gender?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error);
  return result;
};

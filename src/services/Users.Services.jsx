import { HttpServices } from '../helpers';

export const GetAllUsers = async ({ company_uuid, limit, page, search }) => {
  const queryList = [];
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  if (search) queryList.push(`search=${search}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/${
      process.env.REACT_APP_VERSION_API
    }/users?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

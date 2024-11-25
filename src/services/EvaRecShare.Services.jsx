import { HttpServices } from '../helpers';

export const GetAllRecruiter = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  uuid,
  with_than,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/recruiter`,
    {
      params: { with_than, limit, page, query: search, status, use_for, uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

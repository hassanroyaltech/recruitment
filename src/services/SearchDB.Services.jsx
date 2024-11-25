import { HttpServices } from '../helpers';

export const SearchDBUpdateAssignedUser = async ({
  candidate_email,
  assigned_user_type,
  assigned_user_uuid,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/candidate/search-db/assigned`,
    {
      candidate_email,
      assigned_user_type,
      assigned_user_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllCandidatesSearchDB = async ({
  limit,
  page,
  search,
  // status = true,
  // use_for = 'dropdown',
  // with_than,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API_V2}/candidate/search`,
    {
      is_include: false,
      page,
      limit,
      query: search,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllCandidatesSearchDBNew = async ({
  use_for = 'search_db',
  limit = 12,
  page = 1,
  params,
  arrays = {},
  search,
  isDropdown,
}) => {
  let queryString = '';
  if (arrays)
    Object.keys(arrays).forEach((key) => {
      if (arrays[key])
        arrays[key].forEach((value) => {
          queryString = `${queryString}&${key}=${value}`;
        });
    });
  return await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dynamic-analytics/candidate/index`,
    {
      ...params,
      use_for,
      page,
      limit,
      ...arrays,
      ...(isDropdown && search && { query: [search] }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
};

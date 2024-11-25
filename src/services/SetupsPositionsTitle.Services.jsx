import { HttpServices } from '../helpers';

const HMGBASEURLGET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const HMGBASEURLWRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const JOBPOSITIONEURLGET = `${HMGBASEURLGET}/api/setup/${VERSION}/personnel`;
const JOBPOSITIONEURLWRITE = `${HMGBASEURLWRITE}/api/setup/${VERSION}/personnel`;

export const GetAllSetupsPositionsTitle = async ({
  limit,
  page,
  search,
  user_type,
  status = true,
  use_for = 'dropdown',
  with_than,
  company_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (user_type || user_type === 0) queryList.push(`user_type=${user_type}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${JOBPOSITIONEURLGET}/position_title?${queryList.join('&')}`,
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

export const getSetupsPositionTitleById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${JOBPOSITIONEURLGET}/position_title/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsPositionTitle = async (body) => {
  const result = await HttpServices.post(
    `${JOBPOSITIONEURLWRITE}/position_title`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsPositionTitle = async (body) => {
  const result = await HttpServices.put(
    `${JOBPOSITIONEURLWRITE}/position_title`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsPositionTitle = async (params) => {
  const result = await HttpServices.delete(
    `${JOBPOSITIONEURLWRITE}/position_title`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsPositionTitleStatus = () =>
  HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/position-title/setting`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateSetupsPositionTitleStatus = () =>
  HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/ats/${process.env.REACT_APP_VERSION_API}/position-title/setting`,
  )
    .then((data) => data)
    .catch((error) => error.response);

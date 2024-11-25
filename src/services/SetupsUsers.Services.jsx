import { HttpServices } from '../helpers';

const HMGBASEURLGET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const HMGBASEURLWRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const USERSURLGET = `${HMGBASEURLGET}/api/${VERSION}`;
const USERSURLWRITE = `${HMGBASEURLWRITE}/api/${VERSION}`;

export const GetAllSetupsUsers = async ({
  limit = 10,
  page = 1,
  search,
  user_type,
  category_uuid,
  status = true,
  committeeType,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
  custom_header = null,
  forCandidate = false,
  all_users,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (user_type || user_type === 0) queryList.push(`user_type=${user_type}`);
  if (category_uuid) queryList.push(`category_uuid=${category_uuid}`);
  if (status && use_for !== 'dropdown') queryList.push(`status=${status}`);
  if (committeeType) queryList.push(`user_for=${committeeType}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (all_users) queryList.push(`all_users=${all_users}`);

  const result = await HttpServices.get(
    `${USERSURLGET}/user${forCandidate ? '/recipient' : ''}?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
      },
      headers:
        {
          ...(company_uuid && {
            'Accept-Company': company_uuid,
          }),
          ...(custom_header && custom_header),
        } || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsUserCompanyDetails = async ({ user_uuid }) => {
  const queryList = [];
  const account_uuid = JSON.parse(localStorage.getItem('account'))
    ? JSON.parse(localStorage.getItem('account')).account_uuid
    : '';
  if (user_uuid) queryList.push(`user_uuid=${user_uuid}`);
  if (account_uuid) queryList.push(`account_uuid=${account_uuid}`);

  const result = await HttpServices.get(
    `${USERSURLGET}/user/user-company-details?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsUserCompanyDetails = async (body) => {
  const result = await HttpServices.put(
    `${USERSURLWRITE}/user/user-company-assign`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsUsersById = async ({ uuid, company_uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${USERSURLGET}/user/view?${queryList.join('&')}`,
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

export const CreateSetupsUsers = async (body) => {
  const result = await HttpServices.post(`${USERSURLWRITE}/user`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsUsers = async (body) => {
  const result = await HttpServices.put(`${USERSURLWRITE}/user`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsUser = async (params) => {
  const result = await HttpServices.delete(`${USERSURLWRITE}/user`, { params })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendReminderSetupsUser = async (body) => {
  const result = await HttpServices.post(`${USERSURLWRITE}/user/send-reminder`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

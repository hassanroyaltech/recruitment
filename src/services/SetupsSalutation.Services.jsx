import { HttpServices } from '../helpers';

export const GetAllSetupsSalutation = async ({
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
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/salutation/?${queryList.join('&')}`,
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

export const GetSetupsSalutationById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/salutation/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsSalutation = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/salutation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsSalutation = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/salutation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsSalutation = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/setup/${process.env.REACT_APP_VERSION_API}/salutation`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

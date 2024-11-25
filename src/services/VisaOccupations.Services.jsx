import { HttpServices } from '../helpers';

export const GetAllVisaOccupations = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/occupations?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateVisaOccupation = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/occupation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateVisaOccupation = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/occupation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaOccupationById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/occupation?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteVisaOccupations = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/occupation`,
    { data },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const StatusVisaOccupation = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/occupation/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

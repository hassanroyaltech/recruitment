import { HttpServices } from '../helpers';

export const GetAllVisaReligions = async ({
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
    `${process.env.REACT_APP_VISA_API}/religions?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateVisaReligion = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/religion`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateVisaReligion = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/religion`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaReligionById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/religion?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteVisaReligions = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/religion`,
    { data },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const StatusVisaReligion = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/religion/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

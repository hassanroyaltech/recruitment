import { HttpServices } from '../helpers';

export const GetAllVisaGenders = async ({
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
    `${process.env.REACT_APP_VISA_API}/genders?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateVisaGender = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/gender`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateVisaGender = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/gender`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaGenderById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/gender?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteVisaGenders = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/gender`,
    { data },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const StatusVisaGender = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/gender/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

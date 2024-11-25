import { HttpServices } from '../helpers';

export const GetAllVisaDashboardBlocks = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/dashboard`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllVisaDashboardVisas = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/dashboard/visas`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateVisaBlock = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/visa-repository`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateVisaBlock = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/visa-repository`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaBlockById = async ({ block_uuid }) => {
  const queryList = [];
  if (block_uuid) queryList.push(`uuid=${block_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/visa-repository?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteVisaBlocks = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/visa-repository`,
    { data },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllBlockNumber = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/visa-repository/blocks?${queryList.join(
      '&',
    )}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

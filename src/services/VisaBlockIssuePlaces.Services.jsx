import { HttpServices } from '../helpers';

export const GetAllVisaBlockIssuePlaces = async ({
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
  return await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/block_issue_places?${queryList.join('&')}`,
    {
      params: { with_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const CreateVisaBlockIssuePlace = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/block_issue_place`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateVisaBlockIssuePlace = async (body) =>
  await HttpServices.put(`${process.env.REACT_APP_VISA_API}/block_issue_place`, body)
    .then((data) => data)
    .catch((error) => error.response);

export const GetVisaBlockIssuePlaceById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  return await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/block_issue_place?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const DeleteVisaBlockIssuePlaces = async (data) =>
  await HttpServices.delete(`${process.env.REACT_APP_VISA_API}/block_issue_place`, {
    data,
  })
    .then((data) => data)
    .catch((error) => error.response);

export const StatusVisaBlockIssuePlace = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/block_issue_place/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

import { HttpServices } from '../helpers';

export const GetAllVisaSponsors = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown',
  with_than,
}) =>
  await HttpServices.get(`${process.env.REACT_APP_VISA_API}/sponsors`, {
    params: {
      with_than,
      limit,
      page,
      query: search,
      status,
      use_for,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);

export const CreateVisaSponsor = async (body) =>
  await HttpServices.post(`${process.env.REACT_APP_VISA_API}/sponsor`, body)
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateVisaSponsor = async (body) =>
  await HttpServices.put(`${process.env.REACT_APP_VISA_API}/sponsor`, body)
    .then((data) => data)
    .catch((error) => error.response);

export const GetVisaSponsorById = async ({ uuid }) =>
  await HttpServices.get(`${process.env.REACT_APP_VISA_API}/sponsor`, {
    params: { uuid },
  })
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteVisaSponsors = async (data) =>
  await HttpServices.delete(`${process.env.REACT_APP_VISA_API}/sponsor`, {
    data,
  })
    .then((data) => data)
    .catch((error) => error.response);

export const StatusVisaSponsor = async (body) =>
  await HttpServices.put(`${process.env.REACT_APP_VISA_API}/sponsor/status`, body)
    .then((data) => data)
    .catch((error) => error.response);

import { HttpServices } from '../helpers';

export const GetAllVisaReservations = async ({
  limit,
  page,
  status,
  query,
  reserve_for,
  reserve_for_type,
  order_by = '1',
  order_type = 'DESC',
  occupation,
  nationality,
  gender,
  religion,
  issue_place,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/reserve-visa/requests`,
    {
      limit,
      page,
      status,
      reserve_for,
      reserve_for_type,
      query,
      occupation,
      nationality,
      gender,
      religion,
      issue_place,
      order_by,
      order_type,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllVisaReservationsDetails = async ({
  limit,
  page,
  status,
  query,
  reserve_for,
  reserve_for_type,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/reserve-visa/details`,
    {
      params: { limit, page, status, reserve_for, reserve_for_type, query },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VisaReservationRequestMoreInfo = async ({
  request_uuid,
  more_info,
}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/reserve-visa/request-info`,
    {
      request_uuid,
      more_info,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VisaReservationConfirm = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/reserve-visa`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const VisaReservationSubmit = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/reserve-visa/request`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateVisaReservation = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/reserve-visa/request`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaReservationById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/reserve-visa/request/view?${queryList.join(
      '&',
    )}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteOrRejectVisaReservation = async ({ uuid }) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/reserve-visa`,
    {
      data: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ExportVisaRequests = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/requests-attachments`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

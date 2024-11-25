import { HttpServices } from '../helpers';

export const GetAllVisaAllocations = async ({
  page,
  limit,
  candidate_uuid,
  job_uuid,
  occupation,
  nationality,
  gender,
  religion,
  issue_place,
  status,
  query,
  requested_from,
  requested_from_type,
  order_by = '1',
  order_type = 'DESC',
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/requests`,
    {
      page,
      limit,
      candidate_uuid,
      job_uuid,
      occupation,
      nationality,
      gender,
      religion,
      issue_place,
      status,
      query,
      requested_from,
      requested_from_type,
      order_by,
      order_type,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetVisaRequestDetailsForCandidate = async ({
  job_uuid,
  candidate_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/candidate-visa`,
    {
      params: {
        job_uuid,
        candidate_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VisaAllocationRequestMoreInfo = async ({ request_uuid, more_info }) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/request-info`,
    {
      request_uuid,
      more_info,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VisaAllocationConfirm = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/visa-allocation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const VisaAllocationSubmit = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/request`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateVisaAllocation = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/request`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaAllocationById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/request/view?${queryList.join(
      '&',
    )}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RejectVisaAllocation = async ({ request_uuid }) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/allocate-visa/decline-request`,
    {
      request_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

import { HttpServices } from '../helpers';

export const GetAllVisaTypes = async ({
  limit,
  page,
  search,
  status = true,
  with_than,
  block_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/visa-repository/visa?${queryList.join('&')}`,
    {
      params: { with_than, status, uuid: block_uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateVisaType = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/visa-repository/visa`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateVisaType = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/visa-repository/visa`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetVisaTypeById = async ({ visa_uuid }) => {
  const queryList = [];
  if (visa_uuid) queryList.push(`uuid=${visa_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/visa-repository/visa/view?${queryList.join(
      '&',
    )}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteVisaTypes = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/visa-repository/visa`,
    { data },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UploadVisaCsv = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);
  return await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/visa-repository/upload`,
    formData,
  )
    .then((data) => data)
    .catch((error) => error.response);
};
export const GetAllVisaReports = async ({ limit, page }) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/visa-repository/all-reports?${queryList.join(
      '&',
    )}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const ExportVisaRepositoryReport = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/visa-repository/export`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

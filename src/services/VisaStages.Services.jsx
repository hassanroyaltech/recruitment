import { HttpServices } from '../helpers';

export const GetAllVisaStagesDropdown = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/stages/dropdown`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllVisaStages = async ({
  limit,
  page,
  use_for = 'dropdown',
  order_by = 'order',
  order_type = 1,
  with_than,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/visa-stages`,
    {
      params: { limit, page, use_for, with_than, order_by, order_type },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllVisaStagesReminderTypes = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/reminder/dropdown`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateVisaStage = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/visa-stage`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateVisaStage = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/visa-stage`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateVisaStagesReorder = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/stages/reorder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteVisaStage = async (data) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_VISA_API}/visa-stage`,
    {
      data,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

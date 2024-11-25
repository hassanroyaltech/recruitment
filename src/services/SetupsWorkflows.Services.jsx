import { HttpServices } from '../helpers';

export const GetAllSetupsWorkflowsTemplates = async ({
  limit,
  page,
  search,
  type,
  status = true,
  use_for = 'dropdown',
  with_than,
  other_than,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (type) queryList.push(`type=${type}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/workflow/${
      process.env.REACT_APP_VERSION_API
    }/template?${queryList.join('&')}`,
    {
      params: { with_than, other_than },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllSetupsWorkflowsTemplatesTypes = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/workflow/${process.env.REACT_APP_VERSION_API}/template/options`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsWorkflowTemplateById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/workflow/${
      process.env.REACT_APP_VERSION_API
    }/template/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsWorkflowsApprovalsByType = async ({ approval_type }) => {
  const queryList = [];
  if (approval_type) queryList.push(`approval_type=${approval_type}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/workflow/${
      process.env.REACT_APP_VERSION_API
    }/template?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsWorkflowsTemplate = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/workflow/${process.env.REACT_APP_VERSION_API}/template`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateSetupsWorkflowsTemplate = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/workflow/${process.env.REACT_APP_VERSION_API}/template`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsWorkflowsTemplate = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/workflow/${process.env.REACT_APP_VERSION_API}/template`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

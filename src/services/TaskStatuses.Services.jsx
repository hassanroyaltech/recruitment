import { HttpServices } from '../helpers';

export const GetAllSetupsTaskStatuses = async ({
  limit,
  page,
  search,
  status,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task_status`,
    {
      params: { with_than, other_than, limit, page, query: search, status, use_for },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetSetupsTaskStatusById = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task_status/view`,
    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateSetupsTaskStatus = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task_status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateSetupsTaskStatus = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task_status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteSetupsTaskStatus = async ({ uuid }) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task_status`,
    {
      params: { uuids: uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

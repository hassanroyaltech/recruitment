import { HttpServices } from '../helpers';

export const GetAllTasks = async ({ limit, page, search, filters }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task/users/list`,
    {
      params: {
        ...filters,
        limit,
        page,
        search,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GetAllTaskTypes = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  with_than,
  other_than,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task_type`,
    {
      params: { with_than, other_than, limit, page, search, status, use_for },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetTaskById = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task/users/view`,
    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateTask = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task/users`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateTask = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task/users`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateTaskStatus = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task/users/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteTask = async (params) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/task/users`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllTriggerTaskTypes = async ({ have_candidate_relation }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task/users/types`,
    {
      params: { have_candidate_relation },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const MarkTaskAsCompleted = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/task/users/mark-as-completed`,
    {
      params: { uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

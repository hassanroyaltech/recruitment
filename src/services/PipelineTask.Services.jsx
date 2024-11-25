import { HttpServices } from '../helpers';

export const GetAllPipelineTasks = async ({
  pipeline_uuid,
  limit = 10,
  page = 1,
  order_by,
  order,
  query,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/templates`,
    {
      params: {
        pipeline_uuid,
        limit,
        page,
        order_by,
        order,
        query,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreatePipelineTaskFunc = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/templates`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeletePipelineTask = async (body) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/templates`,
    { data: body },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdatePipelineTaskFunc = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/templates`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetPipelineTaskData = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/templates/view`,
    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreatePipelineTaskQuery = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeletePipelineTaskQuery = async (body) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdatePipelineTaskQuery = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllPipelineTasksSources = async ({
  parent_uuid,
  pipeline_uuid,
  is_grouped,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/sources`,
    {
      params: {
        parent_uuid,
        pipeline_uuid,
        is_grouped: is_grouped ? 1 : 0,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllPipelineTasksFilters = async ({
  source,
  source_operator_group,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/filters`,
    {
      params: {
        source,
        source_operator_group,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllPipelineTasksActions = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/pipeline-task/actions`,
  )
    .then((data) => data)
    .catch((error) => error.response);

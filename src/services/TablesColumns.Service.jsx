import { HttpServices } from '../helpers';

export const GetTableColumns = async ({ feature_name }) => {
  const queryList = [];
  if (feature_name) queryList.push(`feature_name=${feature_name}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/service/gridview/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateTableColumns = async ({ feature_name, columns }) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/service/gridview/update`,
    {
      feature_name,
      columns,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DynamicService = async ({
  method,
  path,
  data,
  params,
  body,
  headers,
  responseType,
}) => {
  let result;
  let newParam = { ...params };
  let withThanString = '';
  if (params?.is_python && newParam.with_than?.length) {
    newParam.with_than.forEach((item, idx) => {
      withThanString = `${withThanString}${idx === 0 ? '?' : '&'}with_than=${item}`;
    });
    delete newParam.with_than;
  }
  delete newParam.is_python;
  if (method === 'post' || method === 'put')
    result = await HttpServices[method](path, body, {
      data,
      params,
      responseType,
      headers,
    })
      .then((response) => response)
      .catch((error) => error.response);
  else
    result = await HttpServices[method](
      `${path}${withThanString ? withThanString : ''}`,
      {
        data,
        params: newParam || body,
        headers,
        responseType,
      },
    )
      .then((response) => response)
      .catch((error) => error.response);
  return result;
};

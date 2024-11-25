import _ from 'lodash';

export const toSnakeCase = (obj) =>
  _.transform(obj, (acc, value, key, target) => {
    const snakeKey = _.isArray(target) ? key : _.snakeCase(key);
    acc[snakeKey] = _.isObject(value)
      ? (key === 'file' && value) || toSnakeCase(value)
      : value;
  });

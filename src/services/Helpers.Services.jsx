import { HttpServices } from '../helpers';

export const GetAllItemsByHelper = async (helper_name, { for_campaign } = {}) => {
  const queryList = [];
  if (for_campaign) queryList.push(`for_campaign=${for_campaign}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${
      process.env.REACT_APP_VERSION_API
    }/${helper_name}?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllItemsByHelperDynamic = async (
  apiPath,
  { for_campaign, query },
) => {
  const queryList = [];
  if (for_campaign) queryList.push(`for_campaign=${for_campaign}`);
  if (query) queryList.push(`query=${query}`);
  const result = await HttpServices.get(`${apiPath}?${queryList.join('&')}`)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

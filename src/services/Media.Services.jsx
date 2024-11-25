import { HttpServices } from '../helpers';

export const GetMultipleMedias = async ({ uuids }, externalUser) => {
  const queryList = [];
  if (uuids?.length) uuids.map((uuid) => queryList.push(`uuid[]=${uuid}`));

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }${externalUser ? '/recipient' : ''}/media/multiple?${queryList.join('&')}`,
    {
      ...(externalUser && {
        headers: { ...externalUser },
      }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetMultipleMediasRecipient = async ({ uuids }, externalUser) => {
  const queryList = [];
  if (uuids?.length) uuids.map((uuid) => queryList.push(`uuid[]=${uuid}`));

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API_V2
    }/recipient/media/multiple?${queryList.join('&')}`,
    {
      ...(externalUser && {
        headers: { ...externalUser },
      }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

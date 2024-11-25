import { HttpServices } from '../helpers';

// PartnersLookupsEnum
export const GetAllSetupsIntegrationsForPartner = async ({
  page,
  limit,
  with_than,
  use_for = 'dropdown',
  search,
  lookup,
}) => {
  const queryList = [];
  if (with_than && with_than.length > 0)
    with_than.map((item) => queryList.push(`with_than=${item}`));
  const result = await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/lookups${
      (queryList.length > 0 && `?${queryList.join('&')}`) || ''
    }`,
    {
      params: {
        lookup,
        page,
        limit,
        use_for,
        query: search,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsIntegrationsForPartnerById = async ({ uuid, lookup }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/lookup`,
    {
      params: {
        uuid,
        lookup,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsIntegrationsForPartner = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/lookup`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateSetupsIntegrationsForPartner = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/lookup`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsIntegrationsForPartner = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/lookup`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateStatusSetupsIntegrationsForPartner = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/lookup`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

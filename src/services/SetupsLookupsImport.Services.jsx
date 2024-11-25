import { HttpServices } from '../helpers';

export const GetAllLookupsImportHistory = async ({
  limit,
  page,
  search,
  model, // required
  status,
  // use_for = 'dropdown',
  with_than,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/helper/import`,
    {
      params: { limit, page, search, status, with_than, model },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetLookupsImportHistoryDetails = async ({ uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/helper/import/view`,
    {
      params: { uuid },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const ValidatedLookupsImport = async ({ uuid }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/helper/import/start_import`,
    {
      uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const ValidateOrImportLookups = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/helper/import`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const ValidateOrImportBulkLookups = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/helper/bulk/import`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllBulkImportSheets = async ({
  limit,
  page,
  search,
  model, // required
  status,
  with_than,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/helper/bulk/import`,
    {
      params: { limit, page, search, status, with_than, model },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllBulkImportSheetData = async ({
  uuid, // required
  sheet, // required
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/helper/bulk/import/view`,
    {
      params: { uuid, sheet },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

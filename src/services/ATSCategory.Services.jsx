import { HttpServices } from '../helpers';

export const GetAllJobCategories = async ({ company_uuid }) => {
  const queryList = [];
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/category/dropdown?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllJobCategoriesByCode = async ({ for_settings, with_than }) => {
  const queryList = [];
  if (for_settings || for_settings === false)
    queryList.push(`for_settings=${for_settings}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/setup/${
      process.env.REACT_APP_VERSION_API
    }/category/account/code?${queryList.join('&')}`,
    {
      params: {
        with_than,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPreScreeningCategories = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  pre_screening_uuid,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (pre_screening_uuid) queryList.push(`pre_screening_uuid=${pre_screening_uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${
      process.env.REACT_APP_VERSION_API
    }/pre-screening/categories?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllSignupRequirements = async ({ language_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/company/${process.env.REACT_APP_VERSION_API_V2}/profile-builder/signup`,
    {
      params: {
        language_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSignupRequirements = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/company/${process.env.REACT_APP_VERSION_API_V2}/profile-builder/signup`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const BulkUpdateSignupRequirements = async (body) => {
  const result = Promise.all(
    body.map((item) =>
      Promise.resolve(
        HttpServices.put(
          `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/company/${process.env.REACT_APP_VERSION_API_V2}/profile-builder`,
          item,
        ),
      ).catch((error) => error),
    ),
  )
    .then((valuesAndErrors) => valuesAndErrors)
    .catch((error) => error);
  return result;
};

import { HttpServices } from '../helpers';

export const GetAllEmailTemplates = async ({ limit, page, search }) => {
  //   status = true,
  //   use_for = 'dropdown',
  //   with_than,
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  //   if (status) queryList.push(`status=${status}`);
  //   if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${
      process.env.REACT_APP_VERSION_API
    }/template?${queryList.join('&')}`,
    // {
    //   params: { with_than },
    // },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEmailTemplateById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`id=${uuid}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${
      process.env.REACT_APP_VERSION_API
    }/template/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetLanguagesForEmails = async () => {
  // not specific for email
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${process.env.REACT_APP_ENDPOINT_HELPER_API}/${process.env.REACT_APP_VERSION_API}/languages`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEmailVariables = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/template/collection`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEmailTemplateByLanguageId = async ({ language_id, slug }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/template/slug`,
    {
      params: {
        slug,
        language_id,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEmailSystemTemplateBySlug = async ({ language_id, slug }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/template/system/template`,
    {
      params: {
        slug,
        language_id,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetEmailTemplateBySlug = async ({ slug }) => {
  const result = await HttpServices.request({
    url: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/template`,
    method: 'VIEW',
    params: {
      slug,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

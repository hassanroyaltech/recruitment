import { HttpServices } from '../helpers';

export const GetAccountEmailMaskingSetting = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/account/settings/ses `,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetCompanyEmailMaskingSetting = async ({ company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/company/settings/ses `,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateAccountEmailMaskingSetting = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/ses`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateCompanyEmailMaskingSetting = async (body, company_uuid) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/company/settings/ses `,
    body,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyAccountEmailMaskingDomain = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/ses/verify-domain`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RetryVerifyAccountEmailMaskingDomain = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/settings/ses/retry`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyCompanyEmailMaskingDomain = async (body, company_uuid) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/company/settings/ses/verify-domain`,
    body,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RetryVerifyCompanyEmailMaskingDomain = async (body, company_uuid) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/company/settings/ses/retry`,
    body,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

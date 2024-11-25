import { HttpServices } from '../helpers';

export const LoginService = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/login`,
    body,
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const TokenRefreshService = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/user/refresh-token`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateTokenAndSessionSettings = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_URL_Auth}/api/${process.env.REACT_APP_VERSION_API}/account/settings/token-settings`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetTokenAndSessionSettings = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_URL_Auth}/api/${process.env.REACT_APP_VERSION_API}/account/settings/token-settings`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetRecruiterDetails = async ({ company_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/${process.env.REACT_APP_VERSION_API}/details`,
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

export const RegisterService = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/register`,
    body,
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const LogoutService = async () => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/logout`,
    null,
  )
    .then((data) => data)
    .catch((error) => error.response);

  if (result?.status === 200) {
    window?.ChurnZero?.push(['trackEvent', 'Logout', 'Logout successfully', 1, {}]);
    window?.ChurnZero?.push(['stop']);
  }
  return result;
};

export const ChangePassword = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/change-password`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ResetPassword = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/reset-password`,
    body,
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetUserVerification = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/user/verification`,
    {
      data: params,
      params,
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetUserNewVerification = async ({ key }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/new/verification`,
    {
      key,
    },
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ResetPasswordService = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/set-password`,
    body,
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GenerateSSOKey = async ({
  company_uuid,
  token,
  account_uuid,
  isSkipTokenCheck,
} = {}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/user/sso/generate`,
    {
      headers:
        (company_uuid && {
          customHeaders: true,
          'Accept-Company': company_uuid,
          Authorization: `Bearer ${token}`,
          'Accept-Account': account_uuid,
          ...(isSkipTokenCheck && { isSkipTokenCheck: true }),
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ValidateSSOKey = async (key) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/user/sso/validate`,
    { key },
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

export const ValidateAccountNumber = async ({ account_number, is_portal = 1 }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/account/info`,
    {
      params: {
        account_number,
        is_portal,
      },
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};
export const ValidateAccountDomain = async ({
  domain,
  account_uuid,
  is_portal = 1,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/sso-providers/`,
    {
      params: {
        domain,
        account_uuid,
        is_portal,
      },
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};
export const ValidateThirdPartyToken = async ({
  code,
  provider,
  session_state,
  queryState,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/account/verified`,
    {
      code,
      provider,
      state: queryState,
      session_state,
    },
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};
export const ValidateMicroSoftToken = async ({
  code,
  provider,
  session_state,
  queryState,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/azure/login`,
    {
      code,
      provider,
      state: queryState,
      session_state,
    },
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};
export const ValidateOracleSSOToken = async ({
  code,
  provider,
  session_state,
  queryState,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/login`,
    {
      code,
      provider,
      state: queryState,
      session_state,
    },
    {
      headers: {
        isPublic: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

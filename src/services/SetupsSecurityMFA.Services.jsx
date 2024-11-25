import { HttpServices } from '../helpers';

export const GetSecurityMFASettings = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_MFA_API}/admin/enforce-mfa`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSecurityMFASettings = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/admin/enforce-mfa`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSecurityMFARecoveryCodes = async ({ user_email }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_MFA_API}/admin/get-codes`,
    {
      params: {
        user_email,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SecurityGenerateMFARecoveryCodes = async (user_email) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/admin/generate-codes`,
    user_email,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

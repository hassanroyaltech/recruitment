import { HttpServices } from '../helpers';

export const GetAuthenticatorApp = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_MFA_API}/user/authenticator/app/view`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateAuthenticatorApp = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/authenticator/setup`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyAuthenticatorApp = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/authenticator/setup/verify`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AuthenticatorCodeVerify = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/authenticator/verify`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteAuthenticatorApp = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_MFA_API}/user/authenticator/remove`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

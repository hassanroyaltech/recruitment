import { HttpServices } from '../helpers';

export const GenerateCodeByEmail = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/email/generate-code`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyCodeByEmail = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/email/verify-code`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

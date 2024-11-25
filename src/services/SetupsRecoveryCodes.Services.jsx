import { HttpServices } from '../helpers';

export const GetRecoveryCode = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/recovery-codes/codes`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GenerateRecoveryCode = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/recovery-codes/generate-codes`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyRecoveryCode = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/recovery-codes/verify`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

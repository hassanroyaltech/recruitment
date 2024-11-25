import { HttpServices } from '../helpers';

export const GetVerifiedDevices = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_MFA_API}/user/devices/verified-devices`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyUserDevice = async ({ email }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_MFA_API}/user/devices/verify`,
    {
      email,
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

export const DeleteVerifiedDevices = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_MFA_API}/user/devices/remove-device`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

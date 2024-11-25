import { HttpServices } from 'helpers';

export const GetSMTPDetails = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/smtp`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateSMTPDetails = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/smtp`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateSMTPStatus = async (status) =>
  await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/smtp/status`,
    { status },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SendSMTPTestEmail = async ({ to_name, to_email }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/mail/${process.env.REACT_APP_VERSION_API}/smtp/validate`,
    { to_name, to_email },
  )
    .then((data) => data)
    .catch((error) => error.response);

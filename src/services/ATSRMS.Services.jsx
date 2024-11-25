import { HttpServices } from '../helpers';

export const DeleteResume = async ({ rms_uuid }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/rms/${process.env.REACT_APP_VERSION_API}/delete`,
    {
      rms_uuid,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

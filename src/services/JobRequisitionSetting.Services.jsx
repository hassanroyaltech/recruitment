import { HttpServices } from '../helpers';

export const UpdateJobRequisitionSettings = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/requisition/${process.env.REACT_APP_VERSION_API}/setting`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetJobRequisitionSettings = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/requisition/${process.env.REACT_APP_VERSION_API}/setting`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

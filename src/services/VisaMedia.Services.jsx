import { HttpServices } from '../helpers';

export const VisaMediaUploader = async ({ files }) => {
  const formData = new FormData();
  files.map((file) => formData.append('files', file));
  // formData.append('files', files);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/media`,
    formData,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllVisaMedias = async ({
  media_uuid, // array of uuids
}) => {
  const queryList = [];
  media_uuid.map((item) => queryList.push(`media_uuid=${item}`));
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/media?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

import urls from '../api/urls';
import { HttpServices } from '../helpers';

// eslint-disable-next-line camelcase
export const UploadFile = async (
  { file, type, from_feature, for_account, company_uuid },
  externalUser,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('from_feature', from_feature);
  formData.append('for_account', for_account);

  const result = await HttpServices.post(
    externalUser ? urls.common.mediaRecipient : urls.common.media,
    formData,
    {
      ...(externalUser && {
        headers: {
          ...externalUser,
          ...((company_uuid && {
            'Accept-Company': company_uuid,
          })
            || undefined),
        },
      }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UploadFileRecipient = async (
  { file, type, from_feature, for_account, company_uuid },
  externalUser,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('from_feature', from_feature);
  formData.append('for_account', for_account);

  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/${process.env.REACT_APP_PREFIX_API}/${process.env.REACT_APP_VERSION_API_V2}/recipient/media`,
    formData,
    {
      ...(externalUser && {
        headers: {
          ...externalUser,
          ...((company_uuid && {
            'Accept-Company': company_uuid,
          })
            || undefined),
        },
      }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

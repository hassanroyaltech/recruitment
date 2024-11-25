// noinspection LongLine

import { HttpServices } from '../helpers';

export const GetEvaBrandSectionById = async ({ section_uuid }) => {
  const queryList = [];
  if (section_uuid) queryList.push(`uuid=${section_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/get?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateEvaBrandSection = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/create`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEvaBrandSection = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/update`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllEvaBrandSections = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/get-all?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const EvaBrandSectionToggle = async ({ section_uuid }) => {
  const queryList = [];
  if (section_uuid) queryList.push(`uuid=${section_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/toggle-hide?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteSections = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/delete`,
    {
      data: body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetEvaBrandSocialMediaByLanguageId = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/setup/show-social-media?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEvaBrandSocialMedia = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/setup/update-social-media`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEvaBrandSectionsOrder = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/change-order`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetEvaBrandAppearanceByLanguageId = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/setup/show-appearance?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEvaBrandAppearance = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/setup/update-appearance`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetEvaBrandSEOByLanguageId = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/setup/show-seo?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateEvaBrandSEO = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/setup/update-seo`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const EvaBrandPublish = async () => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/recruiter/career/portal/${process.env.REACT_APP_VERSION_API_V2}/publish`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const EvaBrandMakeDefault = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/make-default?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const EvaBrandTogglePublished = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/toggle-published?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetEvaBrandLanguageStatus = async ({ language_uuid }) => {
  const queryList = [];
  if (language_uuid) queryList.push(`language_uuid=${language_uuid}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/career/portal/${
      process.env.REACT_APP_VERSION_API_V2
    }/setup/show-setup?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

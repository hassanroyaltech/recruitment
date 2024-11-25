import { HttpServices } from '../helpers';
import { DefaultFormsTypesEnum } from '../enums';

export const GetAllFormsTypes = async ({
  // limit,
  // page,
  search,
  job_stage_uuid,
  isFormBuilderV1 = true,
  // status = true,
  // use_for = 'dropdown',
  // other_than,
  // with_than,
}) => {
  const queryList = [];
  // if (limit || limit === 0) queryList.push(`limit=${limit}`);
  // if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (job_stage_uuid) queryList.push(`job_stage_uuid=${job_stage_uuid}`);
  // if (status) queryList.push(`status=${status}`);
  // if (use_for) queryList.push(`use_for=${use_for}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${
      process.env.REACT_APP_VERSION_API
    }/formbuildertypes/list?${queryList.join('&')}`,
    // {
    //   params: {
    // with_than,
    // other_than
    // },
    // }
  )
    .then((response) => {
      response.data.results = response.data.results.filter((item) =>
        Object.values(DefaultFormsTypesEnum).some(
          (element) =>
            (isFormBuilderV1
              && element.key === item.code
              && element.isFormBuilderV1)
            || (!isFormBuilderV1
              && element.key === item.code
              && !element.isFormBuilderV1),
        ),
      );
      return response;
    })
    .catch((error) => error.response);
  return result;
};

export const CreateFormsType = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/formbuildertypes/create`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const OfferStatusChange = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/change/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateFormsType = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/formbuildertypes/update`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteFormType = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/formbuildertypes/delete`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteFormsTemplate = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/template/delete`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SignOffer = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/sign`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const OfferUpdate = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/update`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllOffers = async ({
  limit,
  page,
  search,
  status,
  candidate_uuid,
  job_uuid,
  code,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (candidate_uuid) queryList.push(`candidate_uuid=${candidate_uuid}`);
  if (job_uuid) queryList.push(`job_uuid=${job_uuid}`);
  if (code) queryList.push(`code=${code}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${
      process.env.REACT_APP_VERSION_API
    }/offer/list?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOfferById = async ({ uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/get/${uuid}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ShowOfferById = async ({ uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/show`,
    {
      params: {
        uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateOffer = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/update`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const sendOfferToBulkSelectedCandidates = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/bulk/send`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateOffer = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/create`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateManualOffer = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/manual-offer/create`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SendBulkManualOffer = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/manual-offer/bulk/send`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteOffer = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/delete`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateOfferStatus = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/update/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllTags = async ({ type_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/template/tags/list`,
    {
      params: {
        type_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendEmailWithOffer = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/send/offer-token`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ValidateOfferLinkKey = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/validate/offer-token`,
    body,
    {
      headers: {
        isSkipTokenCheck: true,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ValidateOfferWithDatabase = async ({ uuid, sections }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/validation`,
    {
      uuid,
      sections,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOfferAccountValidationWithDataBase = async ({ type_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/has/validation`,
    {
      params: {
        type_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOfferRecipientPDF = async ({
  uuid,
  company_uuid,
  token,
  account_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/form/${process.env.REACT_APP_VERSION_API}/recipient/download/pdf`,
    {
      params: {
        uuid,
        timezone: new window.Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      responseType: 'blob',
      headers: {
        customHeaders: true,
        'Accept-Company': company_uuid,
        'recipient-token': token,
        'Accept-Account': account_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOfferSenderPDF = async ({ uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/form/${process.env.REACT_APP_VERSION_API}/sender/download/pdf`,
    {
      params: {
        uuid,
        timezone: new window.Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      responseType: 'blob',
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SignForm = async ({ body, token, company_uuid, account_uuid }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/signed`,
    body,
    {
      headers: {
        customHeaders: true,
        'Accept-Company': company_uuid,
        'recipient-token': token,
        'Accept-Account': account_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RejectForm = async ({ body, token, company_uuid, account_uuid }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/reject`,
    body,
    {
      headers: {
        customHeaders: true,
        'Accept-Company': company_uuid,
        'recipient-token': token,
        'Accept-Account': account_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RequestFormMoreInfo = async ({
  body,
  token,
  company_uuid,
  account_uuid,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/request-more-info`,
    body,
    {
      headers: {
        customHeaders: true,
        'Accept-Company': company_uuid,
        'recipient-token': token,
        'Accept-Account': account_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendFormReminder = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/send/reminder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SendBulkOfferReminder = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/bulk/remind`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateDownLoadPDFRecipient = async ({
  body,
  company_uuid,
  token,
  account_uuid,
}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${
      process.env.REACT_APP_VERSION_API
    }/recipient/download/pdf?timezone=${
      new window.Intl.DateTimeFormat().resolvedOptions().timeZone
    }`,
    body,
    {
      responseType: 'blob',
      headers: {
        customHeaders: true,
        'Accept-Company': company_uuid,
        'recipient-token': token,
        'Accept-Account': account_uuid,
        Authorization: null,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateDownLoadPDFSender = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${
      process.env.REACT_APP_VERSION_API
    }/sender/download/pdf?timezone=${
      new window.Intl.DateTimeFormat().resolvedOptions().timeZone
    }`,
    body,
    {
      responseType: 'blob',
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DownloadFormBuilderFilesSender = async ({ body, path, type }) => {
  const result = await HttpServices.put(
    `${path}?timezone=${
      new window.Intl.DateTimeFormat().resolvedOptions().timeZone
    }`,
    body,
    {
      responseType: type === 'file' ? 'blob' : 'json',
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllFormsSettings = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/form/${process.env.REACT_APP_VERSION_API}/settings`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateFormsSetting = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${process.env.REACT_APP_VERSION_API}/settings`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteFormsSetting = async (params) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${process.env.REACT_APP_VERSION_API}/settings`,
    {
      params,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetFormBuilderVars = async ({ is_flow = false }) => {
  const queryList = [];
  if (is_flow) queryList.push(`is_flow=${is_flow}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/form/${
      process.env.REACT_APP_VERSION_API
    }/annotations/list?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ExtendDeadlineDate = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${
      process.env.REACT_APP_VERSION_API
    }/extend/deadline`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UploadOffer = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/offer/upload`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

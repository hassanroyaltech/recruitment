import { HttpServices } from '../helpers';
import { FormsSubmissionsLevelsTypesEnum } from '../enums';

export const GetBuilderTemplate = async ({ template_uuid, assign }) => {
  let localAssign = {};
  if (assign)
    assign.map((item, index) => {
      Object.entries(item).map(
        ([key, value]) => (localAssign[`assign[${index}][${key}]`] = value),
      );
      return undefined;
    });
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/template`,
    {
      params: {
        template_uuid,
        ...localAssign,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetBuilderForm = async ({
  form_uuid,
  company_uuid,
  editor_role,
  type_of_submission,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form`,
    {
      params: {
        form_uuid,
        type_of_submission,
        editor_role,
      },
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const BuilderFormStatusChange = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/status`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetBuilderFormTypes = async ({ version = 'v2', job_stage_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/type`,
    {
      params: {
        version,
        job_stage_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetBuilderFormCandidate = async ({
  form_uuid,
  type_of_submission = FormsSubmissionsLevelsTypesEnum.FormLevel.key,
  company_uuid,
  token,
  account_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/recipient`,
    {
      params: {
        form_uuid,
        type_of_submission,
      },
      headers:
        (company_uuid && {
          customHeaders: true,
          'Accept-Company': company_uuid,
          'recipient-token': token,
          'Accept-Account': account_uuid,
          Authorization: null,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllFormTemplates = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  is_not_shareable = false,
  other_than,
  with_than,
  form_type_uuid,
  code,
  tag,
  all = false,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (form_type_uuid) queryList.push(`type_uuid=${form_type_uuid}`);
  if (code) queryList.push(`code=${code}`);
  if (tag) queryList.push(`tag=${tag}`);

  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/formbuilder/${
      process.env.REACT_APP_VERSION_API
    }/template/list?${queryList.join('&')}`,
    {
      params: { with_than, other_than, ...(!all && { is_not_shareable }) },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllBuilderTemplates = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
  form_type_uuid,
  code,
  tag,
  is_not_shareable,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/template/list`,
    {
      params: {
        limit,
        page,
        query: search,
        status,
        use_for,
        other_than,
        with_than,
        form_type_uuid,
        code,
        tag,
        is_not_shareable,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RecipientLoginVerification = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/recipient/validation`,
    body,
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

export const RecipientLoginGroupVerification = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/recipient/login`,
    body,
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

export const GetAllBuilderForms = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
  assign_uuid,
  code,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/list`,
    {
      params: {
        limit,
        page,
        search,
        status,
        use_for,
        other_than,
        with_than,
        assign_uuid,
        code,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllFormsByFeature = async ({
  limit,
  page,
  search,
  status = true,
  use_for = 'dropdown',
  other_than,
  with_than,
  job_uuid,
  feature, // = 'form', 'offer' , 'onboarding'
  assign, // [{type: 1,uuid: ""}]
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/list`,
    {
      limit,
      page,
      search,
      status,
      use_for,
      other_than,
      with_than,
      job_uuid,
      assign,
      feature,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DownloadPDFService = async ({ form_uuid, company_uuid }) =>
  await HttpServices.get(`${process.env.REACT_APP_DELETE_API}/offer/view/`, {
    params: {
      company_uuid,
      uuid: form_uuid,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);

export const CreateBuilderForm = async (state) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateBuilderForm = async (state, { company_uuid } = {}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form`,
    state,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateBuilderFormRecipient = async (
  state,
  { company_uuid, token, account_uuid },
) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/recipient/submit`,
    state,
    {
      headers:
        {
          customHeaders: true,
          'Accept-Company': company_uuid,
          'recipient-token': token,
          'Accept-Account': account_uuid,
          Authorization: null,
        } || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateBuilderFormRecipientUser = async (
  state,
  { company_uuid } = {},
) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/submit`,
    state,
    {
      headers:
        (company_uuid && {
          'Accept-Company': company_uuid,
        })
        || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const FormDownLoadPDFUser = async ({ body }) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${
      process.env.REACT_APP_VERSION_API_V2
    }/form/download/pdf?timezone=${
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

export const FormDownLoadPDFRecipient = async ({
  body,
  company_uuid,
  token,
  account_uuid,
}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${
      process.env.REACT_APP_VERSION_API_V2
    }/form/recipient/download/pdf?timezone=${
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

export const VerifyBuilderFormKey = async ({ key, from_side }) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/validation`,
    {
      key,
      from_side,
    },
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

export const CreateBuilderTemplate = async (state) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/template`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateBuilderTemplate = async (state) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/template`,
    state,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteForm = async (body) => {
  const result = await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const SendFormV2Reminder = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/reminder`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CloneTemplate = async (body) =>
  HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/formbuilder/${process.env.REACT_APP_VERSION_API}/template/clone`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

import { HttpServices } from '../helpers';

export const AuthenticateUser = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/oauth/authorize`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// updated
export const GenerateNylasToken = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/oauth/token`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// This will delete the account on Nylas
export const DeleteAccount = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/account/delete`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetNylasUserDetails = async ({ user_uuid }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/user/details`,
    {
      params: {
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllNylasEvents = async ({
  user_uuid, // required
  access_token, // required
  calendar_id,
  limit,
  offset,
  starts_before,
  starts_after,
  ends_before,
  ends_after,
}) => {
  console.log('testinggg');
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/events`,
    {
      params: {
        user_uuid,
        access_token,
        calendar_id,
        limit,
        offset,
        starts_before,
        starts_after,
        ends_before,
        ends_after,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CancelNylasAccount = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/account/revoke`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ReactivateNylasAccount = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/account/re-authenticate`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllCandidateEmails = async ({
  user_uuid,
  candidate_uuid,
  email,
  job_uuid,
  limit = 10,
  page = 1,
  query = 0,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/candidate/mailbox`,
    {
      params: {
        user_uuid,
        candidate_uuid,
        email,
        job_uuid,
        limit,
        page,
        query,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllEmails = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/all_threads`,
    {
      params: {
        user_uuid: params.user_uuid,
        ...params,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllFolders = async (params) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/all_folders`,
    {
      params: {
        user_uuid: params.user_uuid,
        ...params,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetExpandedThread = async ({ user_uuid, access_token, thread_id }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/expanded_messages`,
    {
      params: {
        user_uuid,
        access_token,
        thread_id,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SendEmail = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/send_message`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ReplyToEmail = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/message/reply`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateEmail = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/message`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateThread = async (body) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/thread`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UploadNylasFile = async ({
  upload_file,
  user_uuid,
  access_token,
  is_candidate,
}) => {
  const formData = new FormData();
  formData.append('upload_file', upload_file);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/files`,
    formData,
    {
      params: {
        user_uuid,
        access_token,
        is_candidate,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const SyncCandidateEmails = async ({
  user_uuid,
  access_token,
  candidate_uuid,
  job_uuid,
  candidate_email,
  limit,
  page,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/messages`,
    {
      params: {
        user_uuid,
        access_token,
        candidate_uuid,
        job_uuid,
        candidate_email,
        limit,
        page,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UploadSignature = async ({ user_uuid, file_id }) => {
  // const formData = new FormData();
  // formData.append('upload_file', upload_file);
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/upload_signature`,
    {
      user_uuid,
      file_id,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateDraft = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/drafts`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDrafts = async ({ user_uuid, access_token, email }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/drafts`,
    {
      params: {
        user_uuid,
        access_token,
        email,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetNylasFile = async ({
  user_uuid,
  access_token,
  file_id,
  is_candidate,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/files/download`,
    {
      params: {
        user_uuid,
        access_token,
        file_id,
        is_candidate,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AddOpenHours = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/calendars/open-hours`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// Updated
export const GetAvailability = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/calendars/availability`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CheckUserEmail = async ({ user_uuid, email }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/user/connected`,
    {
      params: {
        user_uuid,
        email,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOpenHours = async ({ user_uuid, users }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/user/open-hours?${users
      .map((user) => `users=${user}`)
      .join('&')}`,
    {
      params: {
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// Updated
export const CreateNylasEvent = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/event`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllCalendars = async ({ user_uuid, access_token }) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_API_NYLAS_BASE_URL}/calendars`,
    {
      params: {
        user_uuid,
        access_token,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

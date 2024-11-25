import { HttpServices } from '../helpers';

const PROVIDERBASEURL = `${process.env.REACT_APP_API_PROVIDER_BASE_URL}`;

export const GetAllSetupsProviders = async ({
  limit,
  page,
  use_for = 'dropdown',
  type,
  order_by,
  order_type,
  search,
  with_than,
  // other_than,
  job_uuid,
}) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/providers`, {
    params: {
      limit,
      page,
      use_for,
      type,
      order_by,
      order_type,
      query: search,
      with_than,
      job_uuid,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsProvidersById = async ({ provider_uuid }) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/provider`, {
    params: { provider_uuid },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// export const GetSetupsProvidersTotal = async (body) => {
// const result = await HttpServices.post(
//   `${PROVIDERBASEURL}/api/${VERSION}/team/total/provider`,
//   body,
// )
//   .then((data) => data)
//   .catch((error) => error.response);
// return result;
// };

export const InviteSetupsProviders = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/invite_provider`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsProviders = async (body) => {
  const result = await HttpServices.put(`${PROVIDERBASEURL}/provider`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsProvider = async (params) => {
  const result = await HttpServices.delete(`${PROVIDERBASEURL}/provider`, {
    data: params,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VerifyProviderKey = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/verify_key`, body, {
    headers: {
      isPublic: true,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ProviderSetPasswordService = async ({ data, headers }) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/setpassword`, data, {
    headers,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ProviderLoginService = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/login`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllProviderInvitations = async ({ invitation_status }) => {
  const result = await HttpServices.get(
    `${PROVIDERBASEURL}/provider/all_invitations`,
    {
      params: {
        invitation_status,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetProviderInvitationDetails = async ({ uuid, account_uuid }) => {
  const result = await HttpServices.get(
    `${PROVIDERBASEURL}/provider/view_invitation`,
    {
      params: {
        uuid,
        account_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AcceptProviderInvitation = async (body) => {
  const result = await HttpServices.post(
    `${PROVIDERBASEURL}/provider/accept_invitation`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

/* Provider members */

export const GetAllProviderMembers = async ({
  limit,
  page,
  use_for = 'dropdown',
  order_by,
  order_type,
  // search,
  // with_than,
  // other_than,
}) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/members`, {
    params: {
      limit,
      page,
      use_for,
      order_by,
      order_type,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getProviderMemberById = async ({ member_uuid }) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/member`, {
    params: { member_uuid },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const InviteProviderMember = async (body) => {
  const result = await HttpServices.post(
    `${PROVIDERBASEURL}/provider/invite_members`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateProviderMember = async (body) => {
  const result = await HttpServices.put(`${PROVIDERBASEURL}/member`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteProviderMember = async (params) => {
  const result = await HttpServices.delete(`${PROVIDERBASEURL}/member`, {
    data: params,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetProviderProfile = async (params) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/profile`, {
    params,
    headers: { 'Accept-Company': 'no-company' },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GrantProviderMemberBranchAccess = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/grant_access`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RevokeProviderMemberBranchAccess = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/revoke_access`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// Dropdowns

export const GetAllProviderBranches = async ({
  account_uuid,
  member_uuid,
  is_member,
}) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/provider/branches`, {
    headers: {
      ...(account_uuid && {
        'Accept-Account': account_uuid,
      }),
    },
    params: {
      member_uuid,
      is_member,
      account_uuid,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllProviderAccounts = async () => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/provider/companies`)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllProviderJobs = async ({ account_uuid, branch_uuid }) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/assigned_jobs`, {
    params: {
      branch_uuid,
    },
    headers: {
      ...(account_uuid && {
        'Accept-Account': account_uuid,
      }),
    },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// search DB

export const SearchDBForProvider = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/candidate/search`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetProviderBranchesRating = async ({
  provider_uuid,
  provider_type,
}) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/branch/rating`, {
    params: { provider_uuid, provider_type },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetProviderBrancheJobsRating = async ({
  provider_uuid,
  provider_type,
  branch_uuid,
}) => {
  const result = await HttpServices.get(`${PROVIDERBASEURL}/jobs/rating`, {
    params: { provider_uuid, provider_type, branch_uuid },
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const RateSetupsProvider = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/account/rating`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllJobsByBranch = async ({
  limit,
  page,
  query,
  with_than,
  other_than,
  company_uuid,
  category,
}) => {
  const queryList = [];
  if (query) queryList.push(`query=${query}`);
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/ats/${
      process.env.REACT_APP_VERSION_API
    }/job/dropdown?${queryList.join('&')}`,
    {
      params: {
        with_than,
        other_than,
        category,
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

export const AssignJobToProviders = async (body) => {
  const result = await HttpServices.post(`${PROVIDERBASEURL}/assign_jobs`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

import { HttpServices } from '../helpers';

export const CreateOnboardingInvite = async ({
  invited_members,
  flow_uuid,
  folder_uuid,
  job_uuid,
  space_uuid,
  join_date,
  start_date,
  message,
  attachments_email,
  body_email,
  email_language_id,
  email_template_uuid,
  subject_email,
  onboarding_teams,
  is_update,
}) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members/invite`,
    {
      invited_members,
      flow_uuid,
      folder_uuid,
      space_uuid,
      join_date,
      start_date,
      message,
      attachments_email,
      body_email,
      email_language_id,
      email_template_uuid,
      subject_email,
      onboarding_teams,
      job_uuid,
      is_update,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOnboardingInvitations = async ({ email, company_uuid } = {}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/member-directory`,
    {
      params: {
        email,
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

export const GetOnboardingInvitationsRecipient = async ({
  email,
  company_uuid,
  token,
  account_uuid,
} = {}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/member-directory`,
    {
      params: {
        email,
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
export const GetInitialJobOnboardingTeam = async ({
  limit,
  page,
  search,
  company_uuid,
  job_requisition_uuid,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/other-users`,
    {
      params: {
        job_requisition_uuid,
        limit,
        page,
        search,
        company_uuid,
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

export const GetOnboardingInvitationsCandidate = async ({
  job_candidate_uuid,
} = {}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members/invitation/details`,
    {
      params: {
        job_candidate_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DropCandidateOnboardingInvitation = async (body) => {
  const result = await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/onboarding/${process.env.REACT_APP_VERSION_API}/members/invitation/drop`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

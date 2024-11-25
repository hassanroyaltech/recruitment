import { HttpServices } from '../helpers';

export const GetAllIntegrationsConnections = async ({
  page,
  limit,
  search,
  user_uuid,
  return_images,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/partners`,
    {
      params: {
        page,
        limit,
        search,
        user_uuid,
        return_images,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetIntegrationsForPartner = async ({ partner }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/partner/${partner}`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetCandidatePushToJisrDetails = async ({ job_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/jisr/candidate/${job_candidate_uuid}`,
    // {
    //   params: {
    //     job_candidate_uuid,
    //   },
    // }
  )
    .then((data) => data)
    .catch((error) => error.response);

export const PushToJisrData = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/jisr/employees`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

// export const GetIntegrationsForGoogle = async ({ url }) => {
//   return await HttpServices.get(
//     `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google/index_url`,
//     {
//       params: {
//         url,
//       },
//     }
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
// };

export const CreateIntegrationsForGoogle = async ({ enabled }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google/index_url`,
    {
      enabled,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
// Start For testlify integrations
export const UpdateIntegrationsForTestlify = async ({
  enabled,
  phone_number,
  country_code,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/testlify/configure`,
    {
      enabled,
      phone_number,
      country_code,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateIntegrationsForGoogle = async ({ enabled }) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google/configure`,
    {
      enabled,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetIntegrationsForGoogleAnalytics = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google-analytics/configure`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetEventsForGoogleAnalytics = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google-analytics/events`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateIntegrationsForGoogleAnalytics = async ({
  enabled,
  track_id,
  events,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google-analytics/configure`,
    {
      enabled,
      track_id,
      events,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateIntegrationsForGoogleAnalytics = async ({
  enabled,
  track_id,
  events,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/google-analytics/configure`,
    {
      enabled,
      track_id,
      events,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateIntegrationsForJisr = async ({
  enabled,
  slug,
  api_key,
  has_company_level_config,
  company_level_config,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/jisr/registration`,
    {
      enabled,
      slug,
      api_key,
      has_company_level_config,
      company_level_config,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateIntegrationsForJisr = async ({
  enabled,
  slug,
  api_key,
  has_company_level_config,
  company_level_config,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/jisr/registration`,
    {
      enabled,
      slug,
      api_key,
      has_company_level_config,
      company_level_config,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SyncIntegrationsForJisr = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/jisr/sync-lookups`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const RevokeIntegrationsForJisr = async ({
  configuration_level,
  company_uuid,
}) => {
  const queryList = [];
  if (configuration_level)
    queryList.push(`configuration_level=${configuration_level}`);
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  return await HttpServices.post(
    `${
      process.env.REACT_APP_INTEGRATIONS_API
    }/integrations/jisr/revoke-api-key?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const VerifyIntegrationsForJisr = async ({
  configuration_level,
  company_uuid,
  slug,
  api_key,
}) =>
  await HttpServices.request({
    url: `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/jisr/update-api-key`,
    method: 'PATCH',
    data: {
      configuration_level,
      company_uuid,
      slug,
      api_key,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);

// export const GetIntegrationsForTalent = async () => {
//   return await HttpServices.get(
//     `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/talent/create_jobs_xml`
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
// };

export const UpdateIntegrationsForTalent = async ({ enabled }) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/talent/configure`,
    {
      enabled,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

// =========== integration for vonq
export const IntegrationsGenerateVonqToken = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/vonq/generate-token`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationsGenerateVonqTokenV2 = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/generate-token`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllMyContracts = async ({ offset, limit, page }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/campaign/${process.env.REACT_APP_VERSION_API_V2}/contract`,
    {
      params: {
        page,
        limit,
        offset,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

// export const CreateIntegrationsForOracle = async ({
//   hcm_instance_url,
//   hcm_username,
//   hcm_password,
//   slug,
//   has_company_level_config,
//   company_level_config,
// }) => {
//   return await HttpServices.post(
//     `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/configure`,
//     {
//       hcm_instance_url,
//       hcm_username,
//       hcm_password,
//       slug,
//       has_company_level_config,
//       company_level_config,
//     }
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
// };

// ==== Start For Deel Integration

export const UpdateIntegrationsForDeel = async ({
  enabled,
  has_company_level_config,
  company_level_config,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/configure`,
    {
      enabled,
      has_company_level_config,
      company_level_config,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetRedirectURIForDeel = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/redirect-uri`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationConnectForDeel = async ({ code, state }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/deel_token`,
    null,
    {
      params: {
        code,
        state,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const SyncIntegrationsForDeel = async () =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/sync-lookup`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetCandidatePushToDeelDetails = async ({ job_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/candidate/${job_candidate_uuid}`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreatePushToDeel = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/add-candidate`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdatePushToDeel = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/deel/update-candidate`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

// ================================================================= start PHP integrations

export const GetAllIntegrationsConnectionsPHP = async ({
  // page, limit,
  search,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/providers`,
    {
      params: {
        // page,
        // limit,
        search,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
// ======= Sap APIs
export const GetIntegrationsForSap = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/config`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateIntegrationsForSap = async ({
  application_name,
  developer_name,
  developer_email,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/sap/connect`,
    {
      application_name,
      developer_name,
      developer_email,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateIntegrationsForSap = async ({
  application_name,
  developer_name,
  developer_email,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/sap/credential/update`,
    {
      application_name,
      developer_name,
      developer_email,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationDisconnectForSap = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/disconnect`,
  )
    .then((data) => data)
    .catch((error) => error.response);

// export const IntegrationRegenerateAPIKeyForSAP = async () => {
//   return await HttpServices.get(
//     `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/api-key/regenerate`
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
// };

export const IntegrationRegenerateAPISecretForSAP = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/api-secret/regenerate`,
  )
    .then((data) => data)
    .catch((error) => error.response);

// ======= Sap APIs === Events
export const GetAllIntegrationSAPEvents = async () =>
  // {
  // page,
  // limit,
  // use_for = 'dropdown',
  // status = true,
  // search,
  // }
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/events`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationSAPEventManagement = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/sap/events/save`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetIntegrationSAPEventKey = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/events/list`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const DeleteIntegrationSAPEvents = async ({ uuid }) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/sap/events/${uuid}/delete`,
  )
    .then((data) => data)
    .catch((error) => error.response);

// ======= Sap APIs === Logs
export const GetAllIntegrationSAPLogs = async ({
  page,
  limit,
  use_for = 'dropdown',
  status = true,
  search,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/sap/logs`,
    {
      params: {
        page,
        limit,
        use_for,
        status,
        search,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

// ======= Sap APIs === Clients
export const UpdateIntegrationsForSapClient = async ({
  url,
  user_name,
  password,
  company_id,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/sap/client-details/save`,
    {
      url,
      user_name,
      password,
      company_id,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
// ======= Google Meeting APIs
export const GetRedirectURIGoogleMeeting = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/meet/redirect-uri`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationConnectForGoogleMeeting = async ({ code }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/meet/connect`,
    {
      code,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationDisconnectForGoogleMeeting = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/meet/disconnect`,
  )
    .then((data) => data)
    .catch((error) => error.response);

// ======= Zoom APIs

export const GetIntegrationsForZoom = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/zoom/config`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdateIntegrationsForZoom = async ({
  auto_recording,
  registrants_email_notification,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/zoom/config`,
    {
      auto_recording,
      registrants_email_notification,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetRedirectURIZoom = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/zoom/redirect-uri`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationConnectForZoom = async ({ code }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_DOMIN_PHP_API}/api/${process.env.REACT_APP_VERSION_API}/zoom/connect`,
    {
      code,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationDisconnectForZoom = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/zoom/disconnect`,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GetRedirectURIForMSTeams = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/redirect-uri`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationConnectForMSTeams = async ({ code, state, user_uuid }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/teams-token`,
    null,
    {
      params: {
        code,
        state,
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetMSTeamsMeetingProviders = async ({ user_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/meeting-providers`,
    {
      params: {
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const IntegrationDisconnectForMSTeams = async ({ user_uuid }) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/revoke-integration`,
    {
      params: {
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const MSTeamsScheduleInterview = async ({ body, user_uuid }) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/schedule-meeting?user_uuid=${user_uuid}`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllMSTeamsMeetings = async (is_upcoming, page, limit, user_uuid) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/get-meeting-data`,
    {
      params: {
        page,
        limit,
        is_upcoming,
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const CancelMSTeamsMeeting = async (meeting_uuid, user_uuid) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/cancel-meeting`,
    {
      params: {
        meeting_uuid,
        user_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const MSTeamsViewScheduleInterview = async ({
  user_uuid,
  meeting_uuid,
  is_upcoming,
  from_time,
  to_time,
  page,
  limit = 50,
}) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/get-meeting-data`,
    {
      params: {
        meeting_uuid,
        user_uuid,
        page,
        limit,
        is_upcoming,
        from_time,
        to_time,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const MSTeamsUpdateInterview = async ({ body, user_uuid, meeting_uuid }) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/update-meeting?user_uuid=${user_uuid}&meeting_uuid=${meeting_uuid}`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const MSTeamsDeleteEvent = async ({ user_uuid, meeting_uuid }) =>
  await HttpServices.delete(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/teams/cancel-meeting`,
    {
      params: {
        user_uuid,
        meeting_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreateIntegrationsFoHCM = async ({
  hcm_instance_url,
  hcm_username,
  hcm_password,
  slug,
  has_company_level_config,
  company_level_config,
  enabled,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/configure`,
    {
      hcm_instance_url,
      hcm_username,
      hcm_password,
      slug,
      has_company_level_config,
      company_level_config,
      enabled,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateIntegrationsFoHCM = async ({
  hcm_instance_url,
  hcm_username,
  hcm_password,
  slug,
  has_company_level_config,
  company_level_config,
  enabled,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/configure`,
    {
      hcm_instance_url,
      hcm_username,
      hcm_password,
      slug,
      has_company_level_config,
      company_level_config,
      enabled,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const SyncIntegrationsForHCM = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/sync-lookup`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const PushToHCMData = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/employee`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const RevokeIntegrationsForHCM = async ({
  configuration_level,
  company_uuid,
}) => {
  const queryList = [];
  if (configuration_level)
    queryList.push(`configuration_level=${configuration_level}`);
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  return await HttpServices.delete(
    `${
      process.env.REACT_APP_INTEGRATIONS_API
    }/integrations/oracle/revoke-integration?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
};
export const GetCandidatePushToHCMDetails = async ({ job_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/candidate/${job_candidate_uuid}`,
    // {
    //   params: {
    //     job_candidate_uuid,
    //   },
    // }
  )
    .then((data) => data)
    .catch((error) => error.response);
export const CreateIntegrationsForMicrosoftAzure = async ({
  tenant_id,
  secret_value,
  client_id,
  domain,
  enabled,
  is_attribute_enabled,
  attribute_value,
  attribute_key,
  sync_schedule,
  is_sync_enabled,
  has_company_level_config,
  company_level_config,
  is_sso_branch_level,
  branch_group_config,
  re_sync_all_users,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/azure/registration`,
    {
      tenant_id,
      secret_value,
      client_id,
      domain,
      enabled,
      is_attribute_enabled,
      attribute_value,
      attribute_key,
      sync_schedule,
      is_sync_enabled,
      has_company_level_config,
      company_level_config,
      is_sso_branch_level,
      branch_group_config,
      re_sync_all_users,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateIntegrationsForMicrosoftAzure = async ({
  tenant_id,
  secret_value,
  client_id,
  domain,
  enabled,
  is_attribute_enabled,
  attribute_value,
  attribute_key,
  default_attribute_value,
  excluded_emails,
  sync_schedule,
  is_sync_enabled,
  has_company_level_config,
  company_level_config,
  is_sso_branch_level,
  branch_group_config,
  re_sync_all_users,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/azure/registration`,
    {
      tenant_id,
      secret_value,
      client_id,
      domain,
      enabled,
      is_attribute_enabled,
      default_attribute_value,
      attribute_value,
      attribute_key,
      excluded_emails,
      sync_schedule,
      is_sync_enabled,
      has_company_level_config,
      company_level_config,
      is_sso_branch_level,
      branch_group_config,
      re_sync_all_users,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GetIntegrationsForMicrosoftAzure = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/azure/registration`,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const RevokeIntegrationsForMicrosoftAzure = async ({
  configuration_level,
  company_uuid,
}) => {
  const queryList = [];
  if (configuration_level)
    queryList.push(`configuration_level=${configuration_level}`);
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  return await HttpServices.delete(
    `${
      process.env.REACT_APP_INTEGRATIONS_API
    }/integrations/azure/registration?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
};
export const SyncUsersForMicrosoftAzure = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/azure/sync-users`,
  )
    .then((data) => data)
    .catch((error) => error.response);

// Start for Oracle Integrations APIs
export const CreateIntegrationsForOracleSSO = async ({
  tenant_id,
  secret_value,
  client_id,
  domain,
  enabled,
  has_company_level_config,
  company_level_config,
}) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/registration`,
    {
      tenant_id,
      secret_value,
      client_id,
      domain,
      enabled,
      has_company_level_config,
      company_level_config,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const UpdateIntegrationsForOracleSSO = async ({
  tenant_id,
  secret_value,
  client_id,
  domain,
  enabled,
  has_company_level_config,
  company_level_config,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/registration`,
    {
      tenant_id,
      secret_value,
      client_id,
      domain,
      enabled,
      has_company_level_config,
      company_level_config,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
export const GetIntegrationsForOracleSSO = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/registration`,
  )
    .then((data) => data)
    .catch((error) => error.response);
export const RevokeIntegrationsForOracleSSO = async ({
  configuration_level,
  company_uuid,
}) => {
  const queryList = [];
  if (configuration_level)
    queryList.push(`configuration_level=${configuration_level}`);
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  return await HttpServices.delete(
    `${
      process.env.REACT_APP_INTEGRATIONS_API
    }/integrations/oracle/registration?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
};
// export const SyncUsersForOracleSSO = async () =>
//   await HttpServices.get(
//     `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/oracle/sync-users`,
//   )
//     .then((data) => data)
//     .catch((error) => error.response);

export const UpdateIntegrationsForUpsideLMS = async ({
  enabled,
  has_company_level_config = false,
  company_level_config = [],
  upside_client_key,
  context_path,
  upside_auth_url,
  upside_manage_user_url,
}) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/upside/configure`,
    {
      enabled,
      has_company_level_config,
      company_level_config,
      upside_client_key,
      context_path,
      upside_auth_url,
      upside_manage_user_url,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const RevokeIntegrationsForUpsideLMS = async ({
  configuration_level,
  company_uuid,
}) => {
  const queryList = [];
  if (configuration_level)
    queryList.push(`configuration_level=${configuration_level}`);
  if (company_uuid) queryList.push(`company_uuid=${company_uuid}`);
  return await HttpServices.delete(
    `${
      process.env.REACT_APP_INTEGRATIONS_API
    }/integrations/upside/revoke-integration?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const GetCandidatePushToUpsideDetails = async ({ job_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/upside/view-user/${job_candidate_uuid}`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetUpsideLMSDropdowns = async ({ slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/upside/dropdown`,
    {
      params: {
        slug,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const CreatePushToUpsideLMS = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/upside/add-user`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const UpdatePushToUpsideLMS = async (body) =>
  await HttpServices.put(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/upside/update-user`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetIntegrationsForUpsideLMS = async () =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/upside/configure`,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const BinzagerSapAddEmployee = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/binzagr/sap/employee`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);

export const BinzagerSapGetEmployee = async ({ job_candidate_uuid }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/binzagr/sap/employee`,
    {
      params: {
        job_candidate_uuid,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const BinzagerSapGetDropdown = async ({ slug, group_code, query }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_INTEGRATIONS_API}/integrations/binzagr/sap/dropdown`,
    {
      params: {
        slug,
        group_code,
        query,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

import { lazy } from 'react';
import {
  CreateIntegrationsFoHCM,
  // CreateIntegrationsForGoogle,
  CreateIntegrationsForGoogleAnalytics,
  CreateIntegrationsForJisr,
  CreateIntegrationsForMicrosoftAzure,
  CreateIntegrationsForSap,
  CreatePushToDeel,
  GetCandidatePushToDeelDetails,
  GetCandidatePushToHCMDetails,
  GetCandidatePushToJisrDetails,
  GetIntegrationsForGoogleAnalytics,
  GetIntegrationsForMicrosoftAzure,
  GetEventsForGoogleAnalytics,
  GetIntegrationsForPartner,
  GetIntegrationsForSap,
  GetRedirectURIForDeel,
  GetRedirectURIForMSTeams,
  GetRedirectURIGoogleMeeting,
  GetRedirectURIZoom,
  IntegrationConnectForDeel,
  IntegrationConnectForGoogleMeeting,
  IntegrationConnectForMSTeams,
  IntegrationConnectForZoom,
  IntegrationDisconnectForGoogleMeeting,
  IntegrationDisconnectForMSTeams,
  IntegrationDisconnectForSap,
  IntegrationDisconnectForZoom,
  // IntegrationRegenerateAPIKeyForSAP,
  IntegrationRegenerateAPISecretForSAP,
  PushToHCMData,
  PushToJisrData,
  RevokeIntegrationsForHCM,
  RevokeIntegrationsForJisr,
  RevokeIntegrationsForMicrosoftAzure,
  SyncIntegrationsForDeel,
  SyncIntegrationsForHCM,
  SyncIntegrationsForJisr,
  UpdateIntegrationsFoHCM,
  UpdateIntegrationsForDeel,
  UpdateIntegrationsForGoogle,
  UpdateIntegrationsForGoogleAnalytics,
  UpdateIntegrationsForJisr,
  UpdateIntegrationsForMicrosoftAzure,
  UpdateIntegrationsForSap,
  UpdateIntegrationsForTalent,
  UpdatePushToDeel,
  VerifyIntegrationsForJisr,
  SyncUsersForMicrosoftAzure,
  UpdateIntegrationsForUpsideLMS,
  RevokeIntegrationsForUpsideLMS,
  GetCandidatePushToUpsideDetails,
  CreatePushToUpsideLMS,
  UpdatePushToUpsideLMS,
  UpdateIntegrationsForTestlify,
  GetIntegrationsForUpsideLMS,
  CreateIntegrationsForOracleSSO,
  UpdateIntegrationsForOracleSSO,
  GetIntegrationsForOracleSSO,
  RevokeIntegrationsForOracleSSO
} from '../../services';
import {
  IntegrationSettingsSAPTabsData,
  IntegrationSettingsZoomTabsData,
} from '../../pages/integrations/dialogs/active-integrations-settings/tabs-data';
const ActiveIntegrationsSettingsDialog = lazy(() =>
  import(
    '../../pages/integrations/dialogs/active-integrations-settings/ActiveIntegrationsSettings.Dialog'
  ),
);

export const IntegrationsPartnersEnum = {
  Google: {
    key: 'google',
    value: 'google',
    enableTitle: 'enable-google-title-description',
    description: 'google-description-description',
    createConnectAPI: UpdateIntegrationsForGoogle,
    updateConnectAPI: UpdateIntegrationsForGoogle,
    getConnectAPI: GetIntegrationsForPartner,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: false,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
      // {
      //   key: 'revoke',
      //   isAccountLevel: false,
      // },
    ],
  },
  Testlify: {
    key: 'testlify',
    value: 'testlify',
    enableTitle: 'enable-testlify-title-description',
    description: 'testlify-description-description',
    createConnectAPI: UpdateIntegrationsForTestlify,
    updateConnectAPI: UpdateIntegrationsForTestlify,
    getConnectAPI: GetIntegrationsForPartner,
    keys: [
      {
        key: 'phone_number',
        isAccountLevel: true,
      },
      {
        key: 'enabled',
        isAccountLevel: true,
      },
    ],
  },
  GoogleAnalytics: {
    key: 'google_analytics',
    value: 'google-analytics',
    enableTitle: 'enable-google-analytics-title-description',
    description: 'google-analytics-description-description',
    createConnectAPI: CreateIntegrationsForGoogleAnalytics,
    updateConnectAPI: UpdateIntegrationsForGoogleAnalytics,
    getConnectAPI: GetIntegrationsForGoogleAnalytics,
    getHelperApi: GetEventsForGoogleAnalytics,
    getAPIPath: 'result.google_analytics',
    helperDataKey: 'events',
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'track_id',
        isAccountLevel: true,
      },
      {
        key: 'events',
        isAccountLevel: true,
        isFromHelper: true,
      },
    ],
  },
  Jisr: {
    key: 'jisr',
    value: 'jisr',
    enableTitle: 'enable-jisr-title-description',
    description: 'jisr-description-description',
    apiKeyDescription: 'jisr-api-key-description',
    createConnectAPI: CreateIntegrationsForJisr,
    updateConnectAPI: UpdateIntegrationsForJisr,
    getConnectAPI: GetIntegrationsForPartner,
    syncConnectAPI: SyncIntegrationsForJisr,
    revokeConnectAPI: RevokeIntegrationsForJisr,
    verifyConnectAPI: VerifyIntegrationsForJisr,
    createPushDataAPI: PushToJisrData,
    getPushDataAPI: GetCandidatePushToJisrDetails,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'slug',
        isAccountLevel: true,
      },
      {
        key: 'api_key',
        isAccountLevel: true,
      },
      {
        key: 'revoke_api_key',
        isAccountLevel: true,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: true,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'slug',
        isAccountLevel: false,
      },
      {
        key: 'api_key',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
      {
        key: 'revoke_api_key',
        isAccountLevel: false,
      },
    ],
    pushToPartnerKeys: [
      {
        key: 'code',
        isAccountLevel: true,
        isPrimary: true, // used to recognize if its edit or not and its always have value on edit
      },
      {
        key: 'full_name_en',
        isAccountLevel: true,
      },
      {
        key: 'full_name_ar',
        isAccountLevel: true,
      },
      {
        key: 'department_id',
        isAccountLevel: true,
      },
      {
        key: 'employment_type_id',
        isAccountLevel: true,
      },
      {
        key: 'location_id',
        isAccountLevel: true,
      },
      {
        key: 'joining_date',
        isAccountLevel: true,
      },
      {
        key: 'outsourcing_company_id',
        isAccountLevel: true,
      },
      {
        key: 'email',
        isAccountLevel: true,
      },
      {
        key: 'gender',
        isAccountLevel: true,
      },
      {
        key: 'marital_status',
        isAccountLevel: true,
      },
      {
        key: 'document_number',
        isAccountLevel: true,
      },
      {
        key: 'nationality_id',
        isAccountLevel: true,
      },
      {
        key: 'contract_type',
        isAccountLevel: true,
      },
      {
        key: 'contract_period',
        isAccountLevel: true,
      },
      {
        key: 'end_date',
        isAccountLevel: true,
      },
    ],
  },
  Talent: {
    key: 'talent',
    value: 'talent',
    enableTitle: 'enable-talent-title-description',
    description: 'talent-description-description',
    createConnectAPI: UpdateIntegrationsForTalent,
    updateConnectAPI: UpdateIntegrationsForTalent,
    getConnectAPI: GetIntegrationsForPartner,
    // revokeConnectAPI: RevokeIntegrationsForJisr,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: false,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
    ],
  },
  OracleHCM: {
    key: 'oracle',
    value: 'oracle',
    enableTitle: 'enable-oracle-hcm-title-description',
    description: 'oracle-hcm-description-description',
    // disabled: true,
    createConnectAPI: CreateIntegrationsFoHCM,
    updateConnectAPI: UpdateIntegrationsFoHCM,
    getConnectAPI: GetIntegrationsForPartner,
    revokeConnectAPI: RevokeIntegrationsForHCM,
    syncConnectAPI: SyncIntegrationsForHCM,
    createPushDataAPI: PushToHCMData,
    updatePushDataAPI: PushToHCMData,
    getPushDataAPI: GetCandidatePushToHCMDetails,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'hcm_instance_url',
        isAccountLevel: true,
      },
      {
        key: 'slug',
        isAccountLevel: true,
      },
      {
        key: 'hcm_username',
        isAccountLevel: true,
      },
      {
        key: 'hcm_password',
        isAccountLevel: true,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: true,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'slug',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
      {
        key: 'hcm_instance_url',
        isAccountLevel: false,
      },
      {
        key: 'hcm_username',
        isAccountLevel: false,
      },
      {
        key: 'hcm_password',
        isAccountLevel: false,
      },
      {
        key: 'revoke_api_key',
        isAccountLevel: false,
      },
      {
        key: 'revoke_api_key',
        isAccountLevel: true,
      },
    ],
    pushToPartnerKeys: [
      {
        key: 'legal_entity_id',
        isAccountLevel: true,
      },
      {
        key: 'first_name',
        isAccountLevel: true,
      },
      {
        key: 'middle_name',
        isAccountLevel: true,
      },
      {
        key: 'last_name',
        isAccountLevel: true,
      },
      {
        key: 'display_name',
        isAccountLevel: true,
      },
      {
        key: 'national_id_expiration_date',
        isAccountLevel: true,
      },
      {
        key: 'work_email',
        isAccountLevel: true,
      },
      {
        key: 'address_line',
        isAccountLevel: true,
      },
      {
        key: 'region',
        isAccountLevel: true,
      },
      {
        key: 'country',
        isAccountLevel: true,
        // Special case for Oracle HCM
        isRequired: true,
      },
      {
        key: 'postal_code',
        isAccountLevel: true,
      },
      {
        key: 'date_of_birth',
        isAccountLevel: true,
      },
      {
        key: 'gender',
        isAccountLevel: true,
      },
      {
        key: 'national_id_country',
        isAccountLevel: true,
      },
      {
        key: 'national_id',
        isAccountLevel: true,
      },
      {
        key: 'national_id_type',
        isAccountLevel: true,
      },
      {
        key: 'user_name',
        isAccountLevel: true,
      },
      {
        key: 'assignment_name',
        isAccountLevel: true,
      },
      {
        key: 'business_unit_id',
        isAccountLevel: true,
        isPrimary: true,
      },
    ],
  },
  Sap: {
    key: 'sap',
    value: 'sap',
    // enableTitle: 'enable-talent-title-description',
    description: 'sap-description-description',
    createConnectAPI: CreateIntegrationsForSap,
    updateConnectAPI: UpdateIntegrationsForSap,
    getConnectAPI: GetIntegrationsForSap,
    getAPIPath: 'results.credential',
    onlyCallGetIfConnected: true,
    disconnectAPI: IntegrationDisconnectForSap,
    disconnectDescription: 'sap-disconnect-description',
    settingsManagementDialog: ActiveIntegrationsSettingsDialog,
    settingsManagementTabsData: IntegrationSettingsSAPTabsData,
    // revokeConnectAPI: RevokeIntegrationsForJisr,
    keys: [
      {
        key: 'application_name',
        isAccountLevel: true,
      },
      {
        key: 'developer_name',
        isAccountLevel: true,
      },
      {
        key: 'developer_email',
        isAccountLevel: true,
      },
      {
        key: 'api_key',
        isAccountLevel: true,
        isOnlyVisibleOnEdit: true,
        isDisabled: true,
        // regenerateAPI: IntegrationRegenerateAPIKeyForSAP,
        // regenerateAPISuccessMessage: 'api-key-regenerated-successfully',
        // regenerateAPIFailedMessage: 'api-key-regenerate-failed',
      },
      {
        key: 'api_secret',
        isAccountLevel: true,
        isOnlyVisibleOnEdit: true,
        isDisabled: true,
        regenerateAPI: IntegrationRegenerateAPISecretForSAP,
        regenerateAPISuccessMessage: 'api-secret-regenerated-successfully',
        regenerateAPIFailedMessage: 'api-secret-regenerate-failed',
      },
    ],
  },
  GoogleMeeting: {
    key: 'meet',
    value: 'meet',
    getRedirectURIAPI: GetRedirectURIGoogleMeeting,
    disconnectAPI: IntegrationDisconnectForGoogleMeeting,
    connectAPI: IntegrationConnectForGoogleMeeting,
    disconnectDescription: 'google-meet-disconnect-description',
  },
  Zoom: {
    key: 'zoom',
    value: 'zoom',
    getRedirectURIAPI: GetRedirectURIZoom,
    disconnectAPI: IntegrationDisconnectForZoom,
    connectAPI: IntegrationConnectForZoom,
    disconnectDescription: 'zoom-disconnect-description',
    settingsManagementDialog: ActiveIntegrationsSettingsDialog,
    settingsManagementTabsData: IntegrationSettingsZoomTabsData,
  },
  Deel: {
    key: 'deel',
    value: 'deel',
    enableTitle: 'enable-deel-title-description',
    description: 'deel-description-description',
    createConnectAPI: UpdateIntegrationsForDeel,
    updateConnectAPI: UpdateIntegrationsForDeel,
    getConnectAPI: GetIntegrationsForPartner,
    getInnerRedirectURIAPI: GetRedirectURIForDeel, // this executed after configuration successfully saved
    syncConnectAfterRedirectAPI: SyncIntegrationsForDeel,
    connectAPI: IntegrationConnectForDeel,
    createPushDataAPI: CreatePushToDeel,
    updatePushDataAPI: UpdatePushToDeel,
    getPushDataAPI: GetCandidatePushToDeelDetails,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: true,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
    ],
    pushToPartnerKeys: [
      {
        key: 'status',
        isAccountLevel: true,
        isPrimary: true,
      },
      {
        key: 'first_name',
        isAccountLevel: true,
      },
      {
        key: 'last_name',
        isAccountLevel: true,
      },
      {
        key: 'start_date',
        isAccountLevel: true,
      },
      {
        key: 'link',
        isAccountLevel: true,
      },
      {
        key: 'job_title',
        isAccountLevel: true,
      },
      {
        key: 'email',
        isAccountLevel: true,
      },
      {
        key: 'nationality',
        isAccountLevel: true,
      },
      {
        key: 'country',
        isAccountLevel: true,
      },
      {
        key: 'state',
        isAccountLevel: true,
      },
    ],
  },
  MSTeams: {
    key: 'microsoft_teams',
    value: 'microsoft-teams',
    disconnectDescription: 'ms-teams-disconnect-description',
    getRedirectURIAPI: GetRedirectURIForMSTeams,
    connectAPI: IntegrationConnectForMSTeams,
    disconnectAPI: IntegrationDisconnectForMSTeams,
  },
  MicrosoftAzure: {
    key: 'microsoft_azure_sso',
    value: 'microsoft-azure',
    enableTitle: 'enable-microsoft-azure-title-description',
    description: 'microsoft-azure-description',
    createConnectAPI: CreateIntegrationsForMicrosoftAzure,
    updateConnectAPI: UpdateIntegrationsForMicrosoftAzure,
    getConnectAPI: GetIntegrationsForMicrosoftAzure,
    revokeConnectAPI: RevokeIntegrationsForMicrosoftAzure,
    disconnectAPI: RevokeIntegrationsForMicrosoftAzure,
    disconnectDescription: 'microsoft-azure-disconnect-description',
    syncUsersAPI: SyncUsersForMicrosoftAzure,
    getAPIPath: 'result',
    onlyCallGetIfConnected: true,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'tenant_id',
        isAccountLevel: true,
      },
      {
        key: 'secret_value',
        isAccountLevel: true,
      },
      {
        key: 'client_id',
        isAccountLevel: true,
      },
      {
        key: 'domain',
        isAccountLevel: true,
      },
      {
        key: 'attribute_value',
        isAccountLevel: true,
      },
      {
        key: 'attribute_key',
        isAccountLevel: true,
      },
      {
        key: 'is_attribute_enabled',
        isAccountLevel: true,
      },
      {
        key: 'default_attribute_value',
        isAccountLevel: true,
      },
      {
        key: 'excluded_emails',
        isAccountLevel: true,
      },
      {
        key: 'sync_schedule',
        isAccountLevel: true,
      },
      {
        key: 'is_sync_enabled',
        isAccountLevel: true,
      },
      {
        key: 'is_sso_branch_level',
        isAccountLevel: true,
      },
      {
        key: 'group_name',
        isAccountLevel: false,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: true,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
      {
        key: 'permissions',
        isAccountLevel: false,
      },
      {
        key: 're_sync_all_users',
        isAccountLevel: true,
      },
    ],
  },
  Oracle: {
    key: 'oracle_sso',
    value: 'oracle-sso',
    enableTitle: 'enable-oracle-sso-title-description',
    description: 'oracle-sso-description',
    createConnectAPI: CreateIntegrationsForOracleSSO,
    updateConnectAPI: UpdateIntegrationsForOracleSSO,
    getConnectAPI: GetIntegrationsForOracleSSO,
    revokeConnectAPI: RevokeIntegrationsForOracleSSO,
    disconnectAPI: RevokeIntegrationsForOracleSSO,
    disconnectDescription: 'oracle-sso-disconnect-description',
    // syncUsersAPI: SyncUsersForOracle,
    getAPIPath: 'result',
    onlyCallGetIfConnected: true,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'tenant_id',
        isAccountLevel: true,
      },
      {
        key: 'secret_value',
        isAccountLevel: true,
      },
      {
        key: 'client_id',
        isAccountLevel: true,
      },
      {
        key: 'domain',
        isAccountLevel: true,
      },
      {
        key: 'has_company_level_config',
        isAccountLevel: true,
      },
      {
        key: 'company_uuid',
        isAccountLevel: false,
      },
      {
        key: 'enabled',
        isAccountLevel: false,
      },
      {
        key: 'permissions',
        isAccountLevel: false,
      },
    ],
  },
  UpsideLMS: {
    key: 'upside_lms',
    value: 'upside-lms',
    enableTitle: 'enable-upside-lms-title-description',
    description: 'upside-lms-description',
    getConnectAPI: GetIntegrationsForUpsideLMS,
    getAPIPath: 'result',
    onlyCallGetIfConnected: true,
    createConnectAPI: UpdateIntegrationsForUpsideLMS,
    updateConnectAPI: UpdateIntegrationsForUpsideLMS,
    disconnectAPI: RevokeIntegrationsForUpsideLMS,
    disconnectDescription: 'upside-lms-disconnect-description',
    getPushDataAPI: GetCandidatePushToUpsideDetails,
    createPushDataAPI: CreatePushToUpsideLMS,
    updatePushDataAPI: UpdatePushToUpsideLMS,
    keys: [
      {
        key: 'enabled',
        isAccountLevel: true,
      },
      {
        key: 'upside_client_key',
        isAccountLevel: true,
      },
      {
        key: 'context_path',
        isAccountLevel: true,
      },
      {
        key: 'upside_auth_url',
        isAccountLevel: true,
      },
      {
        key: 'upside_manage_user_url',
        isAccountLevel: true,
      },
    ],
    pushToPartnerKeys: [
      {
        key: 'first_name',
        isAccountLevel: true,
      },
      {
        key: 'last_name',
        isAccountLevel: true,
      },
      {
        key: 'unique_id',
        isAccountLevel: true,
        isPrimary: true,
      },
      {
        key: 'date_of_birth',
        isAccountLevel: true,
      },
      {
        key: 'joining_date_upside_lms',
        isAccountLevel: true,
      },
      {
        key: 'org',
        isAccountLevel: true,
      },
      // {
      //   key: 'current_experience',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'total_experience',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'termination_date',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'user_expiry_date',
      //   isAccountLevel: true,
      // },
      {
        key: 'gender_upside_lms',
        isAccountLevel: true,
      },
      {
        key: 'status_upside_lms',
        isAccountLevel: true,
      },
      {
        key: 'email',
        isAccountLevel: true,
      },
      {
        key: 'user_name',
        isAccountLevel: true,
      },
      {
        key: 'password',
        isAccountLevel: true,
      },
      // {
      //   key: 'alternate_email',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'phone',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'mobile',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'user_language',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'grade',
      //   isAccountLevel: true,
      // },
      {
        key: 'designation',
        isAccountLevel: true,
      },
      // {
      //   key: 'role',
      //   isAccountLevel: true,
      // },
      {
        key: 'lms_role',
        isAccountLevel: true,
      },
      {
        key: 'line_manager',
        isAccountLevel: true,
      },
      // {
      //   key: 'indirect_line_manager',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'learning_group',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'local_address',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'local_pin_no',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'address_line1',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'address_line2',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'pin_no',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'city',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'state',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'country',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'profile_picture',
      //   isAccountLevel: true,
      // },
      // {
      //   key: 'previous_role',
      //   isAccountLevel: true,
      // },
    ],
  },
};

/* eslint-disable import/no-named-as-default */
import React, { lazy, Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { Responsibility } from 'utils/functions/responsibility';
import { CurrentFeatures, SubscriptionServicesEnum } from '../../enums';
import { PipelinePermissions } from 'permissions/eva-rec/Pipeline.Permissions';
import {
  // AnalyticsPermissions,
  // BillingHistoryPermissions,
  BranchesPermissions,
  BuyChannelsCreditPermissions,
  CampaignsPermissions,
  CategoriesPermissions,
  CommitteesPermissions,
  CreateAnApplicationPermissions,
  CreateAssessmentPermissions,
  EducationPermissions,
  EmailTemplatesPermissions,
  EvaBrandPermissions,
  EvaluationsPermissions,
  EvaMeetPermissions,
  EvaRecTemplatesPermissions,
  EvaSsessTemplatesPermissions,
  DataSecurityRulesPermissions,
  GroupPermissions,
  HierarchyLevelsPermissions,
  HierarchyPermissions,
  IndexPermissions,
  IntegrationsPermissions,
  LocationsPermissions,
  ManageApplicationsPermissions,
  ManageAssessmentsPermissions,
  ManageTeamsPermissions,
  MyChannelsCreditPermissions,
  OfferClassificationPermissions,
  // OffersPermissions,
  OrganizationGroupPermissions,
  PermissionsPermissions,
  PersonalClassificationPermissions,
  PipelinesPermissions,
  // PlansPermissions,
  PositionClassificationPermissions,
  PositionTitlePermissions,
  JobsTitlesPermissions,
  ProjectsPermissions,
  QuestionnairesPermissions,
  RequirementsPermissions,
  RMSPermissions,
  SearchDatabasePermissions,
  SponsorsPermissions,
  // SubscriptionSettingsPermissions,
  UsersPermissions,
  WorkClassificationPermissions,
  WorkflowsPermissions,
  PositionsPermissions,
  PreScreeningApprovalPermissions,
  TeamsPermissions,
  AgencyPermissions,
  EmployeesPermissions,
  ManageFormBuilderTypesPermissions,
  ManageFormBuilderTemplatesPermissions,
  VisasPermissions,
  NewAnalyticsPermissions,
  VisasLookupPermissions,
  ManageVisasPermissions,
  ManageOnboardingPermissions,
  FileClassificationPermissions,
} from '../../permissions';
import { EvaRecManageVisaPermissions } from '../../permissions/eva-rec/EvaRecManageVisa.Permissions';
import { Backdrop, CircularProgress } from '@mui/material';
import { MFAPermissions } from '../../permissions/setups/security/MFA.Permissions';
import { GetIsExternalRoutesHandler } from '../../helpers/Routing.Helper';

// const Integrations = lazy(() => import('pages/Integrations'));
const IntegrationsPage = lazy(() => import('pages/integrations/Integrations.Page'));
const MeetingsWrapper = lazy(() => import('pages/evameet'));
const RecordedVideo = lazy(() => import('pages/evameet/RecordedVideo'));
// eslint-disable-next-line no-unused-vars
// Needed to lazy load components & modules
const ElevatusComponent = lazy(() => import('../ElevatusComponent'));

const PrivateRoute = lazy(() => import('./PrivateRoute'));
const TemplatesAssessment = lazy(() =>
  import('../evassess/templates/TemplatesAssessment'),
);
const TemplateForm = lazy(() => import('../evassess/templates/TemplateForm'));
const CreateTemplate = lazy(() => import('../evassess/templates/CreateTemplate'));
const ManageAssessment = lazy(() => import('../evassess/manage/ManageAssessment'));
const Assessment = lazy(() => import('../evassess/manage/Assessment'));
const AccountSettings = lazy(() => import('../account/AccountSettings'));
const createAssessment = lazy(() => import('../evassess/create/createAssessment'));
const CareerBrandingWrapper = lazy(() =>
  import('../evabrand/CareerBrandingWrapper'),
);

/** Job board */
const CreateJob = lazy(() => import('../evarec/create/CreateJobWrapper'));
const EditJob = lazy(() => import('../evarec/create/EditJobWrapper'));
const ManageJob = lazy(() => import('../evarec/manage'));
const ManageJobDetail = lazy(() => import('../evarec/old-pipeline'));
const ShareApplicant = lazy(() => import('../evarec/search/ShareApplicant'));
const SearchDatabase = lazy(() => import('../evarec/search/SearchDatabase'));
const ApplicantProfile = lazy(() => import('../evarec/search/ApplicantProfile'));
const TemplatesJob = lazy(() => import('../evarec/templates/TemplatesJob'));
const CreateTemplateWrapper = lazy(() =>
  import('../evarec/templates/CreateTemplateWrapper'),
);
const EditTemplateWrapper = lazy(() =>
  import('../evarec/templates/EditTemplateWrapper'),
);
const ResumeList = lazy(() => import('../evarec/rms/ResumeList'));

//  <-- Recruiter Preference -->
const Pipeline = lazy(() => import('../recruiter-preference/Pipeline/Pipeline'));

const Questionnaire = lazy(() =>
  import('../recruiter-preference/Questionnaire/Questionnaire'),
);
const AddQuestionnaireWrapper = lazy(() =>
  import('../recruiter-preference/Questionnaire/AddQuestionnaireWrapper'),
);
const TeamMember = lazy(() =>
  import('../recruiter-preference/TeamMember/TeamMember'),
);
// import Users from '../recruiter-preference/ManageUsers/Users';
const TemplatesPage = lazy(() =>
  import('../recruiter-preference/Offers/Templates.Page'),
);
const AppPermissionsTable = lazy(() =>
  import('../recruiter-preference/AppPermissions/AppPermissionsTable'),
);

const Overview = lazy(() => import('../overview/Overview'));
const Error401 = lazy(() => import('../static/Error401'));

//  <!-- Recruiter Preference -->
//  <-- Evaluation -->
const Evaluations = lazy(() =>
  import('../recruiter-preference/evaluation/Evaluations'),
);

const AddEvaluation = lazy(() =>
  import('../recruiter-preference/evaluation/AddEvaluation'),
);

//  <!-- Evaluation -->
const CompanyDetails = lazy(() => import('../account/CompanyDetails'));
const editAssessment = lazy(() => import('../evassess/create/editAssessment'));
const SharedResumes = lazy(() => import('../evarec/rms/SharedResumes'));
const SetupsPage = lazy(() => import('../setups/Setups.Page'));

const EvaBrandPage = lazy(() => import('../evabrand/EvaBrand.Page'));
const CampaignPage = lazy(() => import('../acquisition/campaigns/Campaign.Page'));
const ContractsPage = lazy(() => import('../acquisition/contracts/Contracts.Page'));
// const VonqCampaignsPage = lazy(() => import('../acquisition/vonq-campaigns/VonqCampaigns.Page'));

const EmailTemplates = lazy(() =>
  import('../recruiter-preference/EmailTemplates/EmailTemplates'),
);

//  <!-- Scorecard -->
const Scorecard = lazy(() =>
  import('../recruiter-preference/Scorecard/Scorecard.Page'),
);

//  <!-- Billing -->
// const BillingPlansView = lazy(() => import('../billing/BillingPlansView'));
// const BillingHistoryView = lazy(() => import('../billing/BillingHistoryView'));
// const CurrentBillingInfoView = lazy(() =>
//   import('../billing/CurrentBillingInfoView')
// );

const BuyChannelsCreditPage = lazy(() =>
  import('../acquisition/buy-channels-credit/BuyChannelsCredit.Page'),
);
const MyChannelsCreditPage = lazy(() =>
  import('../acquisition/my-channels-credit/MyChannelsCredit.Page'),
);

const NoSubscriptionView = lazy(() =>
  import('../../shared/NoSubscriptionView/NoSubscriptionView'),
);
const InitialApprovalPage = lazy(() =>
  import('../evarec/initial-approval/InitialApproval.Page'),
);
const PreScreeningApprovalPage = lazy(() =>
  import(
    '../evarec/initial-approval/pre-screening-approval/PreScreeningApproval.Page'
  ),
);
const PreScreeningApprovalManagement = lazy(() =>
  import(
    '../evarec/initial-approval/pre-screening-approval/pre-screening-management/PreScreeningApprovalManagement'
  ),
);
const Mailbox = lazy(() => import('../mailbox/index'));
const SentMailbox = lazy(() => import('../mailbox/Sent.Page'));
// import DraftsMailbox from '../mailbox/Drafts.Page';
const SpamMailbox = lazy(() => import('../mailbox/Spam.Page'));
const ImportantMailbox = lazy(() => import('../mailbox/Important.Page'));
const AllMailbox = lazy(() => import('../mailbox/AllMail.Page'));
const StarredMailbox = lazy(() => import('../mailbox/Starred.Page'));
const TrashMailbox = lazy(() => import('../mailbox/Trash.Page'));
const EmailsIntegrationSettings = lazy(() =>
  import('../mailbox/EmailIntegrationSettings.Component'),
);

const PipelinesPage = lazy(() => import('../evarec/pipelines/Pipelines.Page'));

//  <!-- Visa -->
const VisaPage = lazy(() => import('../visa/Visa.Page'));

// import EmployeesPage from '../evarec/employees/Employees.Page';
// import DispatcherProcessPage from '../evarec/dispatcher-process/DispatcherProcess.Page';
// import DispatcherProcessPage from '../evarec/dispatcher-process/DispatcherProcess.Page';
const AssessmentTestPage = lazy(() =>
  import('../assessment-test/AssessmentTest.Page'),
);
const PipelineManagement = lazy(() =>
  import('../evarec/pipelines/managements/pipeline/Pipeline.Management'),
);

const ProviderPage = lazy(() => import('../provider/Provider.Page'));
const ProviderMembersPage = lazy(() => import('../provider/members/Members.Page'));
const ProviderProfilePage = lazy(() => import('../provider/profile/Profile.Page'));
const EmailsIntegrationCalendar = lazy(() =>
  import('../mailbox/EmailsIntegrationCalendar.Page'),
);
const DataFlowPage = lazy(() => import('../dataflow/DataFlow.Page'));
const DataFlowTablePage = lazy(() => import('../dataflow/DataFlowTable.Page'));
const AnalyticsPage = lazy(() => import('../analytics/Analytics.Page'));
const OnboardingPage = lazy(() => import('../onboarding/Onboarding.Page'));
const VisaMassAllocationPage = lazy(() =>
  import('../evarec/visa-mass-allocation/VisaMassAllocation.Page'),
);
const AnnouncementsPage = lazy(() => import('../announcements/Announcements.Page'));
export const routes = [
  {
    key: 'overview',
    path: '/overview',
    name: 'Shared:overview',
    icon: 'fas fa-home',
    layout: '/recruiter',
    tooltip_target: 'overview',
  },
  {
    key: 'eva-brand',
    path: '/eva-brand/',
    // path: '/evabrand/',
    name: 'Shared:eva-brand',
    icon: 'fas fa-adjust',
    layout: '/recruiter',
    tooltip_target: 'career_branding',
    defaultPermissions: EvaBrandPermissions,
    // create', 'career-portal'),
  },
  {
    key: 'job',
    collapse: true,
    name: 'Shared:eva-rec',
    icon: 'fas fa-briefcase',
    state: 'jobCollapse',
    tooltip_target: 'job_board',
    visibleUser: ['user', 'provider'],
    path: '/manage',
    layout: '/recruiter/job',
    serviceKey: SubscriptionServicesEnum.EvaRec.key,
    defaultPermissions: {
      ...CreateAnApplicationPermissions,
      ...ManageApplicationsPermissions,
      ...EvaRecTemplatesPermissions,
      ...SearchDatabasePermissions,
      ...RMSPermissions,
      ...PreScreeningApprovalPermissions,
    },
    views: [
      {
        path: '/create',
        name: 'Shared:create-an-application',
        layout: '/recruiter/job',
        tooltip_target: 'job_create',
        icon: 'far fa-lightbulb',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        permissionId: CreateAnApplicationPermissions.AddEvaRecApplication.key,
        hideForProvider: true, // remove later and depend on permissions only
      },
      {
        path: '/manage',
        name: 'Shared:manage-applications',
        layout: '/recruiter/job',
        tooltip_target: 'job_manage',
        icon: 'far fa-address-card',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        defaultPermissions: {
          ...ManageApplicationsPermissions,
          ...CreateAnApplicationPermissions,
        },
      },
      {
        path: '/templates',
        name: 'Shared:templates',
        layout: '/recruiter/job',
        tooltip_target: 'job_template',
        icon: 'far fa-copy',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        defaultPermissions: EvaRecTemplatesPermissions,
        hideForProvider: true, // remove later and depend on permissions only
      },
      {
        path: '/pipelines',
        name: 'Shared:pipelines',
        layout: '/recruiter/job',
        tooltip_target: 'job_manage',
        icon: 'fas fa-database',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        defaultPermissions: PipelinePermissions,
        hideForProvider: true, // remove later and depend on permissions only
      },
      // {
      //   path: '/categories',
      //   name: 'Shared:categories',
      //   layout: '/recruiter/job',
      //   tooltip_target: 'job_category',
      //   icon: 'fa fa-th-large',
      //   view', 'ats') || !Can('create', 'ats'),
      // },
      {
        path: '/search-database',
        name: 'Shared:search-database',
        layout: '/recruiter/job',
        tooltip_target: 'job_search_database',
        icon: 'fas fa-search',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        defaultPermissions: SearchDatabasePermissions,
      },
      {
        path: '/initial-approval',
        name: 'InitialApproval:initial-approval',
        layout: '/recruiter/job',
        tooltip_target: 'job_approve_applicants',
        icon: 'fas fa-user-check',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        defaultPermissions: PreScreeningApprovalPermissions,
        // view', 'job_board'),
        // permissionId: {..key}
        hideForProvider: true, // remove later and depend on permissions only
      },
      {
        path: '/rms',
        name: 'Shared:rms',
        layout: '/recruiter/job',
        tooltip_target: 'job_rms',
        icon: 'far fa-file-pdf',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        defaultPermissions: RMSPermissions,
        hideForProvider: true, // remove later and depend on permissions only
      },
      // {
      //   path: '/dispatcher-process',
      //   name: 'DispatcherProcessPage:dispatcher-process',
      //   layout: '/recruiter/job',
      //   tooltip_target: 'dispatcher-process',
      //   icon: 'far fa-handshake',
      // },
      {
        path: '/visa-mass-allocation',
        name: 'Shared:visa-mass-allocation',
        layout: '/recruiter/job',
        tooltip_target: 'visa_mass_allocation',
        icon: 'fas fa-ticket-alt',
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        // defaultPermissions: RMSPermissions,
        hideForProvider: true, // remove later and depend on permissions only
      },
    ],
  },
  {
    key: 'assessment',
    collapse: true,
    name: 'Shared:eva-ssess',
    icon: 'fas fa-video',
    state: 'componentsCollapse',
    tooltip_target: 'video_assessment',
    path: '/manage/list',
    layout: '/recruiter/assessment',
    serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
    defaultPermissions: {
      ...CreateAssessmentPermissions,
      ...ManageAssessmentsPermissions,
      ...EvaSsessTemplatesPermissions,
    },
    views: [
      {
        path: '/create',
        name: 'Shared:create-assessment',
        layout: '/recruiter/assessment',
        tooltip_target: 'assessment_create',
        icon: 'far fa-lightbulb',
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        permissionId: CreateAssessmentPermissions.AddEvaSsessApplication.key,
      },
      {
        path: '/manage/list',
        name: 'Shared:manage-assessment',
        layout: '/recruiter/assessment',
        tooltip_target: 'assessment_manage',
        icon: 'far fa-address-card',
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        permissionId: CreateAssessmentPermissions.ViewEvaSsessApplication.key,
      },
      {
        path: '/templates',
        name: 'Shared:templates',
        layout: '/recruiter/assessment',
        tooltip_target: 'assessment_template',
        icon: 'far fa-copy',
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        defaultPermissions: EvaSsessTemplatesPermissions,
      },
    ],
  },
  // {
  //   key: 'meetings',
  //   path: '/meetings/',
  //   name: 'Shared:eva-meet',
  //   icon: 'far fa-comments',
  //   layout: '/recruiter',
  //   tooltip_target: 'meetings',
  //   defaultPermissions: EvaMeetPermissions,
  // },
  {
    key: 'analytics',
    path: '/analytics',
    name: 'Shared:analytics',
    icon: 'far fa-chart-bar',
    layout: '/recruiter',
    tooltip_target: 'analytics',
    permissionId: NewAnalyticsPermissions.SuperAnalytics.key,
  },
  {
    key: 'recruiter-preference',
    collapse: true,
    name: 'Shared:preferences',
    icon: 'fas fa-sliders-h',
    layout: '/recruiter/recruiter-preference',
    path: '/email-templates',
    defaultPermissions: {
      ...ManageTeamsPermissions,
      ...EmailTemplatesPermissions,
      ...PipelinesPermissions,
      ...QuestionnairesPermissions,
      ...QuestionnairesPermissions,
      ...IndexPermissions,
      ...RequirementsPermissions,
      ...EvaluationsPermissions,
    },
    views: [
      {
        path: '/team',
        name: 'Shared:manage-teams',
        icon: 'fas fa-users',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'manage_teams',
        defaultPermissions: ManageTeamsPermissions,
      },
      // {
      //   path: '/users',
      //   name: 'Shared:manage-users',
      //   icon: 'fas fa-users-cog',
      //   layout: '/recruiter/recruiter-preference',
      //   tooltip_target: 'manage_users',
      //   view', 'sub-user'),
      //   permissionId: {..key} : CurrentFeatures.users.permissionId: {..key} ,
      // },
      {
        path: '/email-templates',
        name: 'Shared:email-templates',
        icon: 'far fa-envelope',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'email_templates',
        defaultPermissions: EmailTemplatesPermissions,
      },
      {
        path: '/pipeline',
        name: 'Shared:pipelines',
        icon: 'fas fa-database',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'pipeline',
        defaultPermissions: PipelinesPermissions,
        slugId: CurrentFeatures.pipeline.permissionsId,
      },
      {
        path: '/questionnaire',
        name: 'Shared:questionnaires',
        icon: 'fas fa-question',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'questionnaire',
        defaultPermissions: QuestionnairesPermissions,
        slugId: CurrentFeatures.questionnaire.permissionsId,
      },
      {
        path: '/permissions',
        name: 'Shared:requirements',
        icon: 'fas fa-stream',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'permissions',
        defaultPermissions: RequirementsPermissions,
        slugId: CurrentFeatures.requirement.permissionsId,
      },
      {
        path: '/evaluation',
        name: 'Shared:evaluations',
        icon: 'fas fa-sort-numeric-up',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'evaluation',
        defaultPermissions: EvaluationsPermissions,
        slugId: CurrentFeatures.evaluation.permissionsId,
      },
      {
        path: '/scorecard',
        name: 'Shared:scorecard',
        icon: 'far fa-address-card',
        layout: '/recruiter/recruiter-preference',
        tooltip_target: 'scorecard',
      },
    ],
  },
  //   Hide Billing Module
  // {
  //   key: 'billing',
  //   collapse: true,
  //   name: 'Shared:billing',
  //   icon: 'fas fa-receipt',
  //   state: 'systemAdmin',
  //   isBottom: true,
  //   path: '/billing-plans',
  //   layout: '/recruiter/billing',
  //   defaultPermissions: {
  //     ...PlansPermissions,
  //     ...BillingHistoryPermissions,
  //     ...SubscriptionSettingsPermissions,
  //   },
  //   views: [
  //     {
  //       path: '/billing-plans',
  //       name: 'Shared:plans',
  //       icon: 'fas fa-file-invoice-dollar',
  //       layout: '/recruiter/billing',
  //       defaultPermissions: PlansPermissions,
  //     },
  //     {
  //       path: '/billing-history',
  //       name: 'Shared:billing-history',
  //       icon: 'fas fa-history',
  //       layout: '/recruiter/billing',
  //       permissionId: BillingHistoryPermissions.ACCESSBILLINGHISTORY.key,
  //     },
  //     {
  //       path: '/subscription-settings',
  //       name: 'Shared:subscription-settings',
  //       icon: 'fas fa-cogs',
  //       layout: '/recruiter/billing',
  //       defaultPermissions: SubscriptionSettingsPermissions,
  //     },
  //   ],
  // },
  {
    key: 'acquisition',
    collapse: true,
    isBottom: true,
    name: 'Shared:acquisition',
    icon: 'fas fa-hands',
    state: 'acquisitionsCollapse',
    tooltip_target: 'Shared:acquisition',
    visibleFor: ['staging', 'production'],
    path: '/campaigns',
    layout: '/recruiter/acquisition',
    defaultPermissions: {
      ...CampaignsPermissions,
      ...BuyChannelsCreditPermissions,
      ...MyChannelsCreditPermissions,
    },
    views: [
      {
        path: '/campaigns',
        name: 'CampaignPage:campaigns',
        icon: 'fas fa-bullhorn',
        layout: '/recruiter/acquisition',
        tooltip_target: 'CampaignPage:campaigns',
        defaultPermissions: CampaignsPermissions,
      },
      {
        path: '/buy-channels-credit',
        name: 'BuyChannelsCreditPage:buy-channels-credit',
        icon: 'fas fa-shopping-cart',
        layout: '/recruiter/acquisition',
        tooltip_target: 'BuyChannelsCreditPage:buy-channels-credit',
        defaultPermissions: BuyChannelsCreditPermissions,
      },
      {
        path: '/my-channels-credit',
        name: 'MyChannelsCreditPage:my-channels-credit',
        icon: 'fab fa-hubspot',
        layout: '/recruiter/acquisition',
        tooltip_target: 'MyChannelsCreditPage:my-channels-credit',
        defaultPermissions: MyChannelsCreditPermissions,
      },
      {
        path: '/contracts',
        name: 'ContractsPage:contracts',
        icon: 'fas fa-file-contract',
        layout: '/recruiter/acquisition',
        tooltip_target: 'ContractsPage:contracts',
        // defaultPermissions: MyChannelsCreditPermissions,
      },
      // {
      //   path: '/vonq-campaigns',
      //   name: 'VonqCampaignsPage:vonq-campaigns',
      //   icon: 'fas fa-file-contract',
      //   layout: '/recruiter/acquisition',
      //   tooltip_target: 'VonqCampaignsPage:vonq-campaigns',
      //   // defaultPermissions: MyChannelsCreditPermissions,
      // },
    ],
  },
  // {
  //   key: 'employees',
  //   path: '/employees',
  //   name: 'SetupsPage:employees',
  //   layout: '/recruiter',
  //   isBottom: true,
  //   tooltip_target: 'employees',
  //   icon: 'fas fa-users',
  //   // view', 'job_board'),
  //   // permissionId: {..key} : CurrentFeatures.search_database.permissionId: {..key} ,
  // },
  {
    key: 'form-builder',
    collapse: false,
    isBottom: false,
    name: 'Shared:form-builder',
    icon: 'fas fa-hand-holding-usd',
    state: 'form-builder',
    tooltip_target: 'form-builder',
    visibleFor: ['staging', 'production'],
    path: '/form-builder',
    layout: '/recruiter',
    isNewStyle: true,
    defaultPermissions: {
      ...ManageFormBuilderTemplatesPermissions,
      ...ManageFormBuilderTypesPermissions,
    },
    // slugId: CurrentFeatures.offer.permissionsId,
  },
  {
    key: 'assessment-test',
    collapse: false,
    isBottom: false,
    name: 'AssessmentTest:assessment-test',
    icon: 'fa fa-file-invoice',
    state: 'AssessmentTestPage',
    tooltip_target: 'AssessmentTest:assessment-test',
    visibleFor: ['staging', 'production'],
    path: '/assessment-test',
    layout: '/recruiter',
    isNewStyle: true,
    permissionId: ManageApplicationsPermissions.AssessmentTest.key,
  },
  {
    key: 'visa',
    collapse: true,
    isBottom: true,
    name: 'VisaPage:visa',
    icon: 'fas fa-ticket-alt',
    state: 'visaModule',
    tooltip_target: 'VisaPage:visa',
    visibleFor: ['staging', 'production'],
    path: '/dashboard',
    layout: '/visa',
    // isNewStyle: false,
    defaultPermissions: {
      ViewVisa: VisasPermissions.ViewVisa,
      ViewLookup: VisasLookupPermissions.ViewLookup,
    },
    views: [
      {
        path: '/dashboard',
        key: 'visa-dashboard',
        name: 'VisaPage:visa-dashboard',
        icon: 'fas fa-tachometer-alt',
        layout: '/visa',
        tooltip_target: 'VisaPage:visa-dashboard',
        permissionId: VisasPermissions.ViewVisa.key,
      },
      // {
      //   path: '/activity',
      //   key: 'activity',
      //   name: 'VisaPage:activity',
      //   icon: 'fas fa-bolt',
      //   layout: '/visa',
      //   tooltip_target: 'VisaPage:activity',
      //   // defaultPermissions: BranchesPermissions,
      // },
      {
        path: '/pipeline',
        key: 'visa-pipeline',
        name: 'VisaPage:visa-pipeline',
        icon: 'fas fa-database',
        layout: '/visa',
        tooltip_target: 'VisaPage:visa-pipeline',
        permissionId: ManageVisasPermissions.ManagePipeline.key,
      },
      {
        path: '/all-requests',
        key: 'visa-all-requests',
        name: 'VisaPage:all-requests',
        icon: 'fas fa-exchange-alt',
        layout: '/visa',
        tooltip_target: 'VisaPage:all-requests',
        defaultPermissions: {
          ViewVisaReservation: ManageVisasPermissions.ViewVisaReservation,
          ViewVisaAllocation: ManageVisasPermissions.ViewVisaAllocation,
        },
      },
      {
        path: '/visa-Lookups',
        key: 'visa-Lookups',
        name: 'VisaPage:visa-Lookups',
        icon: 'fas fa-user',
        layout: '/visa',
        tooltip_target: 'VisaPage:visa-Lookups',
        defaultPermissions: VisasLookupPermissions,
      },
    ],
  },
  // {
  //   key: 'invitations',
  //   collapse: true,
  //   isBottom: false,
  //   name: 'InvitationsPage:invitations',
  //   icon: 'fas fa-bezier-curve',
  //   state: 'invitationsModule',
  //   tooltip_target: 'InvitationsPage:invitations',
  //   visibleFor: ['staging'],
  //   path: '',
  //   layout: '/invitations',
  //   views: [],
  // },
  {
    key: 'onboarding',
    collapse: true,
    isBottom: true,
    name: 'OnboardingPage:onboarding',
    icon: 'fas fa-plane-arrival',
    state: 'onboardingModule',
    tooltip_target: 'OnboardingPage:onboarding',
    visibleFor: ['staging', 'production'],
    path: '/activity',
    layout: '/onboarding',
    // isNewStyle: false,
    // defaultPermissions: OnboardingPermissions,
    permissionId: ManageOnboardingPermissions.ManageOnboarding.key,
    views: [
      {
        path: '/activity',
        key: 'onboarding-activity',
        name: 'OnboardingPage:activity',
        icon: 'fas fa-bolt',
        layout: '/onboarding',
        tooltip_target: 'OnboardingPage:activity',
        permissionId: ManageOnboardingPermissions.ViewActivity.key,
        // defaultPermissions: OnboardingPermissions,
      },
      {
        path: '/flows',
        key: 'onboarding-flows',
        name: 'OnboardingPage:all-flows',
        icon: 'far fa-dot-circle',
        layout: '/onboarding',
        tooltip_target: 'OnboardingPage:flows',
        permissionId: ManageOnboardingPermissions.ViewAllFlows.key,
        // defaultPermissions: OnboardingPermissions,
      },
      {
        path: '/members',
        key: 'onboarding-members',
        name: 'OnboardingPage:members',
        icon: 'fas fa-user-friends',
        layout: '/onboarding',
        tooltip_target: 'OnboardingPage:members',
        permissionId: ManageOnboardingPermissions.ViewMembers.key,
        // defaultPermissions: OnboardingPermissions,
      },
      {
        path: '/tasks',
        key: 'onboarding-tasks',
        name: 'OnboardingPage:tasks',
        icon: 'far fa-dot-circle',
        layout: '/onboarding',
        tooltip_target: 'OnboardingPage:tasks',
        permissionId: ManageOnboardingPermissions.ViewTasks.key,
        // defaultPermissions: OnboardingPermissions,
      },
      {
        path: '/responses',
        key: 'onboarding-responses',
        name: 'OnboardingPage:responses',
        icon: 'fas fa-comment',
        layout: '/onboarding',
        tooltip_target: 'OnboardingPage:responses',
        defaultPermissions: {
          ViewResponsesRecentActivity:
            ManageOnboardingPermissions.ViewResponsesRecentActivity,
          ViewResponsesAssignToView:
            ManageOnboardingPermissions.ViewResponsesAssignToView,
        },
      },
      {
        path: '/email-management',
        key: 'onboarding-email-management',
        name: 'OnboardingPage:email-management',
        icon: 'far fa-envelope',
        layout: '/onboarding',
        tooltip_target: 'OnboardingPage:email-management',
      },
    ],
  },
  {
    key: 'administration',
    collapse: true,
    isBottom: true,
    name: 'SetupsPage:setups',
    icon: 'fas fa-cog',
    state: 'setupsCollapse',
    tooltip_target: 'SetupsPage:setups',
    visibleFor: ['staging', 'production'],
    path: '/branches',
    layout: '/setups/administration',
    isNewStyle: true,
    defaultPermissions: {
      ...BranchesPermissions,
      ...PermissionsPermissions,
      ...CategoriesPermissions,
      ...UsersPermissions,
      ...DataSecurityRulesPermissions,
      ...GroupPermissions,
      ...TeamsPermissions,
      ...HierarchyLevelsPermissions,
      ...HierarchyPermissions,
      ...ProjectsPermissions,
      ...LocationsPermissions,
      ...SponsorsPermissions,
      ...PositionsPermissions,
      ...PositionTitlePermissions,
      ...JobsTitlesPermissions,
      ...OrganizationGroupPermissions,
      ...PersonalClassificationPermissions,
      ...EducationPermissions,
      ...WorkClassificationPermissions,
      ...PositionClassificationPermissions,
      ...OfferClassificationPermissions,
      ...WorkflowsPermissions,
      ...CommitteesPermissions,
      ...EmployeesPermissions,
      ...AgencyPermissions,
    },
    views: [
      {
        key: 'administration',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:administration-setup',
        icon: 'fab fa-centos',
        state: 'administrationCollapse',
        tooltip_target: 'SetupsPage:administration-setup',
        path: '/branches',
        layout: '/setups/administration',
        visibleFor: ['staging', 'production'],
        defaultPermissions: {
          ...BranchesPermissions,
          ...PermissionsPermissions,
          ...CategoriesPermissions,
          ...UsersPermissions,
          ...DataSecurityRulesPermissions,
          ...GroupPermissions,
          ...TeamsPermissions,
          ...EmployeesPermissions,
          ...AgencyPermissions,
        },
        views: [
          {
            path: '/branches',
            key: 'branches',
            name: 'SetupsPage:branches-setup',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:branches-setup',
            defaultPermissions: BranchesPermissions,
          },
          {
            path: '/permissions',
            key: 'permissions',
            name: 'SetupsPage:permissions',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:permissions',
            defaultPermissions: PermissionsPermissions,
          },
          {
            path: '/categories',
            key: 'categories',
            name: 'SetupsPage:categories',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:categories',
            defaultPermissions: CategoriesPermissions,
          },
          {
            path: '/users',
            key: 'users',
            name: 'SetupsPage:users',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:users',
            defaultPermissions: {
              ...UsersPermissions,
              ...EmployeesPermissions,
              ...AgencyPermissions,
            },
          },
          {
            path: '/data-security-rules',
            key: 'data-security-rules',
            name: 'SetupsPage:data-security-rules',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:data-security-rules',
            defaultPermissions: DataSecurityRulesPermissions,
          },
          {
            path: '/group-permissions',
            key: 'group-permissions',
            name: 'SetupsPage:group-permissions',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:group-permissions',
            defaultPermissions: GroupPermissions,
          },
          {
            path: '/teams',
            key: 'teams',
            name: 'SetupsPage:teams',
            layout: '/setups/administration',
            tooltip_target: 'SetupsPage:teams',
            defaultPermissions: TeamsPermissions,
          },
        ],
      },
      {
        key: 'organization',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:organization-setup',
        icon: 'fab fa-hubspot',
        state: 'organizationCollapse',
        tooltip_target: 'SetupsPage:organization-setup',
        path: '/hierarchy-levels',
        layout: '/setups/organization',
        visibleFor: ['staging', 'production'],
        defaultPermissions: {
          ...HierarchyLevelsPermissions,
          ...HierarchyPermissions,
          ...ProjectsPermissions,
          ...SponsorsPermissions,
          ...PositionsPermissions,
          ...PositionTitlePermissions,
          ...JobsTitlesPermissions,
          ...OrganizationGroupPermissions,
        },
        views: [
          {
            path: '/hierarchy-levels',
            key: 'hierarchy-levels',
            name: 'SetupsPage:hierarchy-levels',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:hierarchy',
            defaultPermissions: HierarchyLevelsPermissions,
          },
          {
            path: '/hierarchy',
            key: 'hierarchy',
            name: 'SetupsPage:hierarchy',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:hierarchy',
            defaultPermissions: HierarchyPermissions,
          },
          {
            path: '/projects',
            key: 'projects',
            name: 'SetupsPage:projects',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:projects',
            defaultPermissions: ProjectsPermissions,
          },
          {
            path: '/sponsors',
            key: 'sponsors',
            name: 'SetupsPage:sponsors',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:sponsors',
            defaultPermissions: SponsorsPermissions,
          },
          {
            path: '/positions',
            key: 'positions',
            name: 'SetupsPage:positions',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:positions',
            defaultPermissions: PositionsPermissions,
          },
          {
            path: '/setup-title',
            key: 'job-title', // position title
            name: 'SetupsPage:job-title',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:job-title',
            defaultPermissions: PositionTitlePermissions,
          },
          {
            path: '/jobs-titles',
            key: 'jobs-titles',
            name: 'SetupsPage:jobs-titles',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:jobs-titles',
            defaultPermissions: JobsTitlesPermissions,
          },
          {
            path: '/business-group',
            key: 'business-group',
            name: 'SetupsPage:business-group',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:business-group',
            defaultPermissions: OrganizationGroupPermissions,
          },
          {
            path: '/organization-group',
            key: 'organization-group',
            name: 'SetupsPage:organization-group',
            layout: '/setups/organization',
            tooltip_target: 'SetupsPage:organization-group',
            defaultPermissions: OrganizationGroupPermissions,
          },
        ],
      },
      {
        key: 'personal',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:personal-setup',
        icon: 'fas fa-user',
        state: 'personalCollapse',
        tooltip_target: 'SetupsPage:personal-setup',
        path: '/personal-classification',
        layout: '/setups/personal',
        visibleFor: ['staging', 'production'],
        defaultPermissions: {
          ...PersonalClassificationPermissions,
          ...EducationPermissions,
          ...WorkClassificationPermissions,
          ...PositionClassificationPermissions,
          ...OfferClassificationPermissions,
          ...FileClassificationPermissions,
        },
        views: [
          {
            path: '/personal-classification',
            key: 'personal-classification',
            name: 'SetupsPage:personal-classification',
            layout: '/setups/personal',
            tooltip_target: 'SetupsPage:personal-classification',
            defaultPermissions: PersonalClassificationPermissions,
          },
          {
            path: '/education-classification',
            key: 'education-classification',
            name: 'SetupsPage:education-classification',
            layout: '/setups/personal',
            tooltip_target: 'SetupsPage:education-classification',
            defaultPermissions: EducationPermissions,
          },
          {
            path: '/work-classification',
            key: 'work-classification',
            name: 'SetupsPage:work-classification',
            layout: '/setups/personal',
            tooltip_target: 'SetupsPage:work-classification',
            defaultPermissions: WorkClassificationPermissions,
          },
          // {
          //   path: '/position-classification',
          //   key: 'position-classification',
          //   name: 'SetupsPage:position-classification',
          //   layout: '/setups/personal',
          //   tooltip_target: 'SetupsPage:position-classification',
          //   defaultPermissions: PositionClassificationPermissions,
          // },
          {
            path: '/offer-classification',
            key: 'offer-classification',
            name: 'SetupsPage:offer-classification',
            layout: '/setups/personal',
            tooltip_target: 'SetupsPage:offer-classification',
            defaultPermissions: OfferClassificationPermissions,
          },
          {
            path: '/candidate-properties',
            key: 'candidate-properties',
            name: 'SetupsPage:candidate-properties',
            layout: '/setups/personal',
            tooltip_target: 'SetupsPage:candidate-properties',
            // defaultPermissions: OfferClassificationPermissions, // add later
          },
          {
            path: '/file-classification',
            key: 'file-classification',
            name: 'SetupsPage:file-classification',
            layout: '/setups/personal',
            tooltip_target: 'SetupsPage:file-classification',
            defaultPermissions: FileClassificationPermissions,
          },
        ],
      },
      {
        key: 'dynamic',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:dynamic-setup',
        // icon: 'fas fa-user',
        state: 'dynamicCollapse',
        tooltip_target: 'SetupsPage:dynamic-setup',
        path: '/manage-dynamic',
        layout: '/setups/dynamic',
        visibleFor: ['staging', 'production'],
        defaultPermissions: {
          //change later
          ...PersonalClassificationPermissions,
          ...EducationPermissions,
          ...WorkClassificationPermissions,
          ...PositionClassificationPermissions,
          ...OfferClassificationPermissions,
        },
        views: [
          {
            path: '/manage-dynamic',
            key: 'manage-dynamic',
            name: 'SetupsPage:manage-dynamic',
            layout: '/setups/dynamic',
            tooltip_target: 'SetupsPage:manage-dynamic',
            defaultPermissions: PersonalClassificationPermissions, //change later
          },
          {
            path: '/list-dynamic',
            key: 'list-dynamic',
            name: 'SetupsPage:list-dynamic',
            layout: '/setups/dynamic',
            tooltip_target: 'SetupsPage:list-dynamic',
            defaultPermissions: PersonalClassificationPermissions, //change later
          },
        ],
      },

      {
        key: 'approvals',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:approvals-setup',
        icon: 'fas fa-certificate',
        state: 'approvalsCollapse',
        tooltip_target: 'SetupsPage:approvals-setup',
        path: '/workflows',
        layout: '/setups/approvals',
        visibleFor: ['staging', 'production'],
        defaultPermissions: {
          ...WorkflowsPermissions,
          ...CommitteesPermissions,
        },
        views: [
          {
            path: '/workflows',
            key: 'workflows',
            name: 'SetupsPage:workflows',
            layout: '/setups/approvals',
            tooltip_target: 'SetupsPage:workflows',
            defaultPermissions: WorkflowsPermissions,
          },
          {
            path: '/committees',
            key: 'committees',
            name: 'SetupsPage:committees',
            layout: '/setups/approvals',
            tooltip_target: 'SetupsPage:committees',
            defaultPermissions: CommitteesPermissions,
          },
        ],
      },
      {
        key: 'settings',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:settings',
        icon: 'fas fa-cogs',
        state: 'settingsCollapse',
        tooltip_target: 'SetupsPage:settings',
        path: '/candidates',
        layout: '/setups/settings',
        visibleFor: [],
        // defaultPermissions: {
        //   ...WorkflowsPermissions,
        //   ...CommitteesPermissions,
        // },
        views: [
          {
            path: '/candidates',
            key: 'candidates',
            name: 'SetupsPage:candidates',
            layout: '/setups/settings',
            tooltip_target: 'SetupsPage:candidates',
            // defaultPermissions: WorkflowsPermissions,
          },
          {
            path: '/position-name',
            key: 'position-name',
            name: 'SetupsPage:position-name',
            layout: '/setups/settings',
            tooltip_target: 'SetupsPage:/position-name',
            // defaultPermissions: WorkflowsPermissions,
          },
          {
            path: '/email-masking',
            key: 'email-masking',
            name: 'SetupsPage:email-masking',
            layout: '/setups/settings',
            tooltip_target: 'SetupsPage:/email-masking',
            // defaultPermissions: WorkflowsPermissions,
          },
          {
            path: '/nationality-setting',
            key: 'nationality-setting',
            name: 'SetupsPage:nationality-setting',
            layout: '/setups/settings',
            tooltip_target: 'SetupsPage:nationality-setting',
            // defaultPermissions: WorkflowsPermissions,
          },
          {
            path: '/job-requisition',
            key: 'job-requisition',
            name: 'SetupsPage:job-requisition',
            layout: '/setups/settings',
            tooltip_target: 'SetupsPage:job-requisition',
            // defaultPermissions: WorkflowsPermissions,
          },
        ],
      },
      {
        key: 'security',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:security',
        icon: 'fas fa-unlock-alt',
        state: 'securityCollapse',
        tooltip_target: 'SetupsPage:security-setup',
        path: '/management',
        layout: '/setups/security',
        visibleFor: ['staging', 'production'],
        defaultPermissions: MFAPermissions,
        views: [
          {
            path: '/management',
            key: 'management',
            name: 'SetupsPage:management',
            layout: '/setups/security',
            tooltip_target: 'SetupsPage:management',
            defaultPermissions: MFAPermissions,
          },
          {
            path: '/Authenticator-app-setup',
            key: 'Authenticator-app-setup',
            name: 'SetupsPage:Authenticator-app-setup',
            layout: '/setups/security',
            tooltip_target: 'SetupsPage:Authenticator-app-setup',
            defaultPermissions: MFAPermissions,
          },
          {
            path: '/linked-devices',
            key: 'linked-devices',
            name: 'SetupsPage:linked-devices',
            layout: '/setups/security',
            tooltip_target: 'SetupsPage:linked-devices',
            defaultPermissions: MFAPermissions,
          },
        ],
      },
      {
        key: 'imports',
        collapse: true,
        isBottom: true,
        name: 'SetupsPage:imports',
        icon: 'fas fa-unlock-alt',
        state: 'importsCollapse',
        tooltip_target: 'SetupsPage:imports-setup',
        path: '/management',
        layout: '/setups/imports',
        visibleFor: ['staging', 'production'],
        // defaultPermissions: MFAPermissions,
        views: [
          {
            path: '/personal-classification',
            key: 'personal-classification',
            name: 'SetupsPage:personal-classification',
            layout: '/setups/imports',
            tooltip_target: 'SetupsPage:personal-classification',
            // defaultPermissions: MFAPermissions,
          },
          {
            path: '/education-classification',
            key: 'education-classification',
            name: 'SetupsPage:education-classification',
            layout: '/setups/imports',
            tooltip_target: 'SetupsPage:education-classification',
            // defaultPermissions: MFAPermissions,
          },
          {
            path: '/work-classification',
            key: 'work-classification',
            name: 'SetupsPage:work-classification',
            layout: '/setups/imports',
            tooltip_target: 'SetupsPage:work-classification',
            // defaultPermissions: MFAPermissions,
          },
          {
            path: '/offer-classification',
            key: 'offer-classification',
            name: 'SetupsPage:offer-classification',
            layout: '/setups/imports',
            tooltip_target: 'SetupsPage:offer-classification',
            // defaultPermissions: MFAPermissions,
          },
          {
            path: '/file-classification',
            key: 'file-classification',
            name: 'SetupsPage:file-classification',
            layout: '/setups/imports',
            tooltip_target: 'SetupsPage:file-classification',
            // defaultPermissions: MFAPermissions,
          },
          {
            path: '/organization-setup',
            key: 'organization-setup',
            name: 'SetupsPage:organization-setup',
            layout: '/setups/imports',
            tooltip_target: 'SetupsPage:organization-setup',
            // defaultPermissions: MFAPermissions,
          },
          // {
          //   path: '/administration-setup',
          //   key: 'administration-setup',
          //   name: 'SetupsPage:administration-setup',
          //   layout: '/setups/imports',
          //   tooltip_target: 'SetupsPage:administration-setup',
          //   // defaultPermissions: MFAPermissions,
          // },
        ],
      },
    ],
  },
  // {
  //   key: 'integrations',
  //   path: '/integrations',
  //   name: 'Shared:integrations',
  //   icon: 'far fa-handshake',
  //   layout: '/recruiter',
  //   tooltip_target: 'integrations',
  //   isBottom: true,
  //   isDisabled: !Responsibility('administrator') || false,
  //   defaultPermissions: IntegrationsPermissions,
  // },
  {
    key: 'integrations',
    collapse: false,
    isBottom: true,
    name: 'Shared:integrations',
    icon: 'far fa-handshake',
    state: 'integrationsCollapse',
    tooltip_target: 'Shared:integrations',
    path: '/connections',
    layout: '/recruiter',
    visibleFor: ['staging', 'production'],
    isDisabled: !Responsibility('administrator') || false,
    defaultPermissions: IntegrationsPermissions,
    views: [],
  },
  {
    key: 'mailbox',
    collapse: true,
    isBottom: true,
    name: 'Shared:mailbox',
    icon: 'fas fa-envelope',
    state: 'mailboxCollapse',
    tooltip_target: 'mailbox',
    path: '/mailbox',
    layout: '/recruiter',
    visibleFor: ['staging', 'production'],
    views: [
      {
        key: 'emails',
        collapse: true,
        isBottom: true,
        path: '/inbox',
        name: 'Shared:emails',
        icon: 'fas fa-envelope-open-text',
        layout: '/recruiter/mailbox',
        tooltip_target: 'emails',
        state: 'emailsCollapse',
        visibleFor: ['staging', 'production'],
        emailIntegrationCondition: true,
        views: [
          {
            key: 'inbox',
            path: '/inbox',
            name: 'Shared:inbox',
            layout: '/recruiter/mailbox',
            tooltip_target: 'inbox',
            emailIntegrationCondition: true,
            icon: 'fas fa-inbox',
          },
          {
            key: 'sent',
            path: '/sent',
            name: 'Shared:sent',
            layout: '/recruiter/mailbox',
            tooltip_target: 'sent',
            emailIntegrationCondition: true,
            icon: 'fas fa-paper-plane',
          },
          // {
          //   key: 'drafts',
          //   path: '/drafts',
          //   name: 'Shared:drafts',
          //   layout: '/recruiter/mailbox',
          //   tooltip_target: 'drafts',
          //   emailIntegrationCondition: true,
          //   icon: 'fas fa-file',
          // },
          {
            key: 'all-mail',
            path: '/all-mail',
            name: 'Shared:all-mail',
            layout: '/recruiter/mailbox',
            tooltip_target: 'all-mail',
            emailIntegrationCondition: true,
            icon: 'fas fa-envelope',
          },
          {
            key: 'important',
            path: '/important',
            name: 'Shared:important',
            layout: '/recruiter/mailbox',
            tooltip_target: 'important',
            emailIntegrationCondition: true,
            icon: 'fas fa-tag',
          },
          {
            key: 'starred',
            path: '/starred',
            name: 'Shared:starred',
            layout: '/recruiter/mailbox',
            tooltip_target: 'starred',
            emailIntegrationCondition: true,
            icon: 'fas fa-star',
          },
          {
            key: 'spam',
            path: '/spam',
            name: 'Shared:spam',
            layout: '/recruiter/mailbox',
            tooltip_target: 'spam',
            emailIntegrationCondition: true,
            icon: 'fas fa-exclamation',
          },
          {
            key: 'trash',
            path: '/trash',
            name: 'Shared:trash',
            layout: '/recruiter/mailbox',
            tooltip_target: 'trash',
            emailIntegrationCondition: true,
            icon: 'fas fa-trash',
          },
        ],
      },
      {
        path: '/calendar',
        name: 'Shared:calendar',
        icon: 'far fa-calendar-alt',
        layout: '/recruiter/mailbox',
        tooltip_target: 'calendar',
        emailIntegrationCondition: true,
        // defaultPermissions: MailboxPermissions,
      },
      {
        path: '/settings',
        name: 'Shared:email-integration-setting',
        icon: 'fas fa-cog',
        layout: '/recruiter/mailbox',
        tooltip_target: 'email_integration_setting',
        // defaultPermissions: MailboxPermissions,
      },
    ],
  },
  {
    key: 'provider',
    collapse: true,
    isBottom: false,
    name: 'Shared:provider',
    icon: 'fas fa-external-link-alt',
    state: 'providerCollapse',
    tooltip_target: 'provider',
    path: '/',
    layout: '/provider/overview',
    visibleFor: ['staging', 'production'],
    visibleUser: ['provider'],
    provider: true,
    member: true,
    views: [
      {
        key: 'overview',
        collapse: true,
        isBottom: true,
        path: '/overview',
        name: 'Shared:overview',
        layout: '/provider',
        tooltip_target: 'overview',
        state: 'providerOverviewCollapse',
        visibleFor: ['staging', 'production'],
        provider: true,
        member: false,
      },
      {
        path: '/profile',
        name: 'Shared:provider-profile',
        layout: '/provider',
        tooltip_target: 'providerProfile',
        provider: true,
        member: true,
      },
      {
        key: 'members',
        path: '/members',
        name: 'Shared:provider-members',
        layout: '/provider',
        tooltip_target: 'providerMembers',
        provider: true,
        member: false,
      },
    ],
  },
  // {
  //   key: 'dataflow',
  //   collapse: true,
  //   isBottom: false,
  //   name: 'Shared:dataflow',
  //   icon: 'fas fa-code-branch',
  //   state: 'dataflowCollapse',
  //   tooltip_target: 'dataflow',
  //   path: '/dataflow',
  //   layout: '/recruiter',
  //   visibleFor: ['staging', 'production'],
  //   views: [
  //     {
  //       key: 'create-dataflow',
  //       path: '/create',
  //       name: 'Shared:create-dataflow',
  //       layout: '/recruiter/dataflow',
  //       tooltip_target: 'create-dataflow',
  //     },
  //     {
  //       path: '/track-cases',
  //       name: 'Shared:track-cases',
  //       layout: '/recruiter/dataflow',
  //       tooltip_target: 'track-cases',
  //     },
  //   ],
  // },
  {
    key: 'announcements',
    path: '/announcements/',
    name: 'Shared:announcements',
    icon: 'fa fa-bullhorn',
    layout: '/recruiter',
    isBottom: true,
  },
];

/**
 * @param key
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to check if the current env has the
 * ability to render component
 */
const getIsActiveByKey = (key) =>
  routes.findIndex((item) => item.key === 'acquisition') !== -1
  && routes
    .find((item) => item.key === key)
    ?.visibleFor.includes(process.env.REACT_APP_ENV);

export const DashboardRouter = () => (
  <Suspense
    fallback={
      <Backdrop className="spinner-wrapper" open>
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
    }
  >
    <Switch>
      <PrivateRoute exact path="/recruiter/overview" component={Overview} />
      {/*<PrivateRoute*/}
      {/*  exact*/}
      {/*  path="/recruiter/integrations"*/}
      {/*  component={Integrations}*/}
      {/*  defaultPermissions={IntegrationsPermissions}*/}
      {/*/>*/}
      <PrivateRoute
        exact
        path="/recruiter/connections"
        component={IntegrationsPage}
        defaultPermissions={IntegrationsPermissions}
      />
      <PrivateRoute
        exact
        path="/recruiter/account-settings"
        component={AccountSettings}
        // defaultPermissions={}
      />
      <PrivateRoute
        exact
        path="/recruiter/company-details"
        component={CompanyDetails}
      />
      {/** Video Assessment */}
      <PrivateRoute
        exact
        path="/recruiter/assessment/create"
        component={createAssessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={CreateAssessmentPermissions.AddEvaSsessApplication.key}
      />
      <PrivateRoute
        strict
        path="/recruiter/assessment/edit/:uuid"
        component={editAssessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={CreateAssessmentPermissions.UpdateEvaSsessApplication.key}
      />
      <PrivateRoute
        exact
        path="/recruiter/assessment/manage/list/:pathParam?"
        component={ManageAssessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={CreateAssessmentPermissions.ViewEvaSsessApplication.key}
      />
      <PrivateRoute
        // strict
        exact
        path="/recruiter/assessment/manage/pipeline/:id/:pathParam?"
        component={Assessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={CreateAssessmentPermissions.ViewEvaSsessApplication.key}
      />
      <PrivateRoute
        // strict
        exact
        path="/recruiter/assessment/manage/videos/:id"
        component={Assessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        // permissionId={ManageAssessmentsPermissions.Video.key}
      />
      <PrivateRoute
        // strict
        exact
        path="/recruiter/assessment/manage/logs/:id"
        component={Assessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={ManageAssessmentsPermissions.ViewLogs.key}
      />
      {/* Template Assessment */}
      <PrivateRoute
        exact
        path="/recruiter/assessment/templates"
        component={TemplatesAssessment}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={EvaSsessTemplatesPermissions.ViewEvaSsessTemplates.key}
      />
      <PrivateRoute
        exact
        path="/recruiter/assessment/template/edit/:uuid"
        component={TemplateForm}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={EvaSsessTemplatesPermissions.UpdateEvaSsessTemplates.key}
      />
      <PrivateRoute
        exact
        path="/recruiter/assessment/template/new"
        component={CreateTemplate}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        permissionId={EvaSsessTemplatesPermissions.AddEvaSsessTemplates.key}
      />

      <PrivateRoute
        path="/recruiter/assessment/shared-profiles/:token"
        component={SharedResumes}
        serviceKey={SubscriptionServicesEnum.EvaSSESS.key}
        defaultPermissions={RMSPermissions}
      />

      {/** ATS */}
      <PrivateRoute
        exact
        path="/recruiter/job/create"
        component={CreateJob}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={CreateAnApplicationPermissions.AddEvaRecApplication.key}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/manage/:pathParam?"
        component={ManageJob}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        defaultPermissions={CreateAnApplicationPermissions}
      />
      <PrivateRoute
        exact
        path="/recruiter/job/manage/edit/:uuid"
        component={EditJob}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={CreateAnApplicationPermissions.UpdateEvaRecApplication.key}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/manage/old-pipeline/:id/:pathParam?"
        component={ManageJobDetail}
        defaultPermissions={CreateAnApplicationPermissions}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        // slugId={CurrentFeatures.questionnaire.permissionsId}
      />
      <PrivateRoute
        exact
        path="/recruiter/job/manage/pipeline/:id/:pathParam?"
        component={PipelineManagement}
        defaultPermissions={CreateAnApplicationPermissions}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        // slugId={CurrentFeatures.questionnaire.permissionsId}
      />
      <PrivateRoute
        exact
        path="/recruiter/job/manage/logs/:id"
        component={ManageJobDetail}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={ManageApplicationsPermissions.ViewLogs.key}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/share"
        component={ShareApplicant}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={ManageApplicationsPermissions.ShareEvaRecApplication.key}
      />

      <PrivateRoute
        path="/recruiter/ats/shared-profiles/:token"
        component={SharedResumes}
        defaultPermissions={RMSPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/search-database"
        component={SearchDatabase}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        defaultPermissions={SearchDatabasePermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/initial-approval"
        component={InitialApprovalPage}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        defaultPermissions={PreScreeningApprovalPermissions}
      />
      <PrivateRoute
        exact
        path="/recruiter/job/initial-approval/pre-screening-approval"
        component={PreScreeningApprovalPage}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={PreScreeningApprovalPermissions.SuperPreScreening.key}
      />
      <PrivateRoute
        exact
        path="/recruiter/job/initial-approval/pre-screening-approval/add-approval"
        component={PreScreeningApprovalManagement}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={PreScreeningApprovalPermissions.AddPreScreening.key}
      />

      {/* <PrivateRoute */}
      {/*  exact */}
      {/*  path="/recruiter/employees" */}
      {/*  component={EmployeesPage} */}
      {/*  // permissionId= {..key} */}
      {/* /> */}

      <PrivateRoute
        exact
        path="/recruiter/job/search-database/profile/:uuid"
        component={ApplicantProfile}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={SearchDatabasePermissions.ViewCvCandidate.key}
      />

      <PrivateRoute
        path="/recruiter/ats/shared-database-profiles/:token"
        component={SharedResumes}
        defaultPermissions={RMSPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/templates"
        component={TemplatesJob}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        defaultPermissions={EvaRecTemplatesPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/template/edit/:uuid"
        component={EditTemplateWrapper}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={EvaRecTemplatesPermissions.UpdateTemplate.key}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/template/new"
        component={CreateTemplateWrapper}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        permissionId={EvaRecTemplatesPermissions.AddTemplate.key}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/pipelines"
        component={PipelinesPage}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        defaultPermissions={PipelinePermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/job/rms"
        component={ResumeList}
        serviceKey={SubscriptionServicesEnum.EvaRec.key}
        defaultPermissions={RMSPermissions}
      />

      {/* <PrivateRoute */}
      {/*  exact */}
      {/*  path="/recruiter/job/dispatcher-process" */}
      {/*  component={DispatcherProcessPage} */}
      {/*  permissionId= {..key}  */}
      {/* /> */}

      <PrivateRoute
        exact
        path="/recruiter/rms/shared-profiles/:token"
        component={SharedResumes}
        defaultPermissions={RMSPermissions}
      />
      <PrivateRoute
        exact
        path="/recruiter/job/visa-mass-allocation"
        component={VisaMassAllocationPage}
        permissionId={EvaRecManageVisaPermissions.MassAllocation.key}
      />
      {/* <-- Recruiter Preference --> */}
      <PrivateRoute
        path="/recruiter/recruiter-preference/pipeline"
        component={Pipeline}
        slugId={CurrentFeatures.pipeline.permissionsId}
        defaultPermissions={PipelinesPermissions}
      />
      <PrivateRoute
        strict
        path="/recruiter/recruiter-preference/email-templates/:pathParam?"
        component={EmailTemplates}
        defaultPermissions={EmailTemplatesPermissions}
      />
      <PrivateRoute
        path="/recruiter/recruiter-preference/team"
        component={TeamMember}
        defaultPermissions={ManageTeamsPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/form-builder"
        component={TemplatesPage}
        // slugId={CurrentFeatures.offer.permissionsId}
        defaultPermissions={{
          ...ManageFormBuilderTemplatesPermissions,
          ...ManageFormBuilderTypesPermissions,
        }}
      />
      <PrivateRoute
        exact
        path="/recruiter/recruiter-preference/permissions"
        component={AppPermissionsTable}
        slugId={CurrentFeatures.requirement.permissionsId}
        defaultPermissions={RequirementsPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/recruiter-preference/questionnaire"
        component={Questionnaire}
        slugId={CurrentFeatures.questionnaire.permissionsId}
        defaultPermissions={QuestionnairesPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/recruiter-preference/questionnaire/add"
        component={AddQuestionnaireWrapper}
        slugId={CurrentFeatures.questionnaire.permissionsId}
        permissionId={QuestionnairesPermissions.AddQuestionnaires.key}
      />
      <PrivateRoute
        exact
        path="/recruiter/recruiter-preference/questionnaire/edit/:qid?"
        component={AddQuestionnaireWrapper}
        slugId={CurrentFeatures.questionnaire.permissionsId}
        permissionId={QuestionnairesPermissions.UpdateQuestionnaires.key}
      />

      {/* <!-- Recruiter Preference --> */}
      {/* <!-- Recruiter Preference --> */}
      {/* <- Evaluation -> */}
      <PrivateRoute
        exact
        path="/recruiter/recruiter-preference/evaluation/add"
        component={AddEvaluation}
        slugId={CurrentFeatures.evaluation.permissionsId}
        permissionId={EvaluationsPermissions.AddNewEvaluationForms.key}
      />
      <PrivateRoute
        path="/recruiter/recruiter-preference/evaluation/:uuid"
        component={AddEvaluation}
        slugId={CurrentFeatures.evaluation.permissionsId}
        permissionId={EvaluationsPermissions.UpdateEvaluationForms.key}
      />
      <PrivateRoute
        exact
        path="/recruiter/recruiter-preference/evaluation"
        component={Evaluations}
        slugId={CurrentFeatures.evaluation.permissionsId}
        defaultPermissions={EvaluationsPermissions}
      />
      {/* <-Scorecard -> */}
      <PrivateRoute
        path="/recruiter/recruiter-preference/scorecard"
        component={Scorecard}
      />
      {/* New Career Branding */}
      <PrivateRoute
        strict
        // path="/recruiter/old/eva-brand" salahat update
        path="/recruiter/evabrand"
        component={CareerBrandingWrapper}
        defaultPermissions={EvaBrandPermissions}
      />
      <PrivateRoute
        strict
        path="/recruiter/eva-brand"
        component={EvaBrandPage}
        defaultPermissions={EvaBrandPermissions}
      />
      {/* EVA-MEET */}
      <PrivateRoute
        strict
        path="/recruiter/meetings"
        component={MeetingsWrapper}
        defaultPermissions={EvaMeetPermissions}
      />

      <PrivateRoute
        exact
        path="/recruiter/previous_meeting/:id"
        component={RecordedVideo}
        permissionId={EvaMeetPermissions.ViewPreviouslyRecordedVideoInEvaMeet.key}
      />

      {/* Analytics */}
      <PrivateRoute
        strict
        path="/recruiter/analytics"
        component={AnalyticsPage}
        permissionId={NewAnalyticsPermissions.SuperAnalytics.key}
      />
      {getIsActiveByKey('acquisition') && (
        <PrivateRoute
          strict
          path="/recruiter/acquisition/campaigns"
          component={CampaignPage}
          defaultPermissions={CampaignsPermissions}
        />
      )}
      {getIsActiveByKey('acquisition') && (
        <PrivateRoute
          strict
          path="/recruiter/acquisition/contracts"
          component={ContractsPage}
          // defaultPermissions={CampaignsPermissions}
        />
      )}
      {/*{getIsActiveByKey('acquisition') && (*/}
      {/*  <PrivateRoute*/}
      {/*    strict*/}
      {/*    path="/recruiter/acquisition/vonq-campaigns"*/}
      {/*    component={VonqCampaignsPage} */}
      {/*  />*/}
      {/*)}*/}
      {getIsActiveByKey('acquisition') && (
        <PrivateRoute
          strict
          path="/recruiter/acquisition/buy-channels-credit"
          component={BuyChannelsCreditPage}
          defaultPermissions={BuyChannelsCreditPermissions}
        />
      )}
      {getIsActiveByKey('acquisition') && (
        <PrivateRoute
          strict
          path="/recruiter/acquisition/my-channels-credit"
          component={MyChannelsCreditPage}
          defaultPermissions={MyChannelsCreditPermissions}
        />
      )}
      {getIsActiveByKey('administration') && (
        <PrivateRoute strict path="/setups" component={SetupsPage} />
      )}

      {getIsActiveByKey('onboarding') && (
        <PrivateRoute strict path="/onboarding" component={OnboardingPage} />
      )}

      {getIsActiveByKey('visa') && (
        <PrivateRoute strict path="/visa" component={VisaPage} />
      )}

      {getIsActiveByKey('assessment-test') && (
        <PrivateRoute
          strict
          path="/recruiter/assessment-test"
          component={AssessmentTestPage}
        />
      )}
      {/*{getIsActiveByKey('invitations') && (*/}
      {/*  <PrivateRoute*/}
      {/*    exact*/}
      {/*    path="/invitations"*/}
      {/*    component={InvitationsPage}*/}
      {/*    // defaultPermissions={PipelinePermissions}*/}
      {/*  />*/}
      {/*)}*/}
      {/* Billing */}
      {/*<PrivateRoute*/}
      {/*  exact*/}
      {/*  defaultPermissions={PlansPermissions}*/}
      {/*  component={BillingPlansView}*/}
      {/*  path="/recruiter/billing/billing-plans"*/}
      {/*/>*/}
      {/*<PrivateRoute*/}
      {/*  exact*/}
      {/*  defaultPermissions={BillingHistoryPermissions}*/}
      {/*  component={BillingHistoryView}*/}
      {/*  path="/recruiter/billing/billing-history"*/}
      {/*/>*/}
      {/*<PrivateRoute*/}
      {/*  exact*/}
      {/*  defaultPermissions={SubscriptionSettingsPermissions}*/}
      {/*  component={CurrentBillingInfoView}*/}
      {/*  path="/recruiter/billing/subscription-settings"*/}
      {/*/>*/}

      {/* <PrivateRoute path="/recruiter/*" component={Overview} /> */}
      {/* Static Pages */}
      <PrivateRoute exact path="/recruiter/401" component={Error401} />
      <PrivateRoute
        exact
        path="/recruiter/elevatus/components"
        component={ElevatusComponent}
      />
      <PrivateRoute
        exact
        path="/recruiter/no-subscriptions"
        component={NoSubscriptionView}
      />

      <PrivateRoute
        exact
        path="/recruiter/mailbox"
        component={Mailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/inbox"
        component={Mailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/sent"
        component={SentMailbox}
        permissionCondition
      />
      {/*<PrivateRoute*/}
      {/*  exact*/}
      {/*  path="/recruiter/mailbox/drafts"*/}
      {/*  component={DraftsMailbox}*/}
      {/*  permissionCondition*/}
      {/*/>*/}
      <PrivateRoute
        exact
        path="/recruiter/mailbox/all-mail"
        component={AllMailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/important"
        component={ImportantMailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/starred"
        component={StarredMailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/spam"
        component={SpamMailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/trash"
        component={TrashMailbox}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/calendar"
        component={EmailsIntegrationCalendar}
        permissionCondition
      />
      <PrivateRoute
        exact
        path="/recruiter/mailbox/settings"
        component={EmailsIntegrationSettings}
      />
      <PrivateRoute exact path="/recruiter/dataflow" component={DataFlowPage} />
      <PrivateRoute
        exact
        path="/recruiter/dataflow/create"
        component={DataFlowPage}
      />
      <PrivateRoute
        exact
        path="/recruiter/dataflow/track-cases"
        component={DataFlowTablePage}
      />
      <PrivateRoute
        exact
        path="/provider/overview"
        component={ProviderPage}
        externalUserType={['admin']}
      />
      <PrivateRoute
        exact
        path="/provider/profile"
        component={ProviderProfilePage}
        externalUserType={['admin', 'member']}
      />
      <PrivateRoute
        exact
        path="/provider/members"
        component={ProviderMembersPage}
        externalUserType={['admin']}
      />
      <PrivateRoute exact path="/recruiter/dataflow" component={DataFlowPage} />
      <PrivateRoute
        exact
        path="/recruiter/dataflow/track-cases"
        component={DataFlowTablePage}
      />
      <PrivateRoute
        exact
        path="/recruiter/announcements"
        component={AnnouncementsPage}
      />
      {/**
       * @note make sure to add any external routing here also specially the
       * one that include some of this routing paths like recruiter/form-builder
       */}
      {!GetIsExternalRoutesHandler() && (
        <PrivateRoute
          path="**"
          render={() => <Redirect to="/recruiter/overview" />}
        />
      )}
    </Switch>
  </Suspense>
);

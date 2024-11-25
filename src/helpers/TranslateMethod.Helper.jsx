/* eslint-disable max-len */
import i18next, { changeLanguage, init } from 'i18next';
import { GlobalRerender } from './Middleware.Helper';
// Start Layouts Common (shared)
import SharedEn from '../assets/I18n/en.json';
import SharedAr from '../assets/I18n/ar.json';
import SharedTr from '../assets/I18n/tr.json';
import SharedRo from '../assets/I18n/ro.json';
import SharedEl from '../assets/I18n/el.json';
import SharedFr from '../assets/I18n/fr.json';
import SharedSp from '../assets/I18n/sp.json';
import SharedDu from '../assets/I18n/du.json';
import SharedDe from '../assets/I18n/de.json';

// End Layouts Common (shared)
// Start Acquisitions Module
import CampaignPageEn from '../pages/acquisition/campaigns/i18n/en.json';
import CampaignPageAr from '../pages/acquisition/campaigns/i18n/ar.json';
import CampaignPageTr from '../pages/acquisition/campaigns/i18n/tr.json';
import CampaignPageRo from '../pages/acquisition/campaigns/i18n/ro.json';
import CampaignPageEl from '../pages/acquisition/campaigns/i18n/el.json';
import CampaignPageFr from '../pages/acquisition/campaigns/i18n/fr.json';
import CampaignPageSp from '../pages/acquisition/campaigns/i18n/sp.json';
import CampaignPageDu from '../pages/acquisition/campaigns/i18n/du.json';
import CampaignPageDe from '../pages/acquisition/campaigns/i18n/de.json';

import BuyChannelsCreditPageEn from '../pages/acquisition/buy-channels-credit/i18n/en.json';
import BuyChannelsCreditPageAr from '../pages/acquisition/buy-channels-credit/i18n/ar.json';
import BuyChannelsCreditPageTr from '../pages/acquisition/buy-channels-credit/i18n/tr.json';
import BuyChannelsCreditPageRo from '../pages/acquisition/buy-channels-credit/i18n/ro.json';
import BuyChannelsCreditPageEl from '../pages/acquisition/buy-channels-credit/i18n/el.json';
import BuyChannelsCreditPageFr from '../pages/acquisition/buy-channels-credit/i18n/fr.json';
import BuyChannelsCreditPageSp from '../pages/acquisition/buy-channels-credit/i18n/sp.json';
import BuyChannelsCreditPageDu from '../pages/acquisition/buy-channels-credit/i18n/du.json';
import BuyChannelsCreditPageDe from '../pages/acquisition/buy-channels-credit/i18n/de.json';

import MyChannelsCreditPageEn from '../pages/acquisition/my-channels-credit/i18n/en.json';
import MyChannelsCreditPageAr from '../pages/acquisition/my-channels-credit/i18n/ar.json';
import MyChannelsCreditPageTr from '../pages/acquisition/my-channels-credit/i18n/tr.json';
import MyChannelsCreditPageRo from '../pages/acquisition/my-channels-credit/i18n/ro.json';
import MyChannelsCreditPageEl from '../pages/acquisition/my-channels-credit/i18n/el.json';
import MyChannelsCreditPageFr from '../pages/acquisition/my-channels-credit/i18n/fr.json';
import MyChannelsCreditPageSp from '../pages/acquisition/my-channels-credit/i18n/sp.json';
import MyChannelsCreditPageDu from '../pages/acquisition/my-channels-credit/i18n/du.json';
import MyChannelsCreditPageDe from '../pages/acquisition/my-channels-credit/i18n/de.json';

import ContractsPageEn from '../pages/acquisition/contracts/i18n/en.json';
import ContractsPageAr from '../pages/acquisition/contracts/i18n/ar.json';
import ContractsPageTr from '../pages/acquisition/contracts/i18n/tr.json';
import ContractsPageRo from '../pages/acquisition/contracts/i18n/ro.json';
import ContractsPageEl from '../pages/acquisition/contracts/i18n/el.json';
import ContractsPageFr from '../pages/acquisition/contracts/i18n/fr.json';
import ContractsPageSp from '../pages/acquisition/contracts/i18n/sp.json';
import ContractsPageDu from '../pages/acquisition/contracts/i18n/du.json';
import ContractsPageDe from '../pages/acquisition/contracts/i18n/de.json';
// End Acquisitions Module

import VonqCampaignsPageEn from '../pages/acquisition/vonq-campaigns/i18n/en.json';
import VonqCampaignsPageAr from '../pages/acquisition/vonq-campaigns/i18n/ar.json';
import VonqCampaignsPageTr from '../pages/acquisition/vonq-campaigns/i18n/tr.json';
import VonqCampaignsPageRo from '../pages/acquisition/vonq-campaigns/i18n/ro.json';
import VonqCampaignsPageEl from '../pages/acquisition/vonq-campaigns/i18n/el.json';
import VonqCampaignsPageFr from '../pages/acquisition/vonq-campaigns/i18n/fr.json';
import VonqCampaignsPageSp from '../pages/acquisition/vonq-campaigns/i18n/sp.json';
import VonqCampaignsPageDu from '../pages/acquisition/vonq-campaigns/i18n/du.json';
import VonqCampaignsPageDe from '../pages/acquisition/vonq-campaigns/i18n/de.json';
// End VonqCampaigns Module

// Start Pecruiter Preferences Module
import EmailTemplatesPageEn from '../pages/recruiter-preference/EmailTemplates/I18n/en.json';
import EmailTemplatesPageAr from '../pages/recruiter-preference/EmailTemplates/I18n/ar.json';
import EmailTemplatesPageTr from '../pages/recruiter-preference/EmailTemplates/I18n/tr.json';
import EmailTemplatesPageRo from '../pages/recruiter-preference/EmailTemplates/I18n/ro.json';
import EmailTemplatesPageEl from '../pages/recruiter-preference/EmailTemplates/I18n/el.json';
import EmailTemplatesPageFr from '../pages/recruiter-preference/EmailTemplates/I18n/fr.json';
import EmailTemplatesPageSp from '../pages/recruiter-preference/EmailTemplates/I18n/sp.json';
import EmailTemplatesPageDu from '../pages/recruiter-preference/EmailTemplates/I18n/du.json';
import EmailTemplatesPageDe from '../pages/recruiter-preference/EmailTemplates/I18n/de.json';

import QuestionnairePageEn from '../pages/recruiter-preference/Questionnaire/I18n/en.json';
import QuestionnairePageAr from '../pages/recruiter-preference/Questionnaire/I18n/ar.json';
import QuestionnairePageTr from '../pages/recruiter-preference/Questionnaire/I18n/tr.json';
import QuestionnairePageRo from '../pages/recruiter-preference/Questionnaire/I18n/ro.json';
import QuestionnairePageEl from '../pages/recruiter-preference/Questionnaire/I18n/el.json';
import QuestionnairePageFr from '../pages/recruiter-preference/Questionnaire/I18n/fr.json';
import QuestionnairePageSp from '../pages/recruiter-preference/Questionnaire/I18n/sp.json';
import QuestionnairePageDu from '../pages/recruiter-preference/Questionnaire/I18n/du.json';
import QuestionnairePageDe from '../pages/recruiter-preference/Questionnaire/I18n/de.json';
// End Pecruiter Preferences Module

// Start Eva-SSESS Module
import EvaSSESSEn from '../pages/evassess/i18n/en.json';
import EvaSSESSAr from '../pages/evassess/i18n/ar.json';
import EvaSSESSTr from '../pages/evassess/i18n/tr.json';
import EvaSSESSRo from '../pages/evassess/i18n/ro.json';
import EvaSSESSEl from '../pages/evassess/i18n/el.json';
import EvaSSESSFr from '../pages/evassess/i18n/fr.json';
import EvaSSESSSp from '../pages/evassess/i18n/sp.json';
import EvaSSESSDu from '../pages/evassess/i18n/du.json';
import EvaSSESSDe from '../pages/evassess/i18n/de.json';

import EvaSSESSPipelineEn from '../pages/evassess/pipeline/i18n/en.json';
import EvaSSESSPipelineAr from '../pages/evassess/pipeline/i18n/ar.json';
import EvaSSESSPipelineTr from '../pages/evassess/pipeline/i18n/tr.json';
import EvaSSESSPipelineRo from '../pages/evassess/pipeline/i18n/ro.json';
import EvaSSESSPipelineEl from '../pages/evassess/pipeline/i18n/el.json';
import EvaSSESSPipelineFr from '../pages/evassess/pipeline/i18n/fr.json';
import EvaSSESSPipelineSp from '../pages/evassess/pipeline/i18n/sp.json';
import EvaSSESSPipelineDu from '../pages/evassess/pipeline/i18n/du.json';
import EvaSSESSPipelineDe from '../pages/evassess/pipeline/i18n/de.json';

import EvaSSESSTemplatesEn from '../pages/evassess/templates/i18n/en.json';
import EvaSSESSTemplatesAr from '../pages/evassess/templates/i18n/ar.json';
import EvaSSESSTemplatesTr from '../pages/evassess/templates/i18n/tr.json';
import EvaSSESSTemplatesRo from '../pages/evassess/templates/i18n/ro.json';
import EvaSSESSTemplatesEl from '../pages/evassess/templates/i18n/el.json';
import EvaSSESSTemplatesFr from '../pages/evassess/templates/i18n/fr.json';
import EvaSSESSTemplatesSp from '../pages/evassess/templates/i18n/sp.json';
import EvaSSESSTemplatesDu from '../pages/evassess/templates/i18n/du.json';
import EvaSSESSTemplatesDe from '../pages/evassess/templates/i18n/de.json';
// End Eva-SSESS Module

// Start Eva-Rec Module
import EvarecCandidateModelEn from '../components/Views/CandidateModals/evarecCandidateModal/I18n/en.json';
import EvarecCandidateModelAr from '../components/Views/CandidateModals/evarecCandidateModal/I18n/ar.json';
import EvarecCandidateModelTr from '../components/Views/CandidateModals/evarecCandidateModal/I18n/tr.json';
import EvarecCandidateModelRo from '../components/Views/CandidateModals/evarecCandidateModal/I18n/ro.json';
import EvarecCandidateModelEl from '../components/Views/CandidateModals/evarecCandidateModal/I18n/el.json';
import EvarecCandidateModelFr from '../components/Views/CandidateModals/evarecCandidateModal/I18n/fr.json';
import EvarecCandidateModelSp from '../components/Views/CandidateModals/evarecCandidateModal/I18n/sp.json';
import EvarecCandidateModelDu from '../components/Views/CandidateModals/evarecCandidateModal/I18n/du.json';
import EvarecCandidateModelDe from '../components/Views/CandidateModals/evarecCandidateModal/I18n/de.json';
// End Eva-Rec Module

// Start Eva-Rec Create Job
import CreateJobEn from '../pages/evarec/create/I18n/en.json';
import CreateJobAr from '../pages/evarec/create/I18n/ar.json';
import CreateJobTr from '../pages/evarec/create/I18n/tr.json';
import CreateJobRo from '../pages/evarec/create/I18n/ro.json';
import CreateJobEl from '../pages/evarec/create/I18n/el.json';
import CreateJobFr from '../pages/evarec/create/I18n/fr.json';
import CreateJobSp from '../pages/evarec/create/I18n/sp.json';
import CreateJobDu from '../pages/evarec/create/I18n/du.json';
import CreateJobDe from '../pages/evarec/create/I18n/de.json';
// End Eva-Rec Create Job

// Start Eva-Rec Template
import EvarecRecTemplateEn from '../pages/evarec/templates/I18n/en.json';
import EvarecRecTemplateAr from '../pages/evarec/templates/I18n/ar.json';
import EvarecRecTemplateTr from '../pages/evarec/templates/I18n/tr.json';
import EvarecRecTemplateRo from '../pages/evarec/templates/I18n/ro.json';
import EvarecRecTemplateEl from '../pages/evarec/templates/I18n/el.json';
import EvarecRecTemplateFr from '../pages/evarec/templates/I18n/fr.json';
import EvarecRecTemplateSp from '../pages/evarec/templates/I18n/sp.json';
import EvarecRecTemplateDu from '../pages/evarec/templates/I18n/du.json';
import EvarecRecTemplateDe from '../pages/evarec/templates/I18n/de.json';
// End Eva-Rec Template

// Start Eva-Rec Approve Applicants
import InitialApprovalEn from '../pages/evarec/initial-approval/i18n/en.json';
import InitialApprovalAr from '../pages/evarec/initial-approval/i18n/ar.json';
import InitialApprovalTr from '../pages/evarec/initial-approval/i18n/tr.json';
import InitialApprovalRo from '../pages/evarec/initial-approval/i18n/ro.json';
import InitialApprovalEl from '../pages/evarec/initial-approval/i18n/el.json';
import InitialApprovalFr from '../pages/evarec/initial-approval/i18n/fr.json';
import InitialApprovalSp from '../pages/evarec/initial-approval/i18n/sp.json';
import InitialApprovalDu from '../pages/evarec/initial-approval/i18n/du.json';
import InitialApprovalDe from '../pages/evarec/initial-approval/i18n/de.json';
// End Eva-Rec Approve Applicants

// Start Eva-Rec Search
import EvarecRecSearchEn from '../pages/evarec/search/I18n/en.json';
import EvarecRecSearchAr from '../pages/evarec/search/I18n/ar.json';
import EvarecRecSearchTr from '../pages/evarec/search/I18n/tr.json';
import EvarecRecSearchRo from '../pages/evarec/search/I18n/ro.json';
import EvarecRecSearchEl from '../pages/evarec/search/I18n/el.json';
import EvarecRecSearchFr from '../pages/evarec/search/I18n/fr.json';
import EvarecRecSearchSp from '../pages/evarec/search/I18n/sp.json';
import EvarecRecSearchDu from '../pages/evarec/search/I18n/du.json';
import EvarecRecSearchDe from '../pages/evarec/search/I18n/de.json';
// End Eva-Rec Search

// Start Eva-Rec RMS
import EvarecRecRmsEn from '../pages/evarec/rms/I18n/en.json';
import EvarecRecRmsAr from '../pages/evarec/rms/I18n/ar.json';
import EvarecRecRmsTr from '../pages/evarec/rms/I18n/tr.json';
import EvarecRecRmsRo from '../pages/evarec/rms/I18n/ro.json';
import EvarecRecRmsEl from '../pages/evarec/rms/I18n/el.json';
import EvarecRecRmsFr from '../pages/evarec/rms/I18n/fr.json';
import EvarecRecRmsSp from '../pages/evarec/rms/I18n/sp.json';
import EvarecRecRmsDu from '../pages/evarec/rms/I18n/du.json';
import EvarecRecRmsDe from '../pages/evarec/rms/I18n/de.json';
// End Eva-Rec RMS

// Start Eva-Rec Manage
import EvarecRecManageEn from '../pages/evarec/manage/I18n/en.json';
import EvarecRecManageAr from '../pages/evarec/manage/I18n/ar.json';
import EvarecRecManageTr from '../pages/evarec/manage/I18n/tr.json';
// import EvarecRecManageRo from '../pages/evarec/manage/I18n/ro.json';
import EvarecRecManageEl from '../pages/evarec/manage/I18n/el.json';
import EvarecRecManageFr from '../pages/evarec/manage/I18n/fr.json';
import EvarecRecManageSp from '../pages/evarec/manage/I18n/sp.json';
import EvarecRecManageDu from '../pages/evarec/manage/I18n/du.json';
import EvarecRecManageDe from '../pages/evarec/manage/I18n/de.json';
// End Eva-Rec Manage
// Start Eva-Rec dispatcher process
import DispatcherProcessPageEn from '../pages/evarec/dispatcher-process/i18n/en.json';
import DispatcherProcessPageAr from '../pages/evarec/dispatcher-process/i18n/ar.json';
import DispatcherProcessPageTr from '../pages/evarec/dispatcher-process/i18n/tr.json';
import DispatcherProcessPageRo from '../pages/evarec/dispatcher-process/i18n/ro.json';
import DispatcherProcessPageEL from '../pages/evarec/dispatcher-process/i18n/el.json';
import DispatcherProcessPageFr from '../pages/evarec/dispatcher-process/i18n/fr.json';
import DispatcherProcessPageSp from '../pages/evarec/dispatcher-process/i18n/sp.json';
import DispatcherProcessPageDu from '../pages/evarec/dispatcher-process/i18n/du.json';
import DispatcherProcessPageDe from '../pages/evarec/dispatcher-process/i18n/de.json';
// End Eva-Rec dispatcher process

// Start Eva-Rec Pipelines
import EvaRecPipelinesEn from '../pages/evarec/pipelines/i18n/en.json';
import EvaRecPipelinesAr from '../pages/evarec/pipelines/i18n/ar.json';
import EvaRecPipelinesTr from '../pages/evarec/pipelines/i18n/tr.json';
import EvaRecPipelinesRo from '../pages/evarec/pipelines/i18n/ro.json';
import EvaRecPipelinesEl from '../pages/evarec/pipelines/i18n/el.json';
import EvaRecPipelinesFr from '../pages/evarec/pipelines/i18n/fr.json';
import EvaRecPipelinesSp from '../pages/evarec/pipelines/i18n/sp.json';
import EvaRecPipelinesDu from '../pages/evarec/pipelines/i18n/du.json';
import EvaRecPipelinesDe from '../pages/evarec/pipelines/i18n/de.json';
// End Eva-Rec Pipelines

// Start Eva-Rec Modals
import EvarecRecModalsEn from '../pages/evarec/I18n/en.json';
import EvarecRecModalsAr from '../pages/evarec/I18n/ar.json';
import EvarecRecModalsTr from '../pages/evarec/I18n/tr.json';
import EvarecRecModalsRo from '../pages/evarec/I18n/ro.json';
import EvarecRecModalsEl from '../pages/evarec/I18n/el.json';
import EvarecRecModalsFr from '../pages/evarec/I18n/fr.json';
import EvarecRecModalsSp from '../pages/evarec/I18n/sp.json';
import EvarecRecModalsDu from '../pages/evarec/I18n/du.json';
import EvarecRecModalsDe from '../pages/evarec/I18n/de.json';
// End Eva-Rec Modals

// Start Overview
import OverviewEn from '../pages/overview/I18n/en.json';
import OverviewAr from '../pages/overview/I18n/ar.json';
import OverviewTr from '../pages/overview/I18n/tr.json';
import OverviewRo from '../pages/overview/I18n/ro.json';
import OverviewEl from '../pages/overview/I18n/el.json';
import OverviewFr from '../pages/overview/I18n/fr.json';
import OverviewSp from '../pages/overview/I18n/sp.json';
import OverviewDu from '../pages/overview/I18n/du.json';
import OverviewDe from '../pages/overview/I18n/de.json';
// End Overview

// Start EVA-MEET
import EvaMeetEn from '../pages/evameet/i18n/en.json';
import EvaMeetAr from '../pages/evameet/i18n/ar.json';
import EvaMeetTr from '../pages/evameet/i18n/tr.json';
import EvaMeetRo from '../pages/evameet/i18n/ro.json';
import EvaMeetEl from '../pages/evameet/i18n/el.json';
import EvaMeetFr from '../pages/evameet/i18n/fr.json';
import EvaMeetSp from '../pages/evameet/i18n/sp.json';
import EvaMeetDu from '../pages/evameet/i18n/du.json';
import EvaMeetDe from '../pages/evameet/i18n/de.json';
// End EVA-MEET

// Start EVA-BRAND
import EvaBrandEn from '../pages/evabrand/i18n/en.json';
import EvaBrandAr from '../pages/evabrand/i18n/ar.json';
import EvaBrandTr from '../pages/evabrand/i18n/tr.json';
import EvaBrandRo from '../pages/evabrand/i18n/ro.json';
import EvaBrandEl from '../pages/evabrand/i18n/el.json';
import EvaBrandFr from '../pages/evabrand/i18n/fr.json';
import EvaBrandSp from '../pages/evabrand/i18n/sp.json';
import EvaBrandDu from '../pages/evabrand/i18n/du.json';
import EvaBrandDe from '../pages/evabrand/i18n/de.json';
// End EVA-BRAND

// Start Analytics
import AnalyticsEn from '../pages/analytics/i18n/en.json';
import AnalyticsAr from '../pages/analytics/i18n/ar.json';
import AnalyticsTr from '../pages/analytics/i18n/tr.json';
import AnalyticsRo from '../pages/analytics/i18n/ro.json';
import AnalyticsEl from '../pages/analytics/i18n/el.json';
import AnalyticsFr from '../pages/analytics/i18n/fr.json';
import AnalyticsSp from '../pages/analytics/i18n/sp.json';
import AnalyticsDu from '../pages/analytics/i18n/du.json';
import AnalyticsDe from '../pages/analytics/i18n/de.json';
// End Analytics

// Start Recruiter Preferences
import RecruiterPreferencesEn from '../pages/recruiter-preference/I18n/en.json';
import RecruiterPreferencesAr from '../pages/recruiter-preference/I18n/ar.json';
import RecruiterPreferencesTr from '../pages/recruiter-preference/I18n/tr.json';
import RecruiterPreferencesRo from '../pages/recruiter-preference/I18n/ro.json';
import RecruiterPreferencesEl from '../pages/recruiter-preference/I18n/el.json';
import RecruiterPreferencesFr from '../pages/recruiter-preference/I18n/fr.json';
import RecruiterPreferencesSp from '../pages/recruiter-preference/I18n/sp.json';
import RecruiterPreferencesDu from '../pages/recruiter-preference/I18n/du.json';
import RecruiterPreferencesDe from '../pages/recruiter-preference/I18n/de.json';
// End Recruiter Preferences

// Start Billing
import BillingEn from '../pages/billing/i18n/en.json';
import BillingAr from '../pages/billing/i18n/ar.json';
import BillingTr from '../pages/billing/i18n/tr.json';
import BillingRo from '../pages/billing/i18n/ro.json';
import BillingEl from '../pages/billing/i18n/el.json';
import BillingFr from '../pages/billing/i18n/fr.json';
import BillingSp from '../pages/billing/i18n/sp.json';
import BillingDu from '../pages/billing/i18n/du.json';
import BillingDe from '../pages/billing/i18n/de.json';
// End Billing

// Start Visa
import VisaPageEn from '../pages/visa/i18n/en.json';
import VisaPageAr from '../pages/visa/i18n/ar.json';
import VisaPageTr from '../pages/visa/i18n/tr.json';
import VisaPageRo from '../pages/visa/i18n/ro.json';
import VisaPageEl from '../pages/visa/i18n/el.json';
import VisaPageFr from '../pages/visa/i18n/fr.json';
import VisaPageSp from '../pages/visa/i18n/sp.json';
import VisaPageDu from '../pages/visa/i18n/du.json';
import VisaPageDe from '../pages/visa/i18n/de.json';
// End Visa

// Start Onboarding
import OnboardingPageEn from '../pages/onboarding/i18n/en.json';
import OnboardingPageAr from '../pages/onboarding/i18n/ar.json';
import OnboardingPageTr from '../pages/onboarding/i18n/tr.json';
import OnboardingPageRo from '../pages/onboarding/i18n/ro.json';
import OnboardingPageEl from '../pages/onboarding/i18n/el.json';
import OnboardingPageFr from '../pages/onboarding/i18n/fr.json';
import OnboardingPageSp from '../pages/onboarding/i18n/sp.json';
import OnboardingPageDu from '../pages/onboarding/i18n/du.json';
import OnboardingPageDe from '../pages/onboarding/i18n/de.json';
// End Onboarding

// Start Setups
import SetupsEn from '../pages/setups/i18n/en.json';
import SetupsAr from '../pages/setups/i18n/ar.json';
import SetupsTr from '../pages/setups/i18n/tr.json';
import SetupsRo from '../pages/setups/i18n/ro.json';
import SetupsEl from '../pages/setups/i18n/el.json';
import SetupsFr from '../pages/setups/i18n/fr.json';
import SetupsSp from '../pages/setups/i18n/sp.json';
import SetupsDu from '../pages/setups/i18n/du.json';
import SetupsDe from '../pages/setups/i18n/de.json';
// End Setups
// Start Assessment Test
import AssessmentTestEn from '../pages/assessment-test/i18n/en.json';
import AssessmentTestAr from '../pages/assessment-test/i18n/ar.json';
import AssessmentTestTr from '../pages/assessment-test/i18n/tr.json';
import AssessmentTestRo from '../pages/assessment-test/i18n/ro.json';
import AssessmentTestEl from '../pages/assessment-test/i18n/el.json';
import AssessmentTestFr from '../pages/assessment-test/i18n/fr.json';
import AssessmentTestSp from '../pages/assessment-test/i18n/sp.json';
import AssessmentTestDu from '../pages/assessment-test/i18n/du.json';
import AssessmentTestDe from '../pages/assessment-test/i18n/de.json';
// End Assessment Test
// Start Profile Management
import ProfileManagementComponentAr from '../components/ProfileManagement/i18n/ar.json';
import ProfileManagementComponentEn from '../components/ProfileManagement/i18n/en.json';
import ProfileManagementComponentTr from '../components/ProfileManagement/i18n/tr.json';
import ProfileManagementComponentRo from '../components/ProfileManagement/i18n/ro.json';
import ProfileManagementComponentEl from '../components/ProfileManagement/i18n/el.json';
import ProfileManagementComponentFr from '../components/ProfileManagement/i18n/fr.json';
import ProfileManagementComponentSp from '../components/ProfileManagement/i18n/sp.json';
import ProfileManagementComponentDu from '../components/ProfileManagement/i18n/du.json';
import ProfileManagementComponentDe from '../components/ProfileManagement/i18n/de.json';
// End Profile Management

// Email integration page
import EmailIntegrationPageAr from '../pages/mailbox/i18n/ar.json';
import EmailIntegrationPageEn from '../pages/mailbox/i18n/en.json';
import EmailIntegrationPageTr from '../pages/mailbox/i18n/tr.json';
import EmailIntegrationPageRo from '../pages/mailbox/i18n/ro.json';
import EmailIntegrationPageEl from '../pages/mailbox/i18n/el.json';
import EmailIntegrationPageFr from '../pages/mailbox/i18n/fr.json';
import EmailIntegrationPageSp from '../pages/mailbox/i18n/sp.json';
import EmailIntegrationPageDu from '../pages/mailbox/i18n/du.json';
import EmailIntegrationPageDe from '../pages/mailbox/i18n/de.json';

import DataFlowPageEn from '../pages/dataflow/i18next/en.json';
import DataFlowPageAr from '../pages/dataflow/i18next/ar.json';
import DataFlowPageTr from '../pages/dataflow/i18next/tr.json';
import DataFlowPageRo from '../pages/dataflow/i18next/ro.json';
import DataFlowPageEl from '../pages/dataflow/i18next/el.json';
import DataFlowPageFr from '../pages/dataflow/i18next/fr.json';
import DataFlowPageSp from '../pages/dataflow/i18next/sp.json';
import DataFlowPageDu from '../pages/dataflow/i18next/du.json';
import DataFlowPageDe from '../pages/dataflow/i18next/de.json';

// Email integration page
import ProviderPageEn from '../pages/provider/i18n/en.json';
import ProviderPageAr from '../pages/provider/i18n/ar.json';
import ProviderPageRo from '../pages/provider/i18n/ro.json';
import ProviderPageTr from '../pages/provider/i18n/tr.json';
import ProviderPageEl from '../pages/provider/i18n/el.json';
import ProviderPageFr from '../pages/provider/i18n/fr.json';
import ProviderPageSp from '../pages/provider/i18n/sp.json';
import ProviderPageDu from '../pages/provider/i18n/du.json';
import ProviderPageDe from '../pages/provider/i18n/de.json';

import { SystemLanguagesConfig } from '../configs';
// Start Form Builders
import FormBuilderPageEn from '../pages/form-builder/i18n/en.json';
import FormBuilderPageAr from '../pages/form-builder/i18n/ar.json';
import FormBuilderPageTr from '../pages/form-builder/i18n/tr.json';
import FormBuilderPageRo from '../pages/form-builder/i18n/ro.json';
import FormBuilderPageEl from '../pages/form-builder/i18n/el.json';
import FormBuilderPageFr from '../pages/form-builder/i18n/fr.json';
import FormBuilderPageSp from '../pages/form-builder/i18n/sp.json';
import FormBuilderPageDu from '../pages/form-builder/i18n/du.json';
import FormBuilderPageDe from '../pages/form-builder/i18n/de.json';
// End Form Builders

// Start Invitations
import InvitationsPageEn from '../pages/invitations/i18n/en.json';
import InvitationsPageAr from '../pages/invitations/i18n/ar.json';
import InvitationsPageTr from '../pages/invitations/i18n/tr.json';
import InvitationsPageRo from '../pages/invitations/i18n/ro.json';
import InvitationsPageEl from '../pages/invitations/i18n/el.json';
import InvitationsPageFr from '../pages/invitations/i18n/fr.json';
import InvitationsPageSp from '../pages/invitations/i18n/sp.json';
import InvitationsPageDu from '../pages/invitations/i18n/du.json';
import InvitationsPageDe from '../pages/invitations/i18n/de.json';
// End Invitations
// Start Integrations
import IntegrationsPageEn from '../pages/integrations/i18n/en.json';
import IntegrationsPageAr from '../pages/integrations/i18n/ar.json';
import IntegrationsPageTr from '../pages/integrations/i18n/tr.json';
import IntegrationsPageRo from '../pages/integrations/i18n/ro.json';
import IntegrationsPageEl from '../pages/integrations/i18n/el.json';
import IntegrationsPageFr from '../pages/integrations/i18n/fr.json';
import IntegrationsPageSp from '../pages/integrations/i18n/sp.json';
import IntegrationsPageDu from '../pages/integrations/i18n/du.json';
import IntegrationsPageDe from '../pages/integrations/i18n/de.json';
// End Integrations
// Start Scorecard
import ScorecardPageEn from '../pages/recruiter-preference/Scorecard/I18n/en.json';
import ScorecardPageAr from '../pages/recruiter-preference/Scorecard/I18n/ar.json';
import ScorecardPageTr from '../pages/recruiter-preference/Scorecard/I18n/tr.json';
import ScorecardPageRo from '../pages/recruiter-preference/Scorecard/I18n/ro.json';
import ScorecardPageEl from '../pages/recruiter-preference/Scorecard/I18n/el.json';
import ScorecardPageFr from '../pages/recruiter-preference/Scorecard/I18n/fr.json';
import ScorecardPageSp from '../pages/recruiter-preference/Scorecard/I18n/sp.json';
import ScorecardPageDu from '../pages/recruiter-preference/Scorecard/I18n/du.json';
import ScorecardPageDe from '../pages/recruiter-preference/Scorecard/I18n/de.json';
// Start Scorecard

let isInitializedLanguage = false;

const languageInit = () => {
  if (localStorage.getItem('platform_language')) {
    changeLanguage(localStorage.getItem('platform_language'));
    const isRtl = i18next.dir(localStorage.getItem('platform_language')) === 'rtl';
    if (isRtl) {
      const direction = i18next.dir(localStorage.getItem('platform_language'));
      document.body.classList.add(direction);
      document.body.setAttribute('dir', direction);
      document.documentElement.lang = localStorage.getItem('platform_language');
    }
  } else localStorage.setItem('platform_language', 'en');
};
const I18n = () => {
  if (isInitializedLanguage) return;
  isInitializedLanguage = true;
  init({
    interpolation: { escapeValue: false }, // React already does escaping
    fallbackLng: Object.keys(SystemLanguagesConfig),
    lng: 'en', // language to use
    resources: {
      en: {
        Shared: SharedEn,
        CampaignPage: CampaignPageEn,
        VonqCampaignsPage: VonqCampaignsPageEn,
        EmailTemplatesPage: EmailTemplatesPageEn,
        QuestionnairePage: QuestionnairePageEn,
        BuyChannelsCreditPage: BuyChannelsCreditPageEn,
        MyChannelsCreditPage: MyChannelsCreditPageEn,
        ContractsPage: ContractsPageEn,
        EvaSSESS: EvaSSESSEn,
        EvarecCandidateModel: EvarecCandidateModelEn,
        CreateJob: CreateJobEn,
        EvaSSESSPipeline: EvaSSESSPipelineEn,
        EvaRecTemplate: EvarecRecTemplateEn,
        EvarecRecSearch: EvarecRecSearchEn,
        EvarecRecRms: EvarecRecRmsEn,
        EvarecRecManage: EvarecRecManageEn,
        EvaRecPipelines: EvaRecPipelinesEn,
        EvaSSESSTemplates: EvaSSESSTemplatesEn,
        EvarecRecModals: EvarecRecModalsEn,
        DispatcherProcessPage: DispatcherProcessPageEn,
        Overview: OverviewEn,
        EvaMeet: EvaMeetEn,
        EvaBrand: EvaBrandEn,
        Analytics: AnalyticsEn,
        InitialApproval: InitialApprovalEn,
        RecruiterPreferences: RecruiterPreferencesEn,
        Billing: BillingEn,
        SetupsPage: SetupsEn,
        AssessmentTest: AssessmentTestEn,
        ProfileManagementComponent: ProfileManagementComponentEn,
        VisaPage: VisaPageEn,
        OnboardingPage: OnboardingPageEn,
        EmailIntegrationPage: EmailIntegrationPageEn,
        FormBuilderPage: FormBuilderPageEn,
        InvitationsPage: InvitationsPageEn,
        IntegrationsPage: IntegrationsPageEn,
        DataFlowPage: DataFlowPageEn,
        ProviderPage: ProviderPageEn,
        Scorecard: ScorecardPageEn,
      },
      ar: {
        Shared: SharedAr,
        CampaignPage: CampaignPageAr,
        VonqCampaignsPage: VonqCampaignsPageAr,
        EmailTemplatesPage: EmailTemplatesPageAr,
        QuestionnairePage: QuestionnairePageAr,
        BuyChannelsCreditPage: BuyChannelsCreditPageAr,
        MyChannelsCreditPage: MyChannelsCreditPageAr,
        ContractsPage: ContractsPageAr,
        EvaSSESS: EvaSSESSAr,
        EvarecCandidateModel: EvarecCandidateModelAr,
        CreateJob: CreateJobAr,
        EvaSSESSPipeline: EvaSSESSPipelineAr,
        EvaRecTemplate: EvarecRecTemplateAr,
        EvarecRecSearch: EvarecRecSearchAr,
        EvarecRecRms: EvarecRecRmsAr,
        EvarecRecManage: EvarecRecManageAr,
        EvaRecPipelines: EvaRecPipelinesAr,
        EvaSSESSTemplates: EvaSSESSTemplatesAr,
        EvarecRecModals: EvarecRecModalsAr,
        DispatcherProcessPage: DispatcherProcessPageAr,
        Overview: OverviewAr,
        EvaMeet: EvaMeetAr,
        EvaBrand: EvaBrandAr,
        Analytics: AnalyticsAr,
        InitialApproval: InitialApprovalAr,
        RecruiterPreferences: RecruiterPreferencesAr,
        Billing: BillingAr,
        SetupsPage: SetupsAr,
        AssessmentTest: AssessmentTestAr,
        ProfileManagementComponent: ProfileManagementComponentAr,
        VisaPage: VisaPageAr,
        OnboardingPage: OnboardingPageAr,
        EmailIntegrationPage: EmailIntegrationPageAr,
        FormBuilderPage: FormBuilderPageAr,
        InvitationsPage: InvitationsPageAr,
        IntegrationsPage: IntegrationsPageAr,
        DataFlowPage: DataFlowPageAr,
        ProviderPage: ProviderPageAr,
        Scorecard: ScorecardPageAr,
      },
      tr: {
        Shared: SharedTr,
        CampaignPage: CampaignPageTr,
        VonqCampaignsPage: VonqCampaignsPageTr,
        EmailTemplatesPage: EmailTemplatesPageTr,
        QuestionnairePage: QuestionnairePageTr,
        BuyChannelsCreditPage: BuyChannelsCreditPageTr,
        MyChannelsCreditPage: MyChannelsCreditPageTr,
        ContractsPage: ContractsPageTr,
        EvaSSESS: EvaSSESSTr,
        EvarecCandidateModel: EvarecCandidateModelTr,
        CreateJob: CreateJobTr,
        EvaSSESSPipeline: EvaSSESSPipelineTr,
        EvaRecTemplate: EvarecRecTemplateTr,
        EvarecRecSearch: EvarecRecSearchTr,
        EvarecRecRms: EvarecRecRmsTr,
        EvarecRecManage: EvarecRecManageTr,
        EvaRecPipelines: EvaRecPipelinesTr,
        EvaSSESSTemplates: EvaSSESSTemplatesTr,
        EvarecRecModals: EvarecRecModalsTr,
        DispatcherProcessPage: DispatcherProcessPageTr,
        Overview: OverviewTr,
        EvaMeet: EvaMeetTr,
        EvaBrand: EvaBrandTr,
        Analytics: AnalyticsTr,
        InitialApproval: InitialApprovalTr,
        RecruiterPreferences: RecruiterPreferencesTr,
        Billing: BillingTr,
        SetupsPage: SetupsTr,
        VisaPage: VisaPageTr,
        OnboardingPage: OnboardingPageTr,
        AssessmentTest: AssessmentTestTr,
        FormBuilderPage: FormBuilderPageTr,
        InvitationsPage: InvitationsPageTr,
        IntegrationsPage: IntegrationsPageTr,
        ProfileManagementComponent: ProfileManagementComponentTr,
        EmailIntegrationPage: EmailIntegrationPageTr,
        ProviderPage: ProviderPageTr,
        DataFlowPage: DataFlowPageTr,
        Scorecard: ScorecardPageTr,
      },
      ro: {
        Shared: SharedRo,
        CampaignPage: CampaignPageRo,
        VonqCampaignsPage: VonqCampaignsPageRo,
        EmailTemplatesPage: EmailTemplatesPageRo,
        QuestionnairePage: QuestionnairePageRo,
        BuyChannelsCreditPage: BuyChannelsCreditPageRo,
        MyChannelsCreditPage: MyChannelsCreditPageRo,
        ContractsPage: ContractsPageRo,
        EvaSSESS: EvaSSESSRo,
        EvarecCandidateModel: EvarecCandidateModelRo,
        CreateJob: CreateJobRo,
        EvaSSESSPipeline: EvaSSESSPipelineRo,
        EvaRecTemplate: EvarecRecTemplateRo,
        EvarecRecSearch: EvarecRecSearchRo,
        EvarecRecRms: EvarecRecRmsRo,
        // EvarecRecManage: EvarecRecManageRo,
        EvaRecPipelines: EvaRecPipelinesRo,
        EvaSSESSTemplates: EvaSSESSTemplatesRo,
        EvarecRecModals: EvarecRecModalsRo,
        DispatcherProcessPage: DispatcherProcessPageRo,
        Overview: OverviewRo,
        EvaMeet: EvaMeetRo,
        EvaBrand: EvaBrandRo,
        Analytics: AnalyticsRo,
        InitialApproval: InitialApprovalRo,
        RecruiterPreferences: RecruiterPreferencesRo,
        Billing: BillingRo,
        VisaPage: VisaPageRo,
        OnboardingPage: OnboardingPageRo,
        SetupsPage: SetupsRo,
        FormBuilderPage: FormBuilderPageRo,
        InvitationsPage: InvitationsPageRo,
        IntegrationsPage: IntegrationsPageRo,
        AssessmentTest: AssessmentTestRo,
        ProfileManagementComponent: ProfileManagementComponentRo,
        EmailIntegrationPage: EmailIntegrationPageRo,
        ProviderPage: ProviderPageRo,
        DataFlowPage: DataFlowPageRo,
        Scorecard: ScorecardPageRo,
      },
      el: {
        Shared: SharedEl,
        CampaignPage: CampaignPageEl,
        VonqCampaignsPage: VonqCampaignsPageEl,
        EmailTemplatesPage: EmailTemplatesPageEl,
        QuestionnairePage: QuestionnairePageEl,
        BuyChannelsCreditPage: BuyChannelsCreditPageEl,
        MyChannelsCreditPage: MyChannelsCreditPageEl,
        ContractsPage: ContractsPageEl,
        EvaSSESS: EvaSSESSEl,
        EvarecCandidateModel: EvarecCandidateModelEl,
        CreateJob: CreateJobEl,
        EvaSSESSPipeline: EvaSSESSPipelineEl,
        EvaRecTemplate: EvarecRecTemplateEl,
        EvarecRecSearch: EvarecRecSearchEl,
        EvarecRecRms: EvarecRecRmsEl,
        EvarecRecManage: EvarecRecManageEl,
        EvaRecPipelines: EvaRecPipelinesEl,
        EvaSSESSTemplates: EvaSSESSTemplatesEl,
        EvarecRecModals: EvarecRecModalsEl,
        DispatcherProcessPage: DispatcherProcessPageEL,
        Overview: OverviewEl,
        EvaMeet: EvaMeetEl,
        EvaBrand: EvaBrandEl,
        Analytics: AnalyticsEl,
        InitialApproval: InitialApprovalEl,
        RecruiterPreferences: RecruiterPreferencesEl,
        Billing: BillingEl,
        VisaPage: VisaPageEl,
        OnboardingPage: OnboardingPageEl,
        SetupsPage: SetupsEl,
        AssessmentTest: AssessmentTestEl,
        ProfileManagementComponent: ProfileManagementComponentEl,
        EmailIntegrationPage: EmailIntegrationPageEl,
        FormBuilderPage: FormBuilderPageEl,
        InvitationsPage: InvitationsPageEl,
        IntegrationsPage: IntegrationsPageEl,
        DataFlowPage: DataFlowPageEl,
        ProviderPage: ProviderPageEl,
        Scorecard: ScorecardPageEl,
      },
      fr: {
        Shared: SharedFr,
        CampaignPage: CampaignPageFr,
        VonqCampaignsPage: VonqCampaignsPageFr,
        EmailTemplatesPage: EmailTemplatesPageFr,
        QuestionnairePage: QuestionnairePageFr,
        BuyChannelsCreditPage: BuyChannelsCreditPageFr,
        MyChannelsCreditPage: MyChannelsCreditPageFr,
        ContractsPage: ContractsPageFr,
        EvaSSESS: EvaSSESSFr,
        EvarecCandidateModel: EvarecCandidateModelFr,
        CreateJob: CreateJobFr,
        EvaSSESSPipeline: EvaSSESSPipelineFr,
        EvaRecTemplate: EvarecRecTemplateFr,
        EvarecRecSearch: EvarecRecSearchFr,
        EvarecRecRms: EvarecRecRmsFr,
        EvarecRecManage: EvarecRecManageFr,
        EvaRecPipelines: EvaRecPipelinesFr,
        EvaSSESSTemplates: EvaSSESSTemplatesFr,
        EvarecRecModals: EvarecRecModalsFr,
        DispatcherProcessPage: DispatcherProcessPageFr,
        Overview: OverviewFr,
        EvaMeet: EvaMeetFr,
        EvaBrand: EvaBrandFr,
        Analytics: AnalyticsFr,
        InitialApproval: InitialApprovalFr,
        RecruiterPreferences: RecruiterPreferencesFr,
        Billing: BillingFr,
        VisaPage: VisaPageFr,
        OnboardingPage: OnboardingPageFr,
        SetupsPage: SetupsFr,
        AssessmentTest: AssessmentTestFr,
        ProfileManagementComponent: ProfileManagementComponentFr,
        EmailIntegrationPage: EmailIntegrationPageFr,
        FormBuilderPage: FormBuilderPageFr,
        InvitationsPage: InvitationsPageFr,
        IntegrationsPage: IntegrationsPageFr,
        DataFlowPage: DataFlowPageFr,
        ProviderPage: ProviderPageFr,
        Scorecard: ScorecardPageFr,
      },
      sp: {
        Shared: SharedSp,
        CampaignPage: CampaignPageSp,
        VonqCampaignsPage: VonqCampaignsPageSp,
        EmailTemplatesPage: EmailTemplatesPageSp,
        QuestionnairePage: QuestionnairePageSp,
        BuyChannelsCreditPage: BuyChannelsCreditPageSp,
        MyChannelsCreditPage: MyChannelsCreditPageSp,
        ContractsPage: ContractsPageSp,
        EvaSSESS: EvaSSESSSp,
        EvarecCandidateModel: EvarecCandidateModelSp,
        CreateJob: CreateJobSp,
        EvaSSESSPipeline: EvaSSESSPipelineSp,
        EvaRecTemplate: EvarecRecTemplateSp,
        EvarecRecSearch: EvarecRecSearchSp,
        EvarecRecRms: EvarecRecRmsSp,
        EvarecRecManage: EvarecRecManageSp,
        EvaRecPipelines: EvaRecPipelinesSp,
        EvaSSESSTemplates: EvaSSESSTemplatesSp,
        EvarecRecModals: EvarecRecModalsSp,
        DispatcherProcessPage: DispatcherProcessPageSp,
        Overview: OverviewSp,
        EvaMeet: EvaMeetSp,
        EvaBrand: EvaBrandSp,
        Analytics: AnalyticsSp,
        InitialApproval: InitialApprovalSp,
        RecruiterPreferences: RecruiterPreferencesSp,
        Billing: BillingSp,
        VisaPage: VisaPageSp,
        OnboardingPage: OnboardingPageSp,
        SetupsPage: SetupsSp,
        AssessmentTest: AssessmentTestSp,
        ProfileManagementComponent: ProfileManagementComponentSp,
        EmailIntegrationPage: EmailIntegrationPageSp,
        FormBuilderPage: FormBuilderPageSp,
        InvitationsPage: InvitationsPageSp,
        IntegrationsPage: IntegrationsPageSp,
        DataFlowPage: DataFlowPageSp,
        ProviderPage: ProviderPageSp,
        Scorecard: ScorecardPageSp,
      },
      du: {
        Shared: SharedDu,
        CampaignPage: CampaignPageDu,
        VonqCampaignsPage: VonqCampaignsPageDu,
        EmailTemplatesPage: EmailTemplatesPageDu,
        QuestionnairePage: QuestionnairePageDu,
        BuyChannelsCreditPage: BuyChannelsCreditPageDu,
        MyChannelsCreditPage: MyChannelsCreditPageDu,
        ContractsPage: ContractsPageDu,
        EvaSSESS: EvaSSESSDu,
        EvarecCandidateModel: EvarecCandidateModelDu,
        CreateJob: CreateJobDu,
        EvaSSESSPipeline: EvaSSESSPipelineDu,
        EvaRecTemplate: EvarecRecTemplateDu,
        EvarecRecSearch: EvarecRecSearchDu,
        EvarecRecRms: EvarecRecRmsDu,
        EvarecRecManage: EvarecRecManageDu,
        EvaRecPipelines: EvaRecPipelinesDu,
        EvaSSESSTemplates: EvaSSESSTemplatesDu,
        EvarecRecModals: EvarecRecModalsDu,
        DispatcherProcessPage: DispatcherProcessPageDu,
        Overview: OverviewDu,
        EvaMeet: EvaMeetDu,
        EvaBrand: EvaBrandDu,
        Analytics: AnalyticsDu,
        InitialApproval: InitialApprovalDu,
        RecruiterPreferences: RecruiterPreferencesDu,
        Billing: BillingDu,
        VisaPage: VisaPageDu,
        OnboardingPage: OnboardingPageDu,
        SetupsPage: SetupsDu,
        AssessmentTest: AssessmentTestDu,
        ProfileManagementComponent: ProfileManagementComponentDu,
        EmailIntegrationPage: EmailIntegrationPageDu,
        FormBuilderPage: FormBuilderPageDu,
        InvitationsPage: InvitationsPageDu,
        IntegrationsPage: IntegrationsPageDu,
        DataFlowPage: DataFlowPageDu,
        ProviderPage: ProviderPageDu,
        Scorecard: ScorecardPageDu,
      },
      de: {
        Shared: SharedDe,
        CampaignPage: CampaignPageDe,
        VonqCampaignsPage: VonqCampaignsPageDe,
        EmailTemplatesPage: EmailTemplatesPageDe,
        QuestionnairePage: QuestionnairePageDe,
        BuyChannelsCreditPage: BuyChannelsCreditPageDe,
        MyChannelsCreditPage: MyChannelsCreditPageDe,
        ContractsPage: ContractsPageDe,
        EvaSSESS: EvaSSESSDe,
        EvarecCandidateModel: EvarecCandidateModelDe,
        CreateJob: CreateJobDe,
        EvaSSESSPipeline: EvaSSESSPipelineDe,
        EvaRecTemplate: EvarecRecTemplateDe,
        EvarecRecSearch: EvarecRecSearchDe,
        EvarecRecRms: EvarecRecRmsDe,
        EvarecRecManage: EvarecRecManageDe,
        EvaRecPipelines: EvaRecPipelinesDe,
        EvaSSESSTemplates: EvaSSESSTemplatesDe,
        EvarecRecModals: EvarecRecModalsDe,
        DispatcherProcessPage: DispatcherProcessPageDe,
        Overview: OverviewDe,
        EvaMeet: EvaMeetDe,
        EvaBrand: EvaBrandDe,
        Analytics: AnalyticsDe,
        InitialApproval: InitialApprovalDe,
        RecruiterPreferences: RecruiterPreferencesDe,
        Billing: BillingDe,
        VisaPage: VisaPageDe,
        OnboardingPage: OnboardingPageDe,
        SetupsPage: SetupsDe,
        AssessmentTest: AssessmentTestDe,
        ProfileManagementComponent: ProfileManagementComponentDe,
        EmailIntegrationPage: EmailIntegrationPageDe,
        FormBuilderPage: FormBuilderPageDe,
        InvitationsPage: InvitationsPageDe,
        IntegrationsPage: IntegrationsPageDe,
        DataFlowPage: DataFlowPageDe,
        ProviderPage: ProviderPageDe,
        Scorecard: ScorecardPageDe,
      },
    },
  });
  languageInit();
};
export default I18n;

export const languageChange = (currentLanguage) => {
  const direction = i18next.dir(currentLanguage);
  localStorage.setItem('platform_language', currentLanguage);
  if (document.body.classList.contains('rtl')) document.body.classList.remove('rtl');
  if (document.body.classList.contains('lrt')) document.body.classList.remove('lrt');
  document.body.classList.add(direction);
  document.body.setAttribute('dir', direction);
  document.documentElement.lang = currentLanguage;
  changeLanguage(currentLanguage);
  GlobalRerender();
};

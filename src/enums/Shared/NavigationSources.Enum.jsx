import { FormsMembersTypesEnum } from './FormsMembersTypes.Enum';
import { FormsAssignTypesEnum } from './FormsAssignTypes.Enum';

export const NavigationSourcesEnum = {
  FromOfferToFormBuilder: {
    key: 1,
    source_url: () => '',
    destination_url: () => '',
  },
  FromFormBuilderToPipeline: {
    key: 2,
    source_url: () => '',
    destination_url: () => '',
  },
  FromSelfServiceToFormBuilder: {
    key: 3,
    source_url: () => '',
    destination_url: () => '',
  },
  FromOfferViewToFormBuilder: {
    key: 4,
    source_url: () => '',
    destination_url: () => '',
  },
  FromVisaDashboardToSelfService: {
    key: 5,
    source_url: () => '',
    destination_url: () => '',
  },
  FromVisaStatusToFormBuilder: {
    key: 6,
    source_url: ({ offerData }) =>
      `/recruiter/job/manage/pipeline/${offerData.jobUuid}?${
        offerData.pipelineUuid ? `pipeline_uuid=${offerData.pipelineUuid}&` : ''
      }candidate_uuid=${offerData.candidateUuid}&source=${8}`,
    destination_url: () => '',
    isForm: true,
  },
  VisaRequestToFormBuilder: {
    key: 7,
    source_url: () => `/visa/all-requests?source=${9}`,
    destination_url: () => '',
    isForm: true,
  },
  FormBuilderToVisaStatus: {
    key: 8,
    source_url: () => '',
    destination_url: () => '',
    isForm: true,
  },
  FormBuilderToVisaRequests: {
    key: 9,
    source_url: () => '',
    destination_url: () => '',
    isForm: true,
  },
  CandidateFormsToFormBuilder: {
    key: 10,
    source_url: ({ templateData }) =>
      `/recruiter/job/manage/pipeline/${templateData.extraQueries.jobUUID}?${
        templateData.extraQueries.pipelineUUID
          ? `pipeline_uuid=${templateData.extraQueries.pipelineUUID}&`
          : ''
      }candidate_uuid=${templateData.extraQueries.candidateUUID}&source=${11}`,
    destination_url: () => '',
    isForm: true, // otherwise it's a template
    assignType: FormsAssignTypesEnum.JobCandidate.key, // default assign with type
    memberType: FormsMembersTypesEnum.Candidates.key,
  },
  CandidateNotSharableFormsToFormBuilder: {
    key: 16,
    source_url: ({ templateData }) =>
      `/recruiter/job/manage/pipeline/${templateData.extraQueries.jobUUID}?${
        templateData.extraQueries.pipelineUUID
          ? `pipeline_uuid=${templateData.extraQueries.pipelineUUID}&`
          : ''
      }candidate_uuid=${templateData.extraQueries.candidateUUID}&source=${11}`,
    destination_url: () => '',
    isEdit: true,
    isForm: true, // otherwise it's a template
    assignType: FormsAssignTypesEnum.JobCandidate.key, // default assign with type
    memberType: FormsMembersTypesEnum.Candidates.key,
  },
  FormBuilderToCandidateForms: {
    key: 11,
    source_url: () => '',
    destination_url: () => '',
  },
  CandidateFormViewToFormBuilder: {
    key: 12,
    source_url: ({ templateData }) =>
      `/recruiter/job/manage/pipeline/${templateData.extraQueries.jobUUID}?${
        templateData.extraQueries.pipelineUUID
          ? `pipeline_uuid=${templateData.extraQueries.pipelineUUID}&`
          : ''
      }candidate_uuid=${templateData.extraQueries.candidateUUID}&source=${11}`,
    destination_url: () => '',
    isView: true, // otherwise it's editable based on role
    isForm: true,
    assignType: FormsAssignTypesEnum.JobCandidate.key, // default assign with type
    memberType: FormsMembersTypesEnum.Candidates.key,
  },
  OnboardingMenuToFormBuilder: {
    key: 13,
    source_url: ({ templateData } = {}) =>
      `/onboarding/${
        templateData?.space_uuid || templateData?.folder_uuid
          ? `connections?space_uuid=${templateData?.space_uuid || ''}&folder_uuid=${
            templateData?.folder_uuid || ''
          }`
          : 'flows'
      }`,
    destination_url: () => '',
    isView: false, // otherwise it's editable based on role
    isForm: false,
  },
  OnboardingMenuViewToFormBuilder: {
    key: 14,
    source_url: ({ templateData } = {}) =>
      `/onboarding/${
        templateData?.space_uuid || templateData?.folder_uuid
          ? `connections?space_uuid=${templateData?.space_uuid || ''}&folder_uuid=${
            templateData?.folder_uuid || ''
          }`
          : 'flows'
      }`,
    destination_url: () => '',
    isView: true, // otherwise it's editable based on role
    isForm: false,
  },
  FormBuilderToTasksSelfService: {
    key: 15,
    source_url: () => ``,
    destination_url: () => '',
  },
  TasksSelfServiceToFormBuilder: {
    key: 17,
    source_url: ({ templateData }) =>
      `/home/tasks?${
        templateData?.extraQueries?.slug
          ? `slug=${templateData.extraQueries.slug}&`
          : ''
      }&source=${15}`,
    destination_url: () => '',
    assignType: FormsAssignTypesEnum.JobCandidate.key,
    memberType: FormsMembersTypesEnum.Candidates.key,
    isFromSelfService: true,
  },
  OnboardingInvitationsToFormBuilder: {
    key: 18,
    source_url: ({ templateData }) =>
      `/onboarding/invitations?${
        templateData.extraQueries.email
          ? `email=${encodeURIComponent(templateData.extraQueries.email)}`
          : ''
      }${
        templateData.extraQueries.for ? `&for=${templateData.extraQueries.for}` : ''
      }${templateData.editorRole ? `&editor_role=${templateData.editorRole}` : ''}${
        templateData.extraQueries.role
          ? `&role_type=${templateData.extraQueries.role}`
          : ''
      }`,
    destination_url: () => '',
    isView: false,
    isForm: false,
  },
  OnboardingVariablesToFormBuilder: {
    key: 19,
    source_url: () => '/onboarding/tasks',
    destination_url: () => '',
    isView: false,
    isForm: false,
  },
  OnboardingAssignToAssistToFormBuilder: {
    key: 20,
    source_url: () => '/onboarding/tasks?activeTab=1',
    destination_url: () => '',
    isView: false,
    isForm: false,
  },
  OnboardingAssignToViewToFormBuilder: {
    key: 21,
    source_url: () => '/onboarding/tasks?activeTab=2',
    destination_url: () => '',
    isView: true,
    isForm: false,
  },
  OnboardingResponsesViewToFormBuilder: {
    key: 22,
    source_url: () => '/onboarding/responses?activeTab=1',
    destination_url: () => '',
    isView: true,
    isForm: false,
  },
  OnboardingInvitationsToLogin: {
    key: 23,
    source_url: ({ query }) => `/onboarding/invitations?${query.toString()}`,
    destination_url: () => '',
    isView: true,
    isForm: false,
  },
  OnboardingMembersToFormBuilder: {
    key: 24,
    source_url: () => '/onboarding/members',
    destination_url: () => '',
    isView: true,
    isForm: false,
  },

  AporovalTrackingToForm: {
    key: 25,
    source_url: ({ templateData }) =>
      `/home/approvals-tracking?${
        templateData.extraQueries.approvalUUID
          ? `approval_uuid=${templateData.extraQueries.approvalUUID}&`
          : ''
      }&source=${25}`,
    destination_url: () => '',
    isView: true,
    isFromSelfService: true,
  },
  PipelineBulkToFormBuilder: {
    key: 26,
    source_url: ({ templateData }) =>
      `/recruiter/job/manage/pipeline/${templateData.extraQueries.jobUUID}?${
        templateData.extraQueries.pipelineUUID
          ? `pipeline_uuid=${templateData.extraQueries.pipelineUUID}&`
          : ''
      }&source=${11}`,
    destination_url: () => '',
    isForm: true, // otherwise it's a template
    assignType: FormsAssignTypesEnum.JobCandidate.key, // default assign with type
    memberType: FormsMembersTypesEnum.Candidates.key,
  },
  TasksSelfServicesToOfferBuilder: {
    key: 27,
    source_url: ({ templateData }) =>
      `/home/tasks?${
        templateData?.extraQueries?.slug
          ? `slug=${templateData.extraQueries.slug}&`
          : ''
      }&source=${15}`,
    destination_url: () => '',
    assignType: FormsAssignTypesEnum.JobCandidate.key,
    memberType: FormsMembersTypesEnum.Candidates.key,
    isFromSelfService: true,
  },
  PipelineToScorecard: {
    key: 28,
    source_url: ({ templateData }) =>
      `/recruiter/job/manage/pipeline/${templateData.extraQueries.jobUUID}?${
        templateData.extraQueries.pipelineUUID
          ? `pipeline_uuid=${templateData.extraQueries.pipelineUUID}&`
          : ''
      }`,
  },
  SelfServiceTasksToOnboardingFlow: {
    key: 29,
    source_url: () => `/home/tasks&activeTab=1&activeOnboardingTab=0`,
    destination_url: () => '',
    isView: false,
    isForm: false,
    isFromSelfService: true,
  },
  SelfServiceTasksAssignToViewToOnboardingFlow: {
    key: 30,
    source_url: () => '/home/tasks&activeTab=1&activeOnboardingTab=2',
    destination_url: () => '',
    isView: true,
    isForm: false,
    isFromSelfService: true,
  },
  SelfServiceTasksAssignToAssistToOnboardingFlow: {
    key: 31,
    source_url: () => '/home/tasks&activeTab=1&activeOnboardingTab=1',
    destination_url: () => '',
    isView: false,
    isForm: false,
    isFromSelfService: true,
  },
  SelfServiceTasksVariableAssignToViewToOnboardingFlow: {
    key: 32,
    source_url: () => `/home/tasks&activeTab=1&activeOnboardingTab=0`,
    destination_url: () => '',
    isView: true,
    isForm: false,
    isFromSelfService: true,
  },
  PipelineBulkToFormBuilderV1: {
    key: 33,
    source_url: ({ templateData }) =>
      `/recruiter/job/manage/pipeline/${templateData.extraQueries.jobUUID}?${
        templateData.extraQueries.pipelineUUID
          ? `pipeline_uuid=${templateData.extraQueries.pipelineUUID}&`
          : ''
      }`,
    destination_url: () => '',
  },
};

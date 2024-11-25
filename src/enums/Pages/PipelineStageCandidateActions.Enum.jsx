import { GetBuilderFormTypes } from '../../services';

export const PipelineStageCandidateActionsEnum = {
  ProfileEdit: {
    key: 1,
    value: 'profile',
  },
  Resume: {
    key: 15,
    value: 'resume',
  },
  Attachments: {
    key: 2,
    value: 'attachments',
  },
  Evaluations: {
    key: 3,
    value: 'evaluations',
  },
  Questionnaires: {
    key: 4,
    value: 'questionnaires',
  },
  VideoAssessments: {
    key: 5,
    value: 'video-assessments',
  },
  AssessmentTests: {
    key: 6,
    value: 'assessment-tests',
  },
  Meetings: {
    key: 7,
    value: 'meetings',
  },
  FormBuilder: {
    key: 8,
    value: 'offers',
    listDetails: {
      savingKey: 'form_types',
      fullDataKey: 'formTypes',
      getAllDataAPI: GetBuilderFormTypes,
      extraAPIProps: {
        version: 'v1',
      },
      value: 'offer-types',
      imageAltValue: undefined,
      isImage: false,
    },
  },
  Forms: {
    key: 14,
    value: 'forms',
    listDetails: {
      savingKey: 'form_types',
      fullDataKey: 'formTypes',
      getAllDataAPI: GetBuilderFormTypes,
      extraAPIProps: {
        version: 'v2',
      },
      value: 'form-types',
      imageAltValue: undefined,
      isImage: false,
    },
  },
  Share: {
    key: 9,
    value: 'share',
  },
  Emails: {
    key: 10,
    value: 'emails',
  },
  PushToHRMS: {
    key: 11,
    value: 'push-to-hrms',
  },
  VisaStatus: {
    key: 12,
    value: 'visa-status',
  },
  Scorecard: {
    key: 16,
    value: 'scorecard',
  },
  AppliedJobs: {
    key: 17,
    value: 'applied-jobs',
  },
  Documents: {
    key: 19,
    value: 'documents',
  },
  Onboarding: {
    key: 20,
    value: 'onboarding',
  },
};

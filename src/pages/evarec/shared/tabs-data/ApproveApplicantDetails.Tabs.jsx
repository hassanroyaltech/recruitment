import {
  EvaluationTab,
  MeetingsTab,
  ProfileTab,
  ResumeTab,
  StepsTab,
  // ShareTab,
  // OfferTab,
  AttachmentTab,
  // TagsTab,
  // IntroductionTab,
  // IntroductionTab,
  // QuestionnaireTab,
  // VideoAssessmentTab,
} from '../../initial-approval/dialogs/approve-applicant-details/tabs';
import { ChatGPTIcon } from '../../../../assets/icons';
import React from 'react';
import { EvaAnalysisTab } from '../../../../components/EvaAnalysis/Tabs/EvaAnalysis.Tab';

export const ApproveApplicantDetailsTabs = [
  {
    key: 1,
    label: 'evaluation',
    icon: 'fas fa-sliders-h',
    component: EvaluationTab,
    props: {
      type: 'ats',
    },
  },
  {
    key: 2,
    label: 'steps',
    icon: 'fas fa-layer-group',
    component: StepsTab,
  },
  {
    key: 2,
    label: 'profile',
    icon: 'fas fa-user',
    component: ProfileTab,
    props: {
      mode: true,
      hideImage: true,
    },
  },
  {
    key: 3,
    label: 'resume',
    icon: 'fas fa-file-invoice',
    component: ResumeTab,
  },
  {
    key: 4,
    label: 'meetings',
    icon: 'fas fa-calendar-alt',
    component: MeetingsTab,
  },
  // {
  //   key: 5,
  //   label: 'approvals-evaluation',
  //   icon: 'fas fa-sliders-h',
  //   component: EvaluationTab,
  //   props: {
  //     type: 'ats',
  //   },
  // },
  // {
  //   key: 5,
  //   label: 'introduction',
  //   icon: 'fas fa-microphone',
  //   component: IntroductionTab,
  // },
  {
    key: 6,
    label: 'attachments',
    icon: 'fas fa-paperclip',
    component: AttachmentTab,
  },
  // {
  //   key: 7,
  //   label: 'tags',
  //   icon: 'fas fa-tags',
  //   component: TagsTab,
  // },
  // {
  //   key: 7,
  //   label: 'questionnaire',
  //   icon: 'fas fa-clipboard-list',
  //   component: QuestionnaireTab,
  // },
  // {
  //   key: 8,
  //   label: 'assessment',
  //   icon: 'fas fa-check-square',
  // },
  // {
  //   key: 9,
  //   label: 'video-assessment',
  //   icon: 'fas fa-video',
  //   component: VideoAssessmentTab,
  //   props: {
  //     type: 'ats',
  //   },
  // },
  // {
  //   key: 10,
  //   label: 'offer',
  //   icon: 'fas fa-suitcase',
  //   component: OfferTab,
  //   props: {
  //     type: 'ats',
  //   },
  // },
  // {
  //   key: 11,
  //   label: 'share',
  //   icon: 'fas fa-share-alt',
  //   component: ShareTab,
  //   props: {
  //     type: 'ats',
  //   },
  // },
  // {
  //   key: 12,
  //   label: 'logs',
  //   icon: 'fas fa-history',
  //   component: LogsComponent,
  // },
  {
    key: 13,
    label: 'eva-analysis',
    isSVGIcon: true,
    svgIcon: <ChatGPTIcon color="var(--bc-primary)" />,
    component: EvaAnalysisTab,
    disabled: false,
  },
];

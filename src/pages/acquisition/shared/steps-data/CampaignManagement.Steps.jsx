import {
  ChannelsStep,
  ContractDetailsStep,
  JobDetailsStep,
  PaymentStep,
  ReviewStep,
} from '../../campaigns';

export const CampaignManagementSteps = [
  {
    key: 'channels',
    label: 'channels',
    component: ChannelsStep,
  },
  {
    key: 'jobDetails',
    label: 'job-details',
    component: JobDetailsStep,
  },
  {
    key: 'contractDetails',
    label: 'contract-details',
    component: ContractDetailsStep,
  },
  {
    key: 'review',
    label: 'review',
    component: ReviewStep,
  },
  {
    key: 'payment',
    label: 'payment',
    component: PaymentStep,
  },
];

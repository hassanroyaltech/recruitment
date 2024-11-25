import { ChannelsStep, PaymentStep } from '../../campaigns';
import { CampaignDetailsStep } from '../../campaigns/dialogs/campaign-managment/steps/campaign-details/CampaignDetails.Step';

export const CampaignManagementStepsV2 = [
  {
    key: 'channels',
    label: 'channels',
    component: ChannelsStep,
  },
  {
    key: 'campaignDetails',
    label: 'campaign-details',
    component: CampaignDetailsStep,
  },
  {
    key: 'payment',
    label: 'payment',
    component: PaymentStep,
  },
];

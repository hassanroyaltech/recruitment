import { CampaignTypes } from 'enums';

export const CampaignTabs = [
  {
    label: 'all-campaigns',
    totalCount: 0,
    key: -1,
  },
  {
    label: 'draft',
    totalCount: 0,
    key: CampaignTypes.draft.key,
  },
  {
    label: 'in-progress',
    totalCount: 0,
    key: CampaignTypes.inProgress.key,
  },
  // {
  //   label: 'in-completed',
  //   totalCount: 0,
  //   key: CampaignTypes.requirements.key,
  // },
  {
    label: 'completed',
    totalCount: 0,
    key: CampaignTypes.completed.key,
  },
  {
    label: 'failed',
    totalCount: 0,
    key: CampaignTypes.failed.key,
  },
];

import {
  AllChannelsTab,
  MyChannelsCreditTab,
  MyContractsTab,
  RecommendedTab,
} from '../../campaigns/dialogs/campaign-managment/steps/channels';

export const ChannelsTabs = [
  {
    label: 'recommended',
    key: 1,
    component: RecommendedTab,
    isContracts: false,
  },
  {
    label: 'my-channels-credit',
    key: 2,
    component: MyChannelsCreditTab,
    isContracts: false,
  },
  {
    label: 'my-contracts',
    key: 3,
    component: MyContractsTab,
    isContracts: true,
  },
  {
    label: 'all-channels',
    key: 4,
    component: AllChannelsTab,
    isContracts: false,
  },
];

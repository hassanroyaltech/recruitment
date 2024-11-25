import { ProviderAccountRatingTab } from 'pages/provider/rating/tabs/AccountRating.Tab';
import { ProviderBranchesRatingTab } from 'pages/provider/rating/tabs/BranchesRating.Tab';

export const ProviderRatingDrawerTabs = [
  {
    label: 'account',
    component: ProviderAccountRatingTab,
  },
  {
    label: 'branch',
    component: ProviderBranchesRatingTab,
  },
  {
    label: 'assigned',
    // component: ProviderProfileTab,
    disabled: true,
  },
  {
    label: 'completed',
    // component: ProviderProfileTab,
    disabled: true,
  },
];

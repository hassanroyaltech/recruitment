import { VisasAndBlocksTab } from '../tabs';

export const DashboardTabs = [
  {
    key: 1,
    label: 'visas-and-blocks',
    component: VisasAndBlocksTab,
  },
  {
    key: 2,
    label: 'expired',
    component: VisasAndBlocksTab,
    is_expired: true,
  },
];

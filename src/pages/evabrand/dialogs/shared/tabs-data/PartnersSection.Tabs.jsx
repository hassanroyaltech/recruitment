import { PartnersContentsTab, PartnersTab } from '../../partners-section';
import { LayoutsTab } from '../layouts';

export const PartnersSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: PartnersContentsTab,
  },
  {
    label: 'partners',
    key: 2,
    component: PartnersTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

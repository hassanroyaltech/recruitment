import { LayoutsTab } from '../layouts';
import { OpeningsSectionContentsTab } from '../../openings-section/tabs';

export const OpeningsSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: OpeningsSectionContentsTab,
  },
  {
    label: 'layouts',
    key: 2,
    component: LayoutsTab,
  },
];

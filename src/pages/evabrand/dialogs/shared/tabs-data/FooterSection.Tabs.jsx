import { FooterContentsTab, CategoriesAndPagesTab } from '../../footer-section';
import { LayoutsTab } from '../layouts';

export const FooterSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: FooterContentsTab,
  },
  {
    label: 'categories-and-pages',
    key: 2,
    component: CategoriesAndPagesTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

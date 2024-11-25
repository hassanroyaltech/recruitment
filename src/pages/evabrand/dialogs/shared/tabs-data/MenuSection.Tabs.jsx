import { MenuContentsTab, NavigationMenuTab } from '../../menu-section';
import { LayoutsTab } from '../layouts';

export const MenuSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: MenuContentsTab,
  },
  {
    label: 'menu',
    key: 2,
    component: NavigationMenuTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

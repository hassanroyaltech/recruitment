import { GridSectionContentsTab, GridsTab } from '../../grids-section';
import { LayoutsTab } from '../layouts';

export const GridSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: GridSectionContentsTab,
  },
  {
    label: 'grids',
    key: 2,
    component: GridsTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

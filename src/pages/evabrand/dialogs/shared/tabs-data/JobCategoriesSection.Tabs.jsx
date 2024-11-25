import {
  JobCategoriesSectionContentsTab,
  CategoriesTab,
} from '../../job-categories-section';
import { LayoutsTab } from '../layouts';

export const JobCategoriesSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: JobCategoriesSectionContentsTab,
  },
  {
    label: 'categories',
    key: 2,
    component: CategoriesTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

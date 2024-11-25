import {
  SuccessStoriesContentsTab,
  StoriesTab,
} from '../../success-stories-section';
import { LayoutsTab } from '../layouts';

export const SuccessStoriesSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: SuccessStoriesContentsTab,
  },
  {
    label: 'stories',
    key: 2,
    component: StoriesTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

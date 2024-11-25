import { GallerySectionContentsTab, ImagesTab } from '../../gallery-section';
import { LayoutsTab } from '../layouts';

export const SliderSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: GallerySectionContentsTab,
  },
  {
    label: 'images',
    key: 2,
    component: ImagesTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

import {
  MediaAndTextSectionContentsTab,
  MediaAndTextMediasTab,
} from '../../media-and-text-section';
import { LayoutsTab } from '../layouts';

export const MediaAndTextSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: MediaAndTextSectionContentsTab,
  },
  {
    label: 'medias',
    key: 2,
    component: MediaAndTextMediasTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

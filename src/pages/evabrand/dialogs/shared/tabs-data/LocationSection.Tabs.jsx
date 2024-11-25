import { LayoutsTab } from '../layouts';
import {
  LocationMapTab,
  LocationSectionContentsTab,
} from '../../location-section/tabs';

export const LocationSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: LocationSectionContentsTab,
  },
  {
    label: 'location',
    key: 2,
    component: LocationMapTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

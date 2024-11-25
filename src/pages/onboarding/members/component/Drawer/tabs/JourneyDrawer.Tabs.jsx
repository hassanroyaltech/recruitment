import { AssistedByTab, JourneyTab, AssignedByTab } from '../components';

export const JourneyDrawerTabs = [
  {
    label: 'journey',
    component: JourneyTab,
  },
  {
    label: 'assigned-by',
    component: AssignedByTab,
  },
  {
    label: 'assisted-by',
    component: AssistedByTab,
  },
];

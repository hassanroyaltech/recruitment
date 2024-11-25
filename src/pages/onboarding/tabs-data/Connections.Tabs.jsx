import { ConnectionsContentTab } from '../connections/tabs';
import MembersPage from '../members/Members.Page';
import { VariablesTab } from '../tasks/tabs/components/Variables.Tab';

export const ConnectionsTabs = [
  {
    key: 1,
    label: 'content',
    component: ConnectionsContentTab,
  },
  {
    key: 2,
    label: 'members',
    component: MembersPage,
  },
  {
    key: 3,
    label: 'tasks',
    component: VariablesTab,
  },
];

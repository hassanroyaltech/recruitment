import { MembersTab, TeamMembersContentsTab } from '../../team-members';
import { LayoutsTab } from '../layouts';

export const TeamMembersSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: TeamMembersContentsTab,
  },
  {
    label: 'members',
    key: 2,
    component: MembersTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];

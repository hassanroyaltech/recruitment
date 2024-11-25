import { WorkFlowTab } from './components';
import { ManageOnboardingPermissions } from '../../../../permissions';

export const ActivityTabs = [
  // {
  //   key: 1,
  //   label: 'Workflow-progress',
  //   component: WorkFlowTab
  // },
  {
    key: 2,
    label: 'recent-activity',
    component: WorkFlowTab,
    permissionId: ManageOnboardingPermissions.ViewActivity.key,
    // component: RecentActivityTab,
  },
];

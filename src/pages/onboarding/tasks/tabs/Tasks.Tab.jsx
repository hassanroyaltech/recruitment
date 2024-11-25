import { VariablesTab } from './components/Variables.Tab';
import { AssignedToAssistTab } from './components/AssignedToAssist.Tab';
import { AssignedToViewTab } from './components/AssignedToView.Tab';
import { ManageOnboardingPermissions } from '../../../../permissions';

export const TasksTabs = [
  {
    key: 1,
    label: 'variables',
    component: VariablesTab,
    permissionId: ManageOnboardingPermissions.ViewTasks.key,
  },
  {
    key: 2,
    label: 'assigned-to-assist',
    component: AssignedToAssistTab,
    permissionId: ManageOnboardingPermissions.ViewTasks.key,
  },
  {
    key: 3,
    label: 'assigned-to-view',
    component: AssignedToViewTab,
    permissionId: ManageOnboardingPermissions.ViewTasks.key,
  },
];

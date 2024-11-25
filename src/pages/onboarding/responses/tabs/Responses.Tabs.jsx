import { AssignedToView, SharedResponsesTab } from './components';
// import { SharedResponsesTab } from "./components";
import {
  GetOnboardingResponses,
  GetOnboardingResponsesAssignedToView,
} from '../../../../services';
import { ManageOnboardingPermissions } from '../../../../permissions';

export const ResponsesTabs = [
  {
    key: 1,
    label: 'recent-activity',
    // component: SharedResponsesTab,
    getDataFuction: GetOnboardingResponses,
    component: SharedResponsesTab,
    permissionId: ManageOnboardingPermissions.ViewResponsesRecentActivity.key,
  },
  {
    key: 2,
    label: 'assigned-to-view',
    // component:SharedResponsesTab,
    getDataFuction: GetOnboardingResponsesAssignedToView,
    component: AssignedToView,
    permissionId: ManageOnboardingPermissions.ViewResponsesAssignToView.key,
    // component: RecentActivityTab,
  },
];

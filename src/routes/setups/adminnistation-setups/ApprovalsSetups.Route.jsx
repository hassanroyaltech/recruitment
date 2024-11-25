import { lazy } from 'react';
import { CommitteesPermissions, WorkflowsPermissions } from '../../../permissions';
const WorkflowsPage = lazy(() =>
  import('../../../pages/setups/approvals-setups/workflows/Workflows.Page'),
);
const CommitteesPage = lazy(() =>
  import('../../../pages/setups/approvals-setups/committees/Committees.Page'),
);

export const ApprovalsSetupsRoute = [
  {
    path: '/workflows',
    name: 'workflows',
    component: WorkflowsPage,
    layout: '/setups/approvals',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/committees',
    name: 'committees',
    component: CommitteesPage,
    layout: '/setups/approvals',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: CommitteesPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

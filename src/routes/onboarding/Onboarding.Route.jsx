import { lazy } from 'react';
const ActivityPage = lazy(() =>
  import('../../pages/onboarding/activity/Activity.Page'),
);
const FlowsPage = lazy(() => import('../../pages/onboarding/all-flows/Flows.Page'));
const ResponsesPage = lazy(() =>
  import('../../pages/onboarding/responses/Responses.Page'),
);
const MembersPage = lazy(() =>
  import('../../pages/onboarding/members/Members.Page'),
);
const TasksPage = lazy(() => import('../../pages/onboarding/tasks/Tasks.Page'));
const ConnectionsPage = lazy(() =>
  import('../../pages/onboarding/connections/Connections.Page'),
);
const EmailManagementPage = lazy(() =>
  import('../../pages/onboarding/email-management/EmailManagement.Page'),
);
export const OnboardingRoute = [
  {
    path: '/activity',
    name: 'onboarding-activity',
    component: ActivityPage,
    layout: '/onboarding',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/email-management',
    name: 'email-management',
    component: EmailManagementPage,
    layout: '/onboarding',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/responses',
    name: 'onboarding-activity',
    component: ResponsesPage,
    layout: '/onboarding',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/flows',
    name: 'onboarding-flows',
    component: FlowsPage,
    layout: '/onboarding',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/members',
    name: 'onboarding-members',
    component: MembersPage,
    layout: '/onboarding',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/tasks',
    name: 'onboarding-tasks',
    component: TasksPage,
    layout: '/onboarding',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/connections',
    name: 'onboarding-connections',
    component: ConnectionsPage,
    layout: '/onboarding',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

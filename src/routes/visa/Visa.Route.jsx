import { lazy } from 'react';
import { VisasPermissions, ManageVisasPermissions } from '../../permissions';
const DashboardPage = lazy(() =>
  import('../../pages/visa/dashboard/Dashboard.Page'),
);
const VisaPipelinePage = lazy(() =>
  import('../../pages/visa/visa-pipeline/VisaPipeline.Page'),
);
const VisaAllRequestsPage = lazy(() =>
  import('../../pages/visa/visa-all-requests/VisaAllRequests.Page'),
);
const VisaLookupPage = lazy(() =>
  import('../../pages/visa/visa-lookup/VisaLookup.Page'),
);

export const VisaRoute = [
  {
    path: '/dashboard',
    name: 'visa-dashboard',
    component: DashboardPage,
    layout: '/visa',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: VisasPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/pipeline',
    name: 'visa-pipeline',
    component: VisaPipelinePage,
    layout: '/visa',
    default: false,
    authorize: false,
    isRecursive: false,
    permissionId: ManageVisasPermissions.ManagePipeline.key,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/all-requests',
    name: 'visa-all-requests',
    component: VisaAllRequestsPage,
    layout: '/visa',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: {
      ViewVisaReservation: ManageVisasPermissions.ViewVisaReservation,
      ViewVisaAllocation: ManageVisasPermissions.ViewVisaAllocation,
    },
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/visa-Lookups',
    name: 'visa-Lookups',
    component: VisaLookupPage,
    layout: '/visa',
    default: false,
    authorize: false,
    isRecursive: false,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

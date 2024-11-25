// import { CommitteesPermissions, WorkflowsPermissions } from '../../../permissions';
import { lazy } from 'react';
const SettingsCandidatesPage = lazy(() =>
  import('../../../pages/setups/settings-setups/candidates/SettingsCandidates.Page'),
);
const PositionName = lazy(() =>
  import('../../../pages/setups/settings-setups/position-name/PositionName.Page'),
);
const EmailMasking = lazy(() =>
  import('../../../pages/setups/settings-setups/email-masking/EmailMasking.Page'),
);
const NationalitySetting = lazy(() =>
  import(
    '../../../pages/setups/settings-setups/nationality/NationalitySetting.Page'
  ),
);
const JobRequisitionSetting = lazy(() =>
  import(
    '../../../pages/setups/settings-setups/job-requisition/JobRequisitionSetting.Page'
  ),
);
export const SettingsSetupsRoute = [
  {
    path: '/candidates',
    name: 'candidates',
    component: SettingsCandidatesPage,
    layout: '/setups/settings',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/position-name',
    name: 'position-name',
    component: PositionName,
    layout: '/setups/settings',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/email-masking',
    name: 'email-masking',
    component: EmailMasking,
    layout: '/setups/settings',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/nationality-setting',
    name: 'nationality-setting',
    component: NationalitySetting,
    layout: '/setups/settings',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/job-requisition',
    name: 'job-requisition',
    component: JobRequisitionSetting,
    layout: '/setups/settings',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

import SecurityManagementPage from '../../../pages/setups/security-setups/management/SecurityManagement.Page';
import AuthenticatorAppPage from '../../../pages/setups/security-setups/authentcator-app/AuthenticatorApp.Page';
import LinkedDevicesPage from '../../../pages/setups/security-setups/linked-devices/LinkedDevices.Page';

export const SecuritySetupsRoute = [
  {
    path: '/management',
    name: 'management',
    component: SecurityManagementPage,
    layout: '/setups/security',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/Authenticator-app-setup',
    name: 'Authenticator-app-setup',
    component: AuthenticatorAppPage,
    layout: '/setups/security',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: WorkflowsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/linked-devices',
    name: 'linked-devices',
    component: LinkedDevicesPage,
    layout: '/setups/security',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: CommitteesPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

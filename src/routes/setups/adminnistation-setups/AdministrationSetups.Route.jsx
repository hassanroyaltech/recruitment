import { lazy } from 'react';
import {
  AgencyPermissions,
  BranchesPermissions,
  CategoriesPermissions,
  DataSecurityRulesPermissions,
  EmployeesPermissions,
  GroupPermissions,
  PermissionsPermissions,
  UsersPermissions,
} from '../../../permissions';

const BranchesPage = lazy(() =>
  import('../../../pages/setups/administration-setups/branches/Branches.Page'),
);
const UsersPage = lazy(() =>
  import('../../../pages/setups/administration-setups/users/Users.Page'),
);
const DataSecurityRulesPage = lazy(() =>
  import(
    '../../../pages/setups/administration-setups/data-security-rules/DataSecurityRules.Page'
  ),
);
const GroupPermissionsPage = lazy(() =>
  import(
    '../../../pages/setups/administration-setups/group-permissions/GroupPermissions.Page'
  ),
);
const CategoriesPage = lazy(() =>
  import('../../../pages/setups/administration-setups/categories/Categories.Page'),
);
const PermissionsPage = lazy(() =>
  import('../../../pages/setups/administration-setups/permissions/Permissions.Page'),
);
const TeamsPage = lazy(() =>
  import('../../../pages/setups/administration-setups/teams/Teams.Page'),
);

export const AdministrationSetupsRoute = [
  {
    path: '/branches',
    name: 'branches',
    component: BranchesPage,
    layout: '/setups/administration',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: BranchesPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: PermissionsPage,
    layout: '/setups/administration',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: PermissionsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesPage,
    layout: '/setups/administration',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: CategoriesPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/users',
    name: 'users',
    component: UsersPage,
    layout: '/setups/administration',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: {
      ...UsersPermissions,
      ...EmployeesPermissions,
      ...AgencyPermissions,
    },
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/teams',
    name: 'teams',
    component: TeamsPage,
    layout: '/setups/administration',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: [],
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/data-security-rules',
    name: 'data-security-rules',
    component: DataSecurityRulesPage,
    layout: '/setups/administration',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: DataSecurityRulesPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/group-permissions',
    name: 'group-permissions',
    component: GroupPermissionsPage,
    layout: '/setups/administration',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: GroupPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

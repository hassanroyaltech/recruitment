import {
  UsersPermissions,
  AgencyPermissions,
  EmployeesPermissions,
} from 'permissions';
import AdminsTab from '../../administration-setups/users/tabs/admins/Admins.Tab';
import EmployeesTab from '../../administration-setups/users/tabs/employees/Employees.Tab';
import ProvidersTab from '../../administration-setups/users/tabs/providers/Providers.Tab';

export const UsersTabs = [
  {
    label: 'admins',
    component: AdminsTab,
    permissionId: UsersPermissions.ViewUsers.key,
  },
  {
    label: 'employees',
    component: EmployeesTab,
    permissionId: EmployeesPermissions.ViewEmployees.key,
  },
  {
    label: 'agencies',
    component: ProvidersTab,
    props: {
      userType: 'agency',
    },
    permissionId: AgencyPermissions.ViewAgency.key,
  },
  {
    label: 'universities',
    component: ProvidersTab,
    props: {
      userType: 'university',
    },
    permissionId: AgencyPermissions.ViewAgency.key,
  },
];

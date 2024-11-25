import { InformationTab } from '../../administration-setups/users/tabs/employees/dialogs/employee-management/tabs';
import { AccessTab } from '../../administration-setups/users/dialogs/users-management/tabs';

export const EmployeeManagementTabs = [
  {
    label: 'information',
    component: InformationTab,
  },
  {
    label: 'access',
    component: AccessTab,
    props: {
      isWithoutStatus: true,
      isWithoutCategory: true,
    },
  },
  // {
  //   label: 'external',
  //   component: ExternalTab,
  // },
];

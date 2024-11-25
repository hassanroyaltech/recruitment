import { MainPermissionsTypesEnum } from '../../../enums';

export const EmployeesPermissions = {
  SuperEmployees: {
    key: '34dd8db5d3f547a2a79daf8cfddc1e0f',
  },
  AddEmployees: {
    key: 'c7fbcdf84ccf4bd58dabde9e38531c2b',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateEmployees: {
    key: '3e0b9191d2254403a51aeeadecbdad24',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteEmployees: {
    key: '898eb9cdaf6241dfbc425f005e181d19',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewEmployees: {
    key: 'dcea27d89d2f413c95ff75fd0cdea9aa',
    type: MainPermissionsTypesEnum.View.key,
  },
};

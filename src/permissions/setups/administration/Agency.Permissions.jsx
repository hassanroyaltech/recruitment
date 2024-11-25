import { MainPermissionsTypesEnum } from '../../../enums';

export const AgencyPermissions = {
  SuperAgency: {
    key: '5eaa2727a1234fe3a681b12d94b6644d',
  },
  AddAgency: {
    key: '975af2a335134f5a8c2c64f7a99433b4',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateAgency: {
    key: '08b26d8a2e8e4bb89860ee47ae2efa2e',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteAgency: {
    key: 'a78bcef305bc41d3a99c8f6b342130c7',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewAgency: {
    key: '8092906677864f31a430d4108c978019',
    type: MainPermissionsTypesEnum.View.key,
  },
};

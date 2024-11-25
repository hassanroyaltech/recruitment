import { MainPermissionsTypesEnum } from '../../../enums';
// todo:- add real uuids
export const TeamsPermissions = {
  SuperTeams: {
    key: 'fa58d828698b4bb3a3bdf1167cca1554',
  },
  AddTeams: {
    key: '8724ba262a094fa1b64c0b7552f9a592',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateTeams: {
    key: '44d3594a16a04e40b0aab7942cc2ef7d',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteTeams: {
    key: 'e049f9adf3c041e1926ba3c1f226a85c',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewTeams: {
    key: 'dad537420b2a42e0a404239b63540a68',
    type: MainPermissionsTypesEnum.View.key,
  },
};

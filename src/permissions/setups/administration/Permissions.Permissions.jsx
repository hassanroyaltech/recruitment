import { MainPermissionsTypesEnum } from '../../../enums';

export const PermissionsPermissions = {
  SuperPermissions: {
    key: '3a4cf654e8e842d69620c09eeac980d3',
  },
  AddPermissions: {
    key: '70747957f62e48388bec7ffb614ff298',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePermissions: {
    key: 'ff80700e8eeb49f58e755b40f0620df2',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePermissions: {
    key: '0116323619f1445999a570aeeade7fbd',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPermissions: {
    key: 'f12facaf740349b393e00f614c89a314',
    type: MainPermissionsTypesEnum.View.key,
  },
};

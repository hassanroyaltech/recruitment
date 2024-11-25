import { MainPermissionsTypesEnum } from '../../../enums';

export const CategoriesPermissions = {
  SuperCategories: {
    key: 'd22ea0f7fa724f9c8a9b943787eeeb2b',
  },
  AddCategories: {
    key: '080a701be6734c118e2d2182d9c5e44f',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateCategories: {
    key: 'd2d2fa87e91e4dd183791959bd4b2759',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteCategories: {
    key: 'bf8869df462e4d86a8d6bdc7e75d335b',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewCategories: {
    key: 'a6727a4391d24b35a3d8bf4f7e004657',
    type: MainPermissionsTypesEnum.View.key,
  },
};

import { MainPermissionsTypesEnum } from '../../enums';

export const VisasPermissions = {
  SuperVisa: {
    key: 'b5615e1b57a846debcb0c8415891c0d1',
  },
  AddVisa: {
    key: '1082c4ab5d544dd8bff5b8781dd5d637',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateVisa: {
    key: 'cf32b5c2491b47ceb918e394b97c3bd5',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteVisa: {
    key: '8a9ae4f3da1f459e99b35560f674a473',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewVisa: {
    key: '2d7dc0d9736e4e9f9c16a81d7b590e67',
    type: MainPermissionsTypesEnum.View.key,
  },
};

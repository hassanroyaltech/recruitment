import { MainPermissionsTypesEnum } from '../../../enums';

export const GroupPermissions = {
  SuperGroup: {
    key: '515bea64beec4fafb6917f88d5d921c4',
  },
  AddGroup: {
    key: 'c56bf5532b9d454d984e20442577d27b',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateGroup: {
    key: '7f8cd29baa5c42bea88852ac83113f27',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteGroup: {
    key: '2be220ca04bc43f5b958ac84afb544ad',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewGroup: {
    key: '4ccf8986220e42d687a5e217d57d08fa',
    type: MainPermissionsTypesEnum.View.key,
  },
};

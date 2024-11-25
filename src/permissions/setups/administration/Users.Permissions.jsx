import { MainPermissionsTypesEnum } from '../../../enums';

export const UsersPermissions = {
  SuperUsers: {
    key: '6a943ba23ee9488cac67c13139cd9cc2',
  },
  AddUsers: {
    key: '8d9a7015f0a14f75b51613b6a4087532',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateUsers: {
    key: '1f0d57fff525496b863ba9ab2fb8771d',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteUsers: {
    key: '3edc3c429867465abb89c5a0ee5c7f39',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewUsers: {
    key: 'e23d681e53d74adca43785cb67191b19',
    type: MainPermissionsTypesEnum.View.key,
  },
};

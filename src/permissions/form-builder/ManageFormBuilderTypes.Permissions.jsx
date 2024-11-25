import { MainPermissionsTypesEnum } from '../../enums';

export const ManageFormBuilderTypesPermissions = {
  SuperFormBuilderType: {
    key: 'ace2a2b3e85b4d5c9c0a81b6da62c5af',
  },
  CreateFormBuilderType: {
    key: '660039fbebb84ad4a8cf04c94971ed22',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateFormBuilderType: {
    key: '18fc89adad2b4179840307bbd747370c',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteFormBuilderType: {
    key: '5ed04823ceb34efe89f6be9633db161f',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewFormBuilderType: {
    key: 'f2f93657efa34417bc96b767331b7b1c',
    type: MainPermissionsTypesEnum.View.key,
  },
};

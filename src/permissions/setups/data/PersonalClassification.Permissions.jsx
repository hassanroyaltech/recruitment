import { MainPermissionsTypesEnum } from '../../../enums';

export const PersonalClassificationPermissions = {
  SuperPersonalClassification: {
    key: '5dc3d60c8ed046f48aae8db205b1371d',
  },
  AddPersonalClassification: {
    key: 'b71dd397d83547208641f46f3f4ef447',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePersonalClassification: {
    key: '7bb0c9d49094491fbf6ad3818d66a007',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePersonalClassification: {
    key: '61cd5f362cd547c4abea00c06a5a36f9',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPersonalClassification: {
    key: 'b46a3b8f013642dd8c505b8025dce6a4',
    type: MainPermissionsTypesEnum.View.key,
  },
};

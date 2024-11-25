import { MainPermissionsTypesEnum } from '../../../enums';

export const WorkClassificationPermissions = {
  SuperWorkClassification: {
    key: 'd88433a58477464f89e80cc872274398',
  },
  AddWorkClassification: {
    key: '4898c11c13ca480cb55eab9cce15b7e4',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateWorkClassification: {
    key: 'f89beba11e7a45ef97075d2959c71cc6',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteWorkClassification: {
    key: 'e5d9fc6c15ab4c2898948d9f7fcacd6b',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewWorkClassification: {
    key: '7c3af64a95b24f6da42bf6e6707bc33e',
    type: MainPermissionsTypesEnum.View.key,
  },
};

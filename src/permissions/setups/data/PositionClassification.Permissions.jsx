import { MainPermissionsTypesEnum } from '../../../enums';

export const PositionClassificationPermissions = {
  SuperPositionClassification: {
    key: '32d6b3e9614a4ad89ae57e586aec4ade',
  },
  AddPositionClassification: {
    key: '9f7e435db4f9487ba9a2a7e6806e5ebc',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePositionClassification: {
    key: 'ecfa4672b03b41eba0ef1c82edf55c3a',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePositionClassification: {
    key: '918d4562bacc43ce96ab386e92a43b64',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPositionClassification: {
    key: '3b2c68cf286241648bafd86e04258ab5',
    type: MainPermissionsTypesEnum.View.key,
  },
};

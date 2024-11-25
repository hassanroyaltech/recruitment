import { MainPermissionsTypesEnum } from '../../../enums';

export const FileClassificationPermissions = {
  SuperFileClassification: {
    key: '8cd2780aa4124688b60713bbf482974e',
  },
  AddFileClassification: {
    key: '05528fc6344e48e199be197f20082905',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateFileClassification: {
    key: '2238ae085f2140ed8cc3f6dc9cf7ccfa',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteFileClassification: {
    key: '0ee2545b7ddf4789986b4c8354b26d53',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewFileClassification: {
    key: 'af736f7899c64109b0929fe6a435c095',
    type: MainPermissionsTypesEnum.View.key,
  },
};

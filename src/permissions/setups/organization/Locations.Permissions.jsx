import { MainPermissionsTypesEnum } from '../../../enums';

export const LocationsPermissions = {
  SuperLocations: {
    key: '9f9e579f406443e5b74b997c33891bcb',
  },
  AddLocations: {
    key: 'ee1fabb2b8404d12adcb2928405599a0',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateLocations: {
    key: 'e4aaea8915804a6ca2f5b5191080048d',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteLocations: {
    key: '9368d3e85e284f8f83386a9a6aa93f30',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewLocations: {
    key: '09c1d91521744315b067fb773feba8fe',
    type: MainPermissionsTypesEnum.View.key,
  },
};

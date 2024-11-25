import { MainPermissionsTypesEnum } from '../../../enums';

export const MFAPermissions = {
  SuperMFA: {
    key: '602009bf7d664b6090e149697a0bace5',
  },
  GenerateCodes: {
    key: '1ada3c99ca1d4c00889c7e0ad02a46b4',
  },
  ViewCodes: {
    key: 'c7461313efb04401842560e569afc03e',
    type: MainPermissionsTypesEnum.View.key,
  },
  EnforceMFA: {
    key: '6b292d09805245328dc31f75f7c3a970',
  },
};

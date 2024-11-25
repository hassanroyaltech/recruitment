import { MainPermissionsTypesEnum } from '../../enums';

export const EmailTemplatesPermissions = {
  SuperEmail: {
    key: '27c189140d2346f4845ee2988d6ba27a',
  },
  AddNewEmail: {
    key: '360b4578075d47e0a9bfa1c2047de25a',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateEmail: {
    key: 'cbe02610544b4e128eec7b445e5b615c',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteEmail: {
    key: '89a48094ac3048d6b7d7df20aca29f36',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewEmail: {
    key: '8d10881922a949ad8810e8ceb1cce1db',
    type: MainPermissionsTypesEnum.View.key,
  },
  IndexEmail: {
    key: '9929a3edf6724a8ba5912d589c1d8126',
  },
};

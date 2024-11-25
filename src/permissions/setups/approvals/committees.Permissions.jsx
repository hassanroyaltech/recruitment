import { MainPermissionsTypesEnum } from '../../../enums';

export const CommitteesPermissions = {
  SuperCommittees: {
    key: '2569e5a7a84141d4890cd0948c432199',
  },
  AddCommittees: {
    key: '6ef4474b049d48c3a5c57377546850c6',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateCommittees: {
    key: '9a0bc942db6c4eecadf363359699a86e',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteCommittees: {
    key: '7fdcd1f8ee6c406d993433ef472a8288',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewCommittees: {
    key: '1894628e74d241c4b765ccb39ff4949c',
    type: MainPermissionsTypesEnum.View.key,
  },
};

import { MainPermissionsTypesEnum } from '../../enums';

export const PreScreeningApprovalPermissions = {
  SuperPreScreening: {
    key: 'c0982e91d5784a499fc442276d21ec50',
  },
  AddPreScreening: {
    key: 'bde5257b91dc424f8297c6fafa4be96c',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePreScreening: {
    key: 'ca8dada2f3814611a231471ee01f2191',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePreScreening: {
    key: '6820c18d9c5f4f429267a47b5d3b5786',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPreScreening: {
    key: 'dbacefb1de3a477e95ab74e54733feb5',
    type: MainPermissionsTypesEnum.View.key,
  },
  AddToPreScreening: {
    key: '3fea26dfef4a420f984dd803520e2ddd',
  },
  AddCandidates: {
    key: '49007baa456341f8b202feb501724e78',
  },
  AssignUser: {
    key: 'd7788ffa3678461b952fb966d70c1d8a',
  },
};

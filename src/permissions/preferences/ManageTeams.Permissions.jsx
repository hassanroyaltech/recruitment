import { MainPermissionsTypesEnum } from '../../enums';

export const ManageTeamsPermissions = {
  SuperTeams: {
    key: '41632c78d7804b0dadfce7c7e7e02a2d',
  },
  AddTeams: {
    key: '482437f156c843aaa9017cf5f391a1ae',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateTeams: {
    key: 'b7f05c85ae6f4f349305048781e56a0d',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteTeams: {
    key: 'e0e9a952ed534e4c9ac9d0c5507b7775',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewTeams: {
    key: 'e0aebb0b27fb4f2095c772cf594c8c6a',
    type: MainPermissionsTypesEnum.View.key,
  },
  IndexTeams: {
    key: '1994af6d148f4e51bb52795cb82a5a7f',
  },
};

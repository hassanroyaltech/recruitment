import { MainPermissionsTypesEnum } from '../../../enums';

export const OrganizationGroupPermissions = {
  SuperOrganizationGroup: {
    key: 'd405a7cbd634436dbecaa4a324749fcd',
  },
  AddOrganizationGroup: {
    key: 'c15acd4e7bcf483c8ff76291507e29aa',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateOrganizationGroup: {
    key: '9dda84f21fd7416492a962fa1b7ddb41',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteOrganizationGroup: {
    key: 'ec197f2cef5047bfb38bf4621255a4a1',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewOrganizationGroup: {
    key: 'a5c3a39b0126419487d5f8d35106837f',
    type: MainPermissionsTypesEnum.View.key,
  },
};

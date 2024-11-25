import { MainPermissionsTypesEnum } from '../enums';

export const AnalyticsPermissions = {
  SuperAnalytics: {
    key: '6f07e59190414b2da8109af673fc962f',
  },
  AddAnalytics: {
    key: '1ef8bcc8135e4322b85bd2d673fa9a87',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateAnalytics: {
    key: '7d58a39740d74fa3a5c5d29e10209da3',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteAnalytics: {
    key: '1a447725589c4bf1a28d7e1dd073cb87',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewAnalytics: {
    key: 'e13bdf6dafac43de9cda40f56b909e6f',
    type: MainPermissionsTypesEnum.View.key,
  },
};

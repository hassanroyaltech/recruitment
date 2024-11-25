import { MainPermissionsTypesEnum } from '../enums';

export const NewAnalyticsPermissions = {
  SuperAnalytics: {
    key: '08d574a72b7b46f3b5c56d89a34e0fae',
  },
  ViewReports: {
    key: 'b6469282659d48588f25ad5c7963bffe',
    type: MainPermissionsTypesEnum.View.key,
  },
  AddDashboard: {
    key: '32e692895fa74b17ad881067b2ed3737',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateADashboard: {
    key: 'fac753171236401184212983d16b88ea',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteDashboard: {
    key: '16edaa50e7394cf4a3b0146033903ea0',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewDashboards: {
    key: '1f51ef2f508b4110a42738f147ded7a1',
    type: MainPermissionsTypesEnum.View.key,
  },
};

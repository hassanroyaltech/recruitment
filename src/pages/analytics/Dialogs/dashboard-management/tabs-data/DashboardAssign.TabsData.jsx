import {
  AnalyticsDashboardMembersTypesEnum,
  AnalyticsDashboardPermissionsTypesEnum,
  FormsMembersTypesEnum,
} from '../../../../../enums';
import {
  GetAllSetupsEmployees,
  GetAllSetupsPositions,
  GetAllSetupsTeams,
  GetAllSetupsUsers,
} from '../../../../../services';
import FormMemberTab from '../../../../form-builder-v2/popovers/tabs/FormMember.Tab';

export const DashboardAssignTabsData = [
  {
    key: 1,
    label: AnalyticsDashboardMembersTypesEnum.Employees.value,
    component: FormMemberTab,
    props: {
      type: AnalyticsDashboardMembersTypesEnum.Employees.key,
      listAPI: GetAllSetupsEmployees,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
      withAnalyticsPermissions: true,
      extraStateData: {
        permission: AnalyticsDashboardPermissionsTypesEnum.View.key,
      },
    },
  },
  {
    key: 2,
    label: AnalyticsDashboardMembersTypesEnum.Users.value,
    component: FormMemberTab,
    props: {
      type: AnalyticsDashboardMembersTypesEnum.Users.key,
      listAPI: GetAllSetupsUsers,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
      withAnalyticsPermissions: true,
      extraStateData: {
        permission: AnalyticsDashboardPermissionsTypesEnum.View.key,
      },
    },
  },
  {
    key: 3,
    label: AnalyticsDashboardMembersTypesEnum.Teams.value,
    component: FormMemberTab,
    props: {
      type: AnalyticsDashboardMembersTypesEnum.Teams.key,
      listAPI: GetAllSetupsTeams,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
      withAnalyticsPermissions: true,
      extraStateData: {
        permission: AnalyticsDashboardPermissionsTypesEnum.View.key,
      },
    },
  },
  {
    key: 4,
    label: AnalyticsDashboardMembersTypesEnum.Positions.value,
    component: FormMemberTab,
    props: {
      type: AnalyticsDashboardMembersTypesEnum.Positions.key,
      listAPI: GetAllSetupsPositions,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
      withAnalyticsPermissions: true,
      extraStateData: {
        permission: AnalyticsDashboardPermissionsTypesEnum.View.key,
      },
    },
  },
];

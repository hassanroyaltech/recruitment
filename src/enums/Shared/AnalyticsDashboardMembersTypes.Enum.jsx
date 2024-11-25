import {
  GetAllSetupsPositions,
  GetAllSetupsTeams,
  GetAllSetupsEmployees,
  GetAllSetupsUsers,
} from '../../services';

export const AnalyticsDashboardMembersTypesEnum = {
  Teams: {
    key: 1,
    value: 'teams',
    dataKey: 'teams',
    getDataApi: GetAllSetupsTeams,
  },
  Employees: {
    key: 2,
    value: 'employees',
    dataKey: 'employees',
    getDataApi: GetAllSetupsEmployees,
  },
  Users: {
    key: 3,
    value: 'users',
    dataKey: 'users',
    getDataApi: GetAllSetupsUsers,
  },
  Positions: {
    key: 4,
    value: 'positions',
    dataKey: 'positions',
    getDataApi: GetAllSetupsPositions,
  },
};

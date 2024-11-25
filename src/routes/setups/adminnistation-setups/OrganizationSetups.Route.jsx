import { lazy } from 'react';
import {
  PositionsPermissions,
  HierarchyPermissions,
  HierarchyLevelsPermissions,
  LocationsPermissions,
  OrganizationGroupPermissions,
  PositionTitlePermissions,
  JobsTitlesPermissions,
  ProjectsPermissions,
  SponsorsPermissions,
} from '../../../permissions';
const HierarchyPage = lazy(() =>
  import('../../../pages/setups/organization-setups/hierarchy/Hierarchy.Page'),
);
const ProjectsPage = lazy(() =>
  import('../../../pages/setups/organization-setups/projects/Projects.Page'),
);
const LocationsPage = lazy(() =>
  import('../../../pages/setups/organization-setups/locations/Locations.Page'),
);
const SponsorsPage = lazy(() =>
  import('../../../pages/setups/organization-setups/sponsors/Sponsors.Page'),
);
const PositionsPage = lazy(() =>
  import('../../../pages/setups/organization-setups/positions/Positions.Page'),
);
const JobTitlePage = lazy(() =>
  import('../../../pages/setups/organization-setups/position-title/JobTitle.Page'),
);
const JobsTitlesPage = lazy(() =>
  import('../../../pages/setups/organization-setups/jobs-titles/JobsTitles.page'),
);
const OrganizationGroupPage = lazy(() =>
  import(
    '../../../pages/setups/organization-setups/organization-group/OrganizationGroup.Page'
  ),
);
const HierarchyLevelPage = lazy(() =>
  import(
    '../../../pages/setups/organization-setups/hierarchy-level/HierarchyLevels.Page'
  ),
);
const NewOrganizationGroupPage = lazy(() =>
  import(
    '../../../pages/setups/organization-setups/new-organization-group/OrganizationGroup.Page'
  ),
);

export const OrganizationSetupsRoute = [
  {
    path: '/hierarchy-levels',
    name: 'hierarchy-levels',
    component: HierarchyLevelPage,
    layout: '/setups/organization',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: HierarchyLevelsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/hierarchy',
    name: 'hierarchy',
    component: HierarchyPage,
    layout: '/setups/organization',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: HierarchyPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: ProjectsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/locations',
    name: 'locations',
    component: LocationsPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: LocationsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/sponsors',
    name: 'sponsors',
    component: SponsorsPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: SponsorsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/positions',
    name: 'positions',
    component: PositionsPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: PositionsPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/setup-title',
    name: 'job-title',
    component: JobTitlePage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: PositionTitlePermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/jobs-titles',
    name: 'jobs-titles',
    component: JobsTitlesPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: JobsTitlesPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/business-group',
    name: 'business-group',
    component: OrganizationGroupPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: OrganizationGroupPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/organization-group',
    name: 'organization-group',
    component: NewOrganizationGroupPage,
    layout: '/setups/organization',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OrganizationGroupPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

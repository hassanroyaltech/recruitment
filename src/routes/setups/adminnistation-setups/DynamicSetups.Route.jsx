import { lazy } from 'react';
import { PersonalClassificationPermissions } from 'permissions';
const ListDynamicLookupsPage = lazy(() =>
  import(
    'pages/setups/dynamic-lookups/list-dynamic-lookups/ListDynamicLookups.Page'
  ),
);
const ManageDynamicLookupsPage = lazy(() =>
  import(
    'pages/setups/dynamic-lookups/manage-dynamic-lookups/ManageDynamicLookups.Page'
  ),
);

export const DynamicSetupsRoute = [
  {
    path: '/manage-dynamic',
    name: 'manage-dynamic',
    component: ManageDynamicLookupsPage,
    layout: '/setups/dynamic',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: PersonalClassificationPermissions, //change later
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/list-dynamic',
    name: 'list-dynamic',
    component: ListDynamicLookupsPage,
    layout: '/setups/dynamic',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: PersonalClassificationPermissions, //change later
    isRoute: true,
    isExact: true,
    children: [],
  },
];

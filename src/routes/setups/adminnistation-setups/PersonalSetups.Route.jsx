import { lazy } from 'react';
import {
  EducationPermissions,
  FileClassificationPermissions,
  OfferClassificationPermissions,
  PersonalClassificationPermissions,
  WorkClassificationPermissions,
} from '../../../permissions';
// import { PositionClassificationPermissions }
// from '../../../permissions/setups/data/PositionClassification.Permissions';

const PersonalClassificationPage = lazy(() =>
  import(
    '../../../pages/setups/personal-setups/personal-classification/PersonalClassification.Page'
  ),
);
const EducationClassificationPage = lazy(() =>
  import(
    '../../../pages/setups/personal-setups/education-classification/EducationClassification.Page'
  ),
);
const WorkClassificationPage = lazy(() =>
  import(
    '../../../pages/setups/personal-setups/work-classification/WorkClassification.Page'
  ),
);
const OfferClassificationPage = lazy(() =>
  import(
    '../../../pages/setups/personal-setups/offer-classification/OfferClassification.Page'
  ),
);
const CandidatePropertiesPage = lazy(() =>
  import(
    'pages/setups/personal-setups/candidate-properties/CandidateProperties.Page'
  ),
);
const FileClassificationPage = lazy(() =>
  import(
    '../../../pages/setups/personal-setups/file-classification/FileClassification.Page'
  ),
);

export const PersonalSetupsRoute = [
  {
    path: '/personal-classification',
    name: 'personal-classification',
    component: PersonalClassificationPage,
    layout: '/setups/personal',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: PersonalClassificationPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/education-classification',
    name: 'education-classification',
    component: EducationClassificationPage,
    layout: '/setups/personal',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: EducationPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/work-classification',
    name: 'work-classification',
    component: WorkClassificationPage,
    layout: '/setups/personal',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: WorkClassificationPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  // {
  //   path: '/position-classification',
  //   name: 'position-classification',
  //   component: PositionClassificationPage,
  //   layout: '/setups/personal',
  //   default: false,
  //   authorize: false,
  //   isRecursive: false,
  //   defaultPermissions: PositionClassificationPermissions,
  //   isRoute: true,
  //   isExact: true,
  //   children: [],
  // },
  {
    path: '/offer-classification',
    name: 'offer-classification',
    component: OfferClassificationPage,
    layout: '/setups/personal',
    default: false,
    authorize: false,
    isRecursive: false,
    defaultPermissions: OfferClassificationPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/candidate-properties',
    name: 'candidate-properties',
    component: CandidatePropertiesPage,
    layout: '/setups/personal',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OfferClassificationPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/file-classification',
    name: 'file-classification',
    component: FileClassificationPage,
    layout: '/setups/personal',
    default: true,
    authorize: false,
    isRecursive: false,
    defaultPermissions: FileClassificationPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

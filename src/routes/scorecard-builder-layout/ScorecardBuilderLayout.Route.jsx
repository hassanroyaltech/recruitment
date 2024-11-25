import { lazy } from 'react';

const ScorecardBuilder = lazy(() =>
  import(
    '../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/Scorecard.Builder'
  ),
);

export const ScorecardBuilderLayoutRoute = [
  {
    path: '/scorecard-builder',
    name: 'scorecard-builder',
    component: ScorecardBuilder,
    layout: '',
    default: true,
    authorize: true,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

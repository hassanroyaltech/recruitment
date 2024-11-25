import { lazy } from 'react';
const RecipientLoginPage = lazy(() =>
  import('../../pages/auth/RecipientLogin.Page'),
);
const FormBuilderPage = lazy(() =>
  import('../../pages/form-builder-v2/FormBuilder.Page'),
);

const InvitationsPage = lazy(() => import('pages/invitations/Invitations.Page'));

export const FormBuilderLayoutRoute = [
  {
    path: '/v2/recipient-login',
    name: 'recipient-login',
    component: RecipientLoginPage,
    layout: '',
    default: true,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/forms',
    name: 'form-builder',
    component: FormBuilderPage,
    layout: '',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
  {
    path: '/onboarding/invitations',
    name: 'onboarding-invitations',
    component: InvitationsPage,
    layout: '',
    default: false,
    authorize: false,
    isRecursive: false,
    // defaultPermissions: OnboardingPermissions,
    isRoute: true,
    isExact: true,
    children: [],
  },
];

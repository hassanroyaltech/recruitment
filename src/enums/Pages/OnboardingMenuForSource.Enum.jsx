import {
  GetAllOnboardingDirectory,
  GetOnboardingInvitations,
  GetOnboardingInvitationsRecipient,
} from '../../services';

export const OnboardingMenuForSourceEnum = {
  Onboarding: {
    key: 1,
    isWithActions: true,
    isWithAddActions: true,
    redirectPath: '/onboarding/connections',
    callAPI: GetAllOnboardingDirectory,
  },
  Invitations: {
    key: 2,
    callAPI: GetOnboardingInvitations,
    callAPIRecipient: GetOnboardingInvitationsRecipient,
  },
  Forms: {
    key: 3,
    callAPI: GetOnboardingInvitations,
    callAPIRecipient: GetOnboardingInvitationsRecipient,
  },
  CandidateProfile: {
    key: 4,
    isDataPassedFromParent: true,
    // callAPI: GetOnboardingInvitations,
    // callAPIRecipient: GetOnboardingInvitationsRecipient,
  },
};

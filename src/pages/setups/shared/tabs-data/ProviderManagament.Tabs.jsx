import {
  InvitationTab,
  TermsAndConditionsTab,
} from '../../administration-setups/users/tabs/providers/dialogs/provider-management/tabs/index';

export const ProviderManagementTabs = [
  {
    label: 'invite',
    component: InvitationTab,
    isWithCustomLabel: true,
  },
  {
    label: 'terms-and-conditions',
    component: TermsAndConditionsTab,
    props: {
      isWithoutStatus: true,
      isWithoutCategory: true,
    },
  },
];

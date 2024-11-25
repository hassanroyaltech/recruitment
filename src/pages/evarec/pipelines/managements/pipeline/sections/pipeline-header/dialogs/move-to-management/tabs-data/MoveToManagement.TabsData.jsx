import { InviteToOnboardingMembersTypesEnum } from '../../../../../../../../../../enums';
import FormMemberTab from '../../../../../../../../../form-builder-v2/popovers/tabs/FormMember.Tab';
import {
  GetAllEvaRecPipelineTeams,
  GetAllSetupsCommittees,
  GetAllSetupsTeams,
} from '../../../../../../../../../../services';

export const MoveToManagementTabsData = [
  {
    key: InviteToOnboardingMembersTypesEnum.UsersAndEmployees.key,
    label: InviteToOnboardingMembersTypesEnum.UsersAndEmployees.value,
    component: FormMemberTab,
    props: {
      type: InviteToOnboardingMembersTypesEnum.UsersAndEmployees.type,
      listAPI: GetAllEvaRecPipelineTeams,
      isWithJobsFilter: false,
      imageAltValue: undefined,
      isImage: false,
      nameKey: 'label',
      uuidKey: 'value',
    },
  },
  // {
  //   key: InviteToOnboardingMembersTypesEnum.Teams.key,
  //   label: InviteToOnboardingMembersTypesEnum.Teams.value,
  //   component: FormMemberTab,
  //   props: {
  //     type: InviteToOnboardingMembersTypesEnum.Teams.type,
  //     listAPI: GetAllSetupsTeams,
  //     listAPIDataPath: undefined,
  //     imageAltValue: undefined,
  //     isImage: false,
  //   },
  // },
  // {
  //   key: InviteToOnboardingMembersTypesEnum.Committee.key,
  //   label: InviteToOnboardingMembersTypesEnum.Committee.value,
  //   component: FormMemberTab,
  //   props: {
  //     type: InviteToOnboardingMembersTypesEnum.Committee.type,
  //     listAPI: GetAllSetupsCommittees,
  //     listAPIDataPath: undefined,
  //     imageAltValue: undefined,
  //     isImage: false,
  //   },
  // },
];

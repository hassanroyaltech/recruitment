import { FormsMembersTypesEnum } from '../../../../../enums';
import {
  GetAllSetupsEmployees,
  GetAllSetupsPositions,
  GetAllSetupsTeams,
  GetAllSetupsUsers,
  GetPipelineStageCandidates,
} from '../../../../../services';
import FormMemberTab from '../../../../form-builder-v2/popovers/tabs/FormMember.Tab';
import CustomOnboardingMemberTab from '../../../../form-builder-v2/popovers/tabs/CustomOnboardingMember.Tab';

export const FormInviteTabsData = [
  {
    key: 1,
    label: FormsMembersTypesEnum.Candidates.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Candidates.key,
      listAPI: GetPipelineStageCandidates,
      isWithJobsFilter: true,
      isReadJobFromParent: true,
      listAPIDataPath: 'candidate',
      listAPITotalPath: 'total_with_filters',
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 2,
    label: FormsMembersTypesEnum.Employees.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Employees.key,
      listAPI: GetAllSetupsEmployees,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 3,
    label: FormsMembersTypesEnum.Users.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Users.key,
      listAPI: GetAllSetupsUsers,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 4,
    label: FormsMembersTypesEnum.Teams.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Teams.key,
      listAPI: GetAllSetupsTeams,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 5,
    label: FormsMembersTypesEnum.Positions.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Positions.key,
      listAPI: GetAllSetupsPositions,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 5,
    label: FormsMembersTypesEnum.Others.value,
    component: CustomOnboardingMemberTab,
    props: {
      type: FormsMembersTypesEnum.Others.key,
      listAPI: undefined,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

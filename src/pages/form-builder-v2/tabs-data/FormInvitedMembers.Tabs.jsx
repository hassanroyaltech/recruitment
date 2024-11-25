import { FormsMembersTypesEnum } from '../../../enums';
import {
  GetAllSetupsEmployees,
  GetAllSetupsPositions,
  GetAllSetupsTeams,
  GetAllSetupsUsers,
  GetAllStagesCandidates,
  GetJobPipelineCandidates,
} from '../../../services';
import FormMemberTab from '../popovers/tabs/FormMember.Tab';

export const FormInvitedMembersTabs = [
  {
    key: 1,
    label: FormsMembersTypesEnum.Stages.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Stages.key,
      listAPI: GetAllStagesCandidates,
      listAPIDataPath: 'stages',
      isWithIndeterminate: true,
      listAPITotalPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 2,
    label: FormsMembersTypesEnum.Candidates.value,
    component: FormMemberTab,
    props: {
      type: FormsMembersTypesEnum.Candidates.key,
      listAPI: GetJobPipelineCandidates,
      listAPIDataPath: 'candidates',
      listAPITotalPath: 'total',
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 3,
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
    key: 4,
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
    key: 5,
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
    key: 6,
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
];

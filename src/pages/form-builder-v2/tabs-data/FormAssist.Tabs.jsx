import { FormsAssistTypesEnum, FormsFieldAssistTypesEnum } from '../../../enums';
import {
  GetAllSetupsEmployees,
  GetAllSetupsPositions,
  GetAllSetupsTeams,
  GetAllSetupsUsers,
} from '../../../services';
import FormMemberTab from '../popovers/tabs/FormMember.Tab';
import { FormsFieldCollaboratorsTypesEnum } from '../../../enums/Shared/FormsFieldCollaboratorsTypes.Enum';

export const FormAssistTabs = [
  {
    key: 1,
    label: FormsAssistTypesEnum.Employees.value,
    component: FormMemberTab,
    props: {
      type: FormsAssistTypesEnum.Employees.key,
      listAPI: GetAllSetupsEmployees,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 2,
    label: FormsAssistTypesEnum.Users.value,
    component: FormMemberTab,
    props: {
      type: FormsAssistTypesEnum.Users.key,
      listAPI: GetAllSetupsUsers,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 3,
    label: FormsAssistTypesEnum.Teams.value,
    component: FormMemberTab,
    props: {
      type: FormsAssistTypesEnum.Teams.key,
      listAPI: GetAllSetupsTeams,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 4,
    label: FormsAssistTypesEnum.Positions.value,
    component: FormMemberTab,
    props: {
      type: FormsAssistTypesEnum.Positions.key,
      listAPI: GetAllSetupsPositions,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 5,
    label: FormsFieldAssistTypesEnum.Collaborators.value,
    component: FormMemberTab,
    props: {
      type: FormsFieldAssistTypesEnum.Collaborators.key,
      listAPIDataPath: undefined,
      isStaticDataList: true,
      dataList: Object.values(FormsFieldCollaboratorsTypesEnum),
      nameKey: 'name',
      uuidKey: 'key',
      isDisabledTextSearch: true,
    },
  },
];

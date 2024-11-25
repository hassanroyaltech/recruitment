import { FormsFieldAssistTypesEnum } from '../../../enums';
import {
  GetAllSetupsEmployees,
  GetAllSetupsPositions,
  GetAllSetupsTeams,
  GetAllSetupsUsers,
} from '../../../services';
import FormMemberTab from '../popovers/tabs/FormMember.Tab';
import { FormsFieldCollaboratorsTypesEnum } from '../../../enums/Shared/FormsFieldCollaboratorsTypes.Enum';

export const FormFieldAssistTabs = [
  {
    key: 1,
    label: FormsFieldAssistTypesEnum.Employees.value,
    component: FormMemberTab,
    props: {
      type: FormsFieldAssistTypesEnum.Employees.key,
      listAPI: GetAllSetupsEmployees,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 2,
    label: FormsFieldAssistTypesEnum.Users.value,
    component: FormMemberTab,
    props: {
      type: FormsFieldAssistTypesEnum.Users.key,
      listAPI: GetAllSetupsUsers,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 3,
    label: FormsFieldAssistTypesEnum.Teams.value,
    component: FormMemberTab,
    props: {
      type: FormsFieldAssistTypesEnum.Teams.key,
      listAPI: GetAllSetupsTeams,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 4,
    label: FormsFieldAssistTypesEnum.Positions.value,
    component: FormMemberTab,
    props: {
      type: FormsFieldAssistTypesEnum.Positions.key,
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

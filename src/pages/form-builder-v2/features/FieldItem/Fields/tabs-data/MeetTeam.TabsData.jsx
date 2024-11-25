import {
  GetAllSetupsEmployees,
  GetAllSetupsPositions,
  GetAllSetupsUsers,
} from '../../../../../../services';
import CustomMemberTab from '../../../../popovers/tabs/CustomMember.Tab';
import FormMemberTab from '../../../../popovers/tabs/FormMember.Tab';
import { FormsMembersTypesEnum } from '../../../../../../enums';

export const MeetTeamTabs = [
  {
    key: 1,
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
    key: 2,
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
    key: 3,
    label: 'Custom',
    component: CustomMemberTab,
    props: {
      type: 10,
      listAPI: GetAllSetupsPositions,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

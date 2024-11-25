import { ScorecardAssigneeTypesEnum } from '../../../../../enums';
import {
  GetAllEvaRecPipelineTeams,
  ScorecardGetOtherUsersToAssign,
} from '../../../../../services';
import FormMemberTab from '../../../../form-builder-v2/popovers/tabs/FormMember.Tab';

export const ScorecardAssignTabs = [
  {
    key: ScorecardAssigneeTypesEnum.UsersAndEmployees.key,
    label: ScorecardAssigneeTypesEnum.UsersAndEmployees.value,
    component: FormMemberTab,
    props: {
      type: ScorecardAssigneeTypesEnum.UsersAndEmployees.type,
      listAPI: GetAllEvaRecPipelineTeams,
      isWithJobsFilter: false,
      imageAltValue: undefined,
      isFromAssist: false,
      isImage: false,
      nameKey: 'label',
      uuidKey: 'value',
    },
  },
  {
    key: ScorecardAssigneeTypesEnum.Others.key,
    label: ScorecardAssigneeTypesEnum.Others.value,
    component: FormMemberTab,
    props: {
      type: ScorecardAssigneeTypesEnum.Others.type,
      listAPI: ScorecardGetOtherUsersToAssign,
      isWithJobsFilter: false,
      imageAltValue: undefined,
      isFromAssist: false,
      isImage: false,
      nameKey: 'label',
      uuidKey: 'value',
      isDisabledTextSearch: true,
    },
  },
];

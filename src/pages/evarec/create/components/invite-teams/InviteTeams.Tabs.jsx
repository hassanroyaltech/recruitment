import { GetAllEvaRecPipelineTeams } from '../../../../../services';
import FormMemberTab from '../../../../form-builder-v2/popovers/tabs/FormMember.Tab';
import { JobInviteRecruiterTypesEnum } from '../../../../../enums';

export const InviteTeamsTabs = [
  {
    key: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
    label: JobInviteRecruiterTypesEnum.UsersAndEmployees.value,
    component: FormMemberTab,
    props: {
      type: JobInviteRecruiterTypesEnum.UsersAndEmployees.type,
      listAPI: GetAllEvaRecPipelineTeams,
      isWithJobsFilter: false,
      imageAltValue: undefined,
      isFromAssist: false,
      isImage: false,
      nameKey: 'label',
      uuidKey: 'value',
    },
  },
];

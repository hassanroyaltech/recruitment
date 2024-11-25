import { AssignCandidatesToUsersTypesEnum } from '../../../../../../../../../enums';
import {
  GetAllStagesCandidates,
  GetJobPipelineCandidates,
} from '../../../../../../../../../services';
import FormMemberTab from '../../../../../../../../form-builder-v2/popovers/tabs/FormMember.Tab';

export const AssignCandidatesTabs = [
  {
    key: 1,
    label: AssignCandidatesToUsersTypesEnum.JobStage.value,
    component: FormMemberTab,
    props: {
      type: AssignCandidatesToUsersTypesEnum.JobStage.key,
      listAPI: GetAllStagesCandidates,
      listAPIDataPath: 'stages',
      listAPITotalPath: undefined,
      imageAltValue: undefined,
      isWithIndeterminate: true,
      isImage: false,
    },
  },
  {
    key: 2,
    label: AssignCandidatesToUsersTypesEnum.JobCandidate.value,
    component: FormMemberTab,
    props: {
      type: AssignCandidatesToUsersTypesEnum.JobCandidate.key,
      listAPI: GetJobPipelineCandidates,
      listAPIDataPath: 'candidates',
      listAPITotalPath: 'total',
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

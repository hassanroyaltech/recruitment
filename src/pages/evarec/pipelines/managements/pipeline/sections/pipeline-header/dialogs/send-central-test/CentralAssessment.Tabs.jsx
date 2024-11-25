import { AssessmentTestMembersTypeEnum } from '../../../../../../../../../enums';
import {
  GetAllStagesCandidates,
  GetJobPipelineCandidates,
} from '../../../../../../../../../services';
import FormMemberTab from '../../../../../../../../form-builder-v2/popovers/tabs/FormMember.Tab';

export const CentralAssessmentTabs = [
  {
    key: 1,
    label: AssessmentTestMembersTypeEnum.JobStage.value,
    component: FormMemberTab,
    props: {
      type: AssessmentTestMembersTypeEnum.JobStage.key,
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
    label: AssessmentTestMembersTypeEnum.JobCandidate.value,
    component: FormMemberTab,
    props: {
      type: AssessmentTestMembersTypeEnum.JobCandidate.key,
      listAPI: GetJobPipelineCandidates,
      listAPIDataPath: 'candidates',
      listAPITotalPath: 'total',
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

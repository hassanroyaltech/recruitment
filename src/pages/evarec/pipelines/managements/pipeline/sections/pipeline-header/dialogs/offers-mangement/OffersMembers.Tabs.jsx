import { OfferAssignTypesEnum } from '../../../../../../../../../enums';
import {
  GetAllStagesCandidates,
  GetJobPipelineCandidates,
} from '../../../../../../../../../services';
import FormMemberTab from '../../../../../../../../form-builder-v2/popovers/tabs/FormMember.Tab';

export const OffersMembersTabs = [
  {
    key: 1,
    label: OfferAssignTypesEnum.JobStage.value,
    component: FormMemberTab,
    props: {
      type: OfferAssignTypesEnum.JobStage.key,
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
    label: OfferAssignTypesEnum.JobCandidate.value,
    component: FormMemberTab,
    props: {
      type: OfferAssignTypesEnum.JobCandidate.key,
      listAPI: GetJobPipelineCandidates,
      listAPIDataPath: 'candidates',
      listAPITotalPath: 'total',
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

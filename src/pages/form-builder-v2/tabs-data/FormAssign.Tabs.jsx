import { FormsAssignTypesEnum, FormsFieldAssistTypesEnum } from '../../../enums';
import { GetAllStagesCandidates, GetJobPipelineCandidates } from '../../../services';
import FormMemberTab from '../popovers/tabs/FormMember.Tab';
import { FormsFieldCollaboratorsTypesEnum } from '../../../enums/Shared/FormsFieldCollaboratorsTypes.Enum';

export const FormAssignTabs = [
  {
    key: 1,
    label: FormsAssignTypesEnum.JobStage.value,
    component: FormMemberTab,
    props: {
      type: FormsAssignTypesEnum.JobStage.key,
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
    label: FormsAssignTypesEnum.JobCandidate.value,
    component: FormMemberTab,
    props: {
      type: FormsAssignTypesEnum.JobCandidate.key,
      listAPI: GetJobPipelineCandidates,
      listAPIDataPath: 'candidates',
      listAPITotalPath: 'total',
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
      dataList: Object.values(FormsFieldCollaboratorsTypesEnum),
      nameKey: 'name',
      uuidKey: 'key',
      isDisabledTextSearch: true,
      isStaticDataList: true,
    },
  }
];

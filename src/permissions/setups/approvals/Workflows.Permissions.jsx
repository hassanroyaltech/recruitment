import { MainPermissionsTypesEnum } from '../../../enums';

export const WorkflowsPermissions = {
  SuperWorkflows: {
    key: 'e2de0376d24d47dea2271a6e6196cc92',
  },
  AddWorkflows: {
    key: '88bd64bb4775421d9837738859b1c0ef',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateWorkflows: {
    key: 'ecaf5330a4324c739776a444cb22f455',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteWorkflows: {
    key: '6b04ea04307d4366aafa821e54962141',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewWorkflows: {
    key: 'f98f617d8a5c4ef5aafa7cd800f215fc',
    type: MainPermissionsTypesEnum.View.key,
  },
  JobRequisition: {
    key: 'd26839f13b5d4266967236a18b725135',
  },
  GeneralRequisition: {
    key: '86b0e8c5ac3d41b6abe0f64f550420ea',
  },
  OfferApproval: {
    key: '7501461ad836400f9020b99de0747d97',
  },
  ContractApproval: {
    key: 'fb3bf49e15414372ab19eb5abe7d7bdd',
  },
  RehireApproval: {
    key: '82f9aa3efb384f8fb06d5f4a6dac196c',
  },
  RelativeApproval: {
    key: 'faeb95b20f19490695de2e51556d0890',
  },
  InterviewApproval: {
    key: 'a4b7d04dd6cf489cb0b9a00c100ba472',
  },
  JobPosting: {
    key: '5bd246c501a0498c91f83c02c3a5d127',
  },
};

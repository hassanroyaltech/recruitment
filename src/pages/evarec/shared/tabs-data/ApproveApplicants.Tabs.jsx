import { ApproveApplicantsTypesEnum } from '../../../../enums';

export const ApproveApplicantsTabs = [
  {
    label: 'all-applicants',
    key: -1,
  },
  {
    label: ApproveApplicantsTypesEnum.Pending.value,
    key: ApproveApplicantsTypesEnum.Pending.key,
  },
  {
    label: ApproveApplicantsTypesEnum.Approved.value,
    key: ApproveApplicantsTypesEnum.Approved.key,
  },
  {
    label: ApproveApplicantsTypesEnum.ImmediateHire.value,
    key: ApproveApplicantsTypesEnum.ImmediateHire.key,
  },
  {
    label: ApproveApplicantsTypesEnum.RetainForFuture.value,
    key: ApproveApplicantsTypesEnum.RetainForFuture.key,
  },
  {
    label: ApproveApplicantsTypesEnum.Rejected.value,
    key: ApproveApplicantsTypesEnum.Rejected.key,
  },
];

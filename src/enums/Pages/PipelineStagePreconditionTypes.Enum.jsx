import { DefaultFormsTypesEnum } from './DefaultFormsTypes.Enum';
import { FormsStatusesEnum, OffersStatusesEnum } from '../Shared';

export const PipelineStagePreconditionTypesEnum = {
  Offers: {
    key: 1,
    value: 'offers',
    isWithTemplateStatus: true,
    inlineStatusLabel: 'offer-statuses',
    statusPlaceholder: 'select-offer-statuses',
    templateTypesVersion: 'v1',
    statuses: Object.values(OffersStatusesEnum),
  },
  Forms: {
    key: 7,
    value: 'forms',
    inlineStatusLabel: 'form-statuses',
    statusPlaceholder: 'select-form-statuses',
    isWithTemplateStatus: true,
    templateTypesVersion: 'v2',
    // templateType: DefaultFormsTypesEnum.Forms.key,
    statuses: Object.values(FormsStatusesEnum).filter(
      (item) =>
        !item.isForVisa
        && item.key !== FormsStatusesEnum.Rejected.key
        && item.key !== FormsStatusesEnum.Approved.key,
    ),
  },
  Flows: {
    key: 8,
    value: 'flows',
    inlineStatusLabel: 'flow-statuses',
    statusPlaceholder: 'select-flow-statuses',
    isWithTemplateStatus: true,
    templateType: DefaultFormsTypesEnum.Flows.key,
    statuses: [
      FormsStatusesEnum.Todo,
      FormsStatusesEnum.Draft,
      FormsStatusesEnum.Completed,
    ].map((item) => ({ ...item, status: item.flowStatus })),
  },
  JobTargets: {
    key: 2,
    value: 'job-targets',
  },
  JobTypes: {
    key: 3,
    value: 'job-types',
  },
  FinalElimination: {
    key: 4,
    value: 'final-elimination',
  },
  Recommendation: {
    key: 5,
    value: 'recommendation',
  },
  Scorecard: {
    key: 6,
    value: 'scorecard-evaluation',
  },
};

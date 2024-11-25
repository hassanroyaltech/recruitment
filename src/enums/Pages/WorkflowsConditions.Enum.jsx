import { WorkflowsGroupsEnum } from './WorkflowsGroups.Enum';

export const WorkflowsConditionsEnum = {
  LessThan: {
    key: 1,
    value: 'less-than',
    relatedTo: [WorkflowsGroupsEnum.One.key],
  },
  GreaterThan: {
    key: 2,
    value: 'greater-than',
    relatedTo: [WorkflowsGroupsEnum.One.key],
  },
  Equality: {
    key: 3,
    value: 'equality',
    relatedTo: [WorkflowsGroupsEnum.One.key],
  },
  LessThanOrEqualTo: {
    key: 4,
    value: 'less-than-or-equal-to',
    relatedTo: [WorkflowsGroupsEnum.One.key],
  },
  GreaterThanOrEqualTo: {
    key: 5,
    value: 'greater-than-or-equal-to',
    relatedTo: [WorkflowsGroupsEnum.One.key],
  },
  Inequality: {
    key: 6,
    value: 'inequality',
    relatedTo: [WorkflowsGroupsEnum.One.key],
  },
  In: {
    key: 7,
    value: 'in',
    relatedTo: [WorkflowsGroupsEnum.Two.key],
  },
  NotIn: {
    key: 8,
    value: 'not-in',
    relatedTo: [WorkflowsGroupsEnum.Two.key],
  },
  Or: {
    key: 9,
    value: 'or',
    relatedTo: [WorkflowsGroupsEnum.Three.key],
    color: 'warning',
  },
  Then: {
    key: 10,
    value: 'then',
    relatedTo: [WorkflowsGroupsEnum.Three.key],
    color: 'green-primary',
  },
};

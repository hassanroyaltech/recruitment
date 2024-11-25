import { WorkflowsGroupsEnum } from './WorkflowsGroups.Enum';

export const WorkflowsStaticDropdownsEnum = {
  Conditions: {
    JobTargetType: {
      key: 1,
      value: 'job-target-type',
      group: WorkflowsGroupsEnum.Two.key,
    },
    JobFamily: {
      key: 2,
      value: 'job-family',
      group: WorkflowsGroupsEnum.Two.key,
    },
    JobType: {
      key: 3,
      value: 'job-type',
      group: WorkflowsGroupsEnum.Two.key,
    },
    Hierarchy: {
      key: 4,
      value: 'hierarchy',
      group: WorkflowsGroupsEnum.Two.key,
    },
    Location: {
      key: 5,
      value: 'location',
      group: WorkflowsGroupsEnum.Two.key,
    },
    Position: {
      key: 6,
      value: 'position',
      group: WorkflowsGroupsEnum.Two.key,
    },
    WorkType: {
      key: 7,
      value: 'work-type',
      group: WorkflowsGroupsEnum.Two.key,
    },
    WorkClass: {
      key: 8,
      value: 'work-class',
      group: WorkflowsGroupsEnum.Two.key,
    },
    Employees: {
      key: 9,
      value: 'employees',
      group: WorkflowsGroupsEnum.Two.key,
    },
    NumberOfVacancies: {
      key: 10,
      value: 'number-of-vacancies',
      group: WorkflowsGroupsEnum.One.key,
    },
    EmployeeGroups: {
      key: 11,
      value: 'employee-groups',
      group: WorkflowsGroupsEnum.Two.key,
    },
  },
  Approvals: {
    Employees: {
      key: 12,
      value: 'employees',
      color: 'pink',
      group: WorkflowsGroupsEnum.Three.key,
    },
    Positions: {
      key: 13,
      value: 'positions',
      color: 'secondary',
      group: WorkflowsGroupsEnum.Three.key,
    },
    ExternalCommittee: {
      key: 14,
      value: 'external-committee',
      color: 'yellow',
      group: WorkflowsGroupsEnum.Three.key,
    },
    InternalCommittee: {
      key: 15,
      value: 'internal-committee',
      color: 'success',
      group: WorkflowsGroupsEnum.Three.key,
    },
    Hierarchy: {
      key: 16,
      value: 'hierarchy',
      color: 'info',
      group: WorkflowsGroupsEnum.Three.key,
    },
  },
};

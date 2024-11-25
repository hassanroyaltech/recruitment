import {
  GetAllCandidatesSearchDBNew,
  GetAllSetupsCommittees,
  GetAllSetupsEmployees,
  GetAllSetupsUsers,
} from '../../services';

export const TaskResponsibilityUserTypesEnum = {
  User: {
    key: 1,
    value: 'user',
    api: GetAllSetupsUsers,
    is_multiple: true,
  },
  Employee: {
    key: 2,
    value: 'employee',
    api: GetAllSetupsEmployees,
    is_multiple: true,
  },
  Candidate: {
    key: 3,
    value: 'candidate',
    api: GetAllCandidatesSearchDBNew,
    is_multiple: false,
  },
  Requester: {
    key: 4,
    value: 'requester',
    api: null,
    is_multiple: false,
  },
  JobCreator: {
    key: 5,
    value: 'job-creator',
    api: null,
    is_multiple: false,
  },
  Committee: {
    key: 6,
    value: 'committee',
    api: GetAllSetupsCommittees,
    is_multiple: false,
  },
};

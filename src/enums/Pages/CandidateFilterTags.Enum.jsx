import {
  // GetAllSetupsCertificates,
  GetAllSetupsUsers,
  // GetAllSetupsNationality,
  // GetAllSetupsBranches,
  // GetAllSetupsCourses
} from 'services';

export const CustomCandidatesFilterTagsEnum = {
  // company_uuid: {
  //   key: 'project',
  //   label: 'branch',
  //   type: 'lookup',
  //   getApiFunction: GetAllSetupsBranches
  // },
  // original_nationality: {
  //   key: 'original_nationality',
  //   label: 'original-nationality',
  //   type: 'lookup',
  //   getApiFunction: GetAllSetupsNationality
  // },
  // board: {
  //   key: 'qualification',
  //   label: 'dr-board',
  //   type: 'lookup',
  //   getApiFunction: GetAllSetupsCourses
  // },
  user: {
    key: 'user',
    label: 'user-recruiter',
    type: 'lookup',
    getApiFunction: GetAllSetupsUsers,
  },
  employee: {
    key: 'employee',
    label: 'employee-recruiter',
    type: 'lookup',
    getApiFunction: GetAllSetupsUsers,
  },
};

import { MainPermissionsTypesEnum } from '../../enums';

export const SearchDatabasePermissions = {
  SuperSearchDatabase: {
    key: '63ec34be401242dd897d4ae86f220685',
  },
  AddCandidateToFavorite: {
    key: '8fdd0f5e75974b9e889475fe69acbe24',
    type: MainPermissionsTypesEnum.Add.key,
  },
  AddCandidateToApplication: {
    key: '84b126750dab4851a3a1e84f9caa61a2',
    type: MainPermissionsTypesEnum.Add.key,
  },
  ViewSearchDatabase: {
    key: '6284048956c14dcaac007007fa45f6f6',
    type: MainPermissionsTypesEnum.View.key,
  },
  ViewCvCandidate: {
    key: '0a990813586549c8bba75cd4f4c22bbd',
    type: MainPermissionsTypesEnum.View.key,
  },
  ScheduleInterview: {
    key: 'ae52893dcb6d48bab5a06f1454ce6fd4',
  },
  CompareCandidates: {
    key: 'd84ac7db6bf2491c8f9c8ab271ebf2b8',
  },
  MatchCandidateWithApplication: {
    key: 'dd001bfbc7c243b2a89cb71dddb805ab',
  },
  FilterCandidates: {
    key: '1639b65e66894d9da2a287832a7c33df',
  },
  AddCandidates: {
    key: 'cad9f976f298448e879b5b8784bc332a',
  },
  AssignUser: {
    key: '81b11e18411f479e90e60839926ef3bf',
  },
};

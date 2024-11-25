import { MainPermissionsTypesEnum } from '../../enums';

export const IndexPermissions = {
  ServiceUUID: {
    key: 'ca0311cdd01648e98344611ce767ad15',
  },
  AddNewResumes: {
    key: 'd76b8aac6dc746a690b3b8175bfd74a1',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateResumes: {
    key: '629b85dfd674425d88d77e404a7583bb',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteResumes: {
    key: '8d6703b0cb6d4816965408d6314447fc',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewResumes: {
    key: '03e9dc1f38064d4c9a6f8f210570438f',
    type: MainPermissionsTypesEnum.View.key,
  },
  ScheduleAMeeting: {
    key: '03e9dc1f38064d4c9a6f8f210570438f',
  },
  AddCandidateToPipeline: {
    key: '03e9dc1f38064d4c9a6f8f210570438f',
  },
  ShareCandidateCv: {
    key: '8f4ea998ce274a3284a7ce98c8d5202e',
  },
  MatchWithEvaRec: {
    key: '1112663652ea41b987a2eab23514a5dd',
  },
  MatchWithDocument: {
    key: 'f7f85032105e4e208ec20c467faf413d',
  },
  UploadADocument: {
    key: 'ed28fbc735fc4c73bcaa202377d8163c',
  },
  FilterCandidates: {
    key: 'a502f06cd94a46978c935e2fdae1b67a',
  },
};

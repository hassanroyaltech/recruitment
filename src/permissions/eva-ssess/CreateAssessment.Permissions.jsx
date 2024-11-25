import { MainPermissionsTypesEnum } from '../../enums';

export const CreateAssessmentPermissions = {
  SuperEvaSsessApplication: {
    key: '8efc7c824f464e8293c52d31c57698f1',
  },
  AddEvaSsessApplication: {
    key: '5716afe91730461689aae34be4c78970',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateEvaSsessApplication: {
    key: 'f169d8926e8d4315a1293202d528da85',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteEvaSsessApplication: {
    key: 'b55a061263a74c15b6d21af2c09d8948',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewEvaSsessApplication: {
    key: '7f92348babc244d4866cabf998afb7a1',
    type: MainPermissionsTypesEnum.View.key,
  },
};

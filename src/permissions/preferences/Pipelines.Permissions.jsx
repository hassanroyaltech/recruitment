import { MainPermissionsTypesEnum } from '../../enums';

export const PipelinesPermissions = {
  SuperPipelines: {
    key: '7091ed65a37047739ecc83716c11fd53',
  },
  AddPipelines: {
    key: '3fc20557bb684b518866b6cec2637a23',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePipelines: {
    key: '31a4f9fb97ec416c88fcd2c52cddf22a',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePipelines: {
    key: '736431c54b2044459a996b7c54f7ceb7',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPipelines: {
    key: '393f0752c6da4fa391a7a445ae622394',
    type: MainPermissionsTypesEnum.View.key,
  },
  IndexPipelines: {
    key: '6bccc7b29dcb4e38aa82da7ef5f48738',
  },
};

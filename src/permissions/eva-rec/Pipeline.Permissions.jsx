import { MainPermissionsTypesEnum } from '../../enums';

export const PipelinePermissions = {
  SuperPipeline: {
    key: '449605f295c14c08995f3f00db721f67',
  },
  AddPipeline: {
    key: '4a8cd16ddf0f4982a88426d42c73b59a',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePipeline: {
    key: '3f3230c244534a76a8fd3ab55c4b4121',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePipeline: {
    key: '38c99adb78454a99b0bc67e981a062e9',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPipeline: {
    key: 'd72dcb81813347969a1f42aec732b036',
    type: MainPermissionsTypesEnum.View.key,
  },
};

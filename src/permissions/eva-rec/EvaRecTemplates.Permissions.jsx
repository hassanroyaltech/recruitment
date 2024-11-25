import { MainPermissionsTypesEnum } from '../../enums';

export const EvaRecTemplatesPermissions = {
  SuperTemplate: {
    key: '5a7a0bd0a6614fcabdc8c4f88e058650',
  },
  AddTemplate: {
    key: '08e58df008b44883a3addb9d95399764',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateTemplate: {
    key: '71ccd1487fa74e94ad9721355d5c5c39',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteTemplate: {
    key: '2a5e906809384218b2b7510cfd9988c0',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewTemplate: {
    key: '006c9f64f5e449ebac6f3d4baee9900f',
    type: MainPermissionsTypesEnum.View.key,
  },
};

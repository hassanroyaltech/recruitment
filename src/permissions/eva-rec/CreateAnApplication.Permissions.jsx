import { MainPermissionsTypesEnum } from '../../enums';

export const CreateAnApplicationPermissions = {
  SuperEvaRecApplication: {
    key: '9113e923ab9543e4b94f03bf466688f7',
  },
  AddEvaRecApplication: {
    key: '018c871e62404c43892a4a410bc52572',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateEvaRecApplication: {
    key: '16863e3c4ddb4c54b0f706e6abffb8c6',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteEvaRecApplication: {
    key: '0af63ec54f604840980070487f37ba05',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewEvaRecApplication: {
    key: '5ad26238438d496bbb89215b339f7094',
    type: MainPermissionsTypesEnum.View.key,
  },
};

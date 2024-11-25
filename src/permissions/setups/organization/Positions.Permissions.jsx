import { MainPermissionsTypesEnum } from '../../../enums';

export const PositionsPermissions = {
  SuperPosition: {
    key: 'e5feaebbd80a475491bc2f2f849e9c41',
  },
  AddPosition: {
    key: '6c5d4fd7c4c946c187ffc812dac200b5',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdatePosition: {
    key: '11d4ea9c9ff64959aeedd59d3de10320',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeletePosition: {
    key: '1e451ed62c48475692a0ae730f0cd561',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewPosition: {
    key: 'b76e0f600abc4f8385514fd86f9e9ae6',
    type: MainPermissionsTypesEnum.View.key,
  },
};

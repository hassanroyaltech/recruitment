import { MainPermissionsTypesEnum } from '../../enums';

export const OffersPermissions = {
  SuperOffers: {
    key: '364c3f98816840f29601e81b217c38b9',
  },
  AddNewOffers: {
    key: 'd788bffa030542649b2a5ad5bf1a4991',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateOffers: {
    key: 'c969acc3479b46fd928151fa51c3f73d',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteOffers: {
    key: '48d955f6c0ce46df8aefa7f4414bf496',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewOffers: {
    key: 'a1e24e0f462044cfa4bade55dc931b67',
    type: MainPermissionsTypesEnum.View.key,
  },

  IndexOffers: {
    key: '00761f06d491494488df5cdf5668c129',
  },
};

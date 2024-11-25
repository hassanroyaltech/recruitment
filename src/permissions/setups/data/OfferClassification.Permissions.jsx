import { MainPermissionsTypesEnum } from '../../../enums';

export const OfferClassificationPermissions = {
  SuperOfferClassification: {
    key: '8b972ffb9cd74ea0a70dcc5b7b00224f',
  },
  AddOfferClassification: {
    key: '231e092d8e7e4ea7aa79ef124e67f04e',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateOfferClassification: {
    key: '756a6a29df664b65b1af41c03733a975',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteOfferClassification: {
    key: '8990a4d3361d4943a05dc77e13e8ba64',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewOfferClassification: {
    key: '9a0137926fb34834ae176d63b57989fc',
    type: MainPermissionsTypesEnum.View.key,
  },
};

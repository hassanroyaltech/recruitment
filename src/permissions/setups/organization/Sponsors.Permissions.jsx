import { MainPermissionsTypesEnum } from '../../../enums';

export const SponsorsPermissions = {
  SuperSponsors: {
    key: 'b6cd5aa911ef47f5af9c0bf66f9162f5',
  },
  AddSponsors: {
    key: '015dbbc209cf464da8fbafbdefc894f1',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateSponsors: {
    key: '8788d77d1e2f4a17a4a31aab96d055c5',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteSponsors: {
    key: '3db5655ea9e445e99b586bece595dd37',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewSponsors: {
    key: '923bc534de314940893df153ad3103a7',
    type: MainPermissionsTypesEnum.View.key,
  },
};

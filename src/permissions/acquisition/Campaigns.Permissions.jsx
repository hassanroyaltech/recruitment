import { MainPermissionsTypesEnum } from '../../enums';

export const CampaignsPermissions = {
  SuperCampaigns: {
    key: 'bc813596616e4a2e9992e5b937cfc45c',
  },
  AddCampaigns: {
    key: '33649351ad3a436295ea98537263a51f',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateCampaigns: {
    key: 'de2e2aa5cf574f4c9229bd73972e7975',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteCampaigns: {
    key: '249060843af947ec9e89dfc3cc37daf2',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewCampaigns: {
    key: '5f8d708380134932ad418385a00878d8',
    type: MainPermissionsTypesEnum.View.key,
  },
};

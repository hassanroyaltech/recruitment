import { MainPermissionsTypesEnum } from '../../../enums';

export const ProjectsPermissions = {
  SuperProjects: {
    key: '3af795af15dc4122ba273564d3a56987',
  },
  AddProjects: {
    key: '45e6720ae2fc48afbaafdb054093f925',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateProjects: {
    key: '12d195ed8e9d474d8f8108626052ce5b',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteProjects: {
    key: '3b8b3acc479b4b72bdace90f95970cd5',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewProjects: {
    key: '8005a1c4dff8483b9c05f775e9d12927',
    type: MainPermissionsTypesEnum.View.key,
  },
};

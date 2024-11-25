import { MainPermissionsTypesEnum } from '../../../enums';

export const HierarchyPermissions = {
  SuperHierarchy: {
    key: '844207c04df3412db7566b8cea739576',
  },
  AddHierarchy: {
    key: '416f312c653142178c91e3c57a8e11f5',
    type: MainPermissionsTypesEnum.Add.key,
  },
  UpdateHierarchy: {
    key: '35720c1d5b81471fa3863275a34a1abc',
    type: MainPermissionsTypesEnum.Update.key,
  },
  DeleteHierarchy: {
    key: '8644edab5e70402598d542477913f519',
    type: MainPermissionsTypesEnum.Delete.key,
  },
  ViewHierarchy: {
    key: '48178aa7f9d44826b61d1e9c8a64a8e6',
    type: MainPermissionsTypesEnum.View.key,
  },
};

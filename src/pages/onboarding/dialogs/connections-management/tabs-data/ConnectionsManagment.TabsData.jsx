import { SpaceAndFolderMembersTypesEnum } from '../../../../../enums';
import { GetAllSetupsUsers, getSetupsHierarchy } from '../../../../../services';
import FormMemberTab from '../../../../form-builder-v2/popovers/tabs/FormMember.Tab';

export const SpaceAndFoldersTabsData = [
  {
    key: 1,
    label: SpaceAndFolderMembersTypesEnum.Users.value,
    component: FormMemberTab,
    props: {
      type: SpaceAndFolderMembersTypesEnum.Users.key,
      listAPI: GetAllSetupsUsers,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 2,
    label: SpaceAndFolderMembersTypesEnum.Hierarchy.value,
    component: FormMemberTab,
    props: {
      type: SpaceAndFolderMembersTypesEnum.Hierarchy.key,
      listAPI: getSetupsHierarchy,
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

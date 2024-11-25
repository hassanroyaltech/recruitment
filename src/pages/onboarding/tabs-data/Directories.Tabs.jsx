import DirectoryTab from '../popovers/directories/tabs/Directory.Tab';
import { OnboardingTypesEnum } from '../../../enums';
import {
  GetAllOnboardingFlows,
  GetAllOnboardingFolders,
  GetAllOnboardingSpaces,
} from '../../../services';

export const DirectoriesTabs = [
  {
    key: 1,
    label: OnboardingTypesEnum.Spaces.value,
    component: DirectoryTab,
    props: {
      type: OnboardingTypesEnum.Spaces.key,
      listAPI: GetAllOnboardingSpaces,
      listAPIProps: {
        use_for: 'list',
      },
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 2,
    label: OnboardingTypesEnum.Folders.value,
    component: DirectoryTab,
    props: {
      type: OnboardingTypesEnum.Folders.key,
      listAPI: GetAllOnboardingFolders,
      listAPIProps: {
        use_for: 'list',
      },
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
  {
    key: 3,
    label: OnboardingTypesEnum.Flows.value,
    component: DirectoryTab,
    props: {
      type: OnboardingTypesEnum.Flows.key,
      listAPI: GetAllOnboardingFlows,
      listAPIProps: {
        use_for: 'list',
      },
      listAPIDataPath: undefined,
      imageAltValue: undefined,
      isImage: false,
    },
  },
];

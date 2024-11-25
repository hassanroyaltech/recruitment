import React from 'react';
import {
  CustomizingIcon,
  EditIcon,
  FlowIcon,
  InfoIcon,
  SettingsIcon,
  VarsIcon,
} from '../../form-builder/icons';
import InfoTab from '../sections/sidebar/tabs/info/Info.Tab';
import EditTab from '../sections/sidebar/tabs/edit/Edit.Tab';
import FlowTab from '../sections/sidebar/tabs/flow/Flow.Tab';
import VariablesTab from '../sections/sidebar/tabs/variables/Variables.Tab';
import CustomizingTab from '../sections/sidebar/tabs/customizing/Customizing.Tab';
import SettingsTab from '../sections/sidebar/tabs/settings/Settings.Tab';
import { FormsRolesEnum } from '../../../enums';

export const SidebarTabs = [
  {
    key: 1,
    label: 'title',
    icon: <InfoIcon />,
    component: InfoTab,
  },
  {
    key: 2,
    label: 'customize',
    icon: <EditIcon />,
    component: EditTab,
    isHiddenInPreview: true,
    visibleIfRole: [FormsRolesEnum.Creator.key],
  },
  {
    key: 3,
    label: 'headings',
    icon: <CustomizingIcon />,
    component: CustomizingTab,
    isHiddenInPreview: true,
    visibleIfRole: [FormsRolesEnum.Creator.key],
  },
  {
    key: 4,
    label: 'settings',
    icon: <SettingsIcon />,
    component: SettingsTab,
    isHiddenInPreview: true,
    visibleIfRole: [FormsRolesEnum.Creator.key],
  },
  {
    key: 5,
    label: 'workflow',
    icon: <FlowIcon />,
    component: FlowTab,
  },
  {
    key: 6,
    label: 'variables',
    icon: <VarsIcon />,
    component: VariablesTab,
    isHiddenInPreview: true,
    visibleIfRole: [FormsRolesEnum.Creator.key],
  },
];

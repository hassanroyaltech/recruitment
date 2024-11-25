import {
  AppereanceTab,
  GeneralTemplateTab,
  ScorecardBuilderTab,
  SettingsTab,
} from '../sections/tabs';

export const ScorecardTemplateTabs = [
  {
    label: 'general',
    key: 1,
    component: GeneralTemplateTab,
  },
  {
    label: 'scorecard',
    key: 2,
    component: ScorecardBuilderTab,
  },
  {
    label: 'appearance',
    key: 3,
    component: AppereanceTab,
  },
  {
    label: 'settings',
    key: 4,
    component: SettingsTab,
  },
];

import { lazy } from 'react';
const IntegrationZoomSettingsTab = lazy(() =>
  import('../tabs/integration-zoom-settings/IntegrationZoomSettings.Tab'),
);

export const IntegrationSettingsZoomTabsData = [
  {
    key: 1,
    label: 'settings',
    component: IntegrationZoomSettingsTab,
  },
];

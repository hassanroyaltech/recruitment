import { lazy } from 'react';

const IntegrationSAPEventsTab = lazy(() =>
  import('../tabs/integration-SAP-events/IntegrationSAPEvents.Tab'),
);
const IntegrationSAPClientsTab = lazy(() =>
  import('../tabs/integration-SAP-clients/IntegrationSAPClients.Tab'),
);
const IntegrationSAPLogsTab = lazy(() =>
  import('../tabs/integration-SAP-logs/IntegrationSAPLogs.Tab'),
);

export const IntegrationSettingsSAPTabsData = [
  {
    key: 1,
    label: 'events',
    component: IntegrationSAPEventsTab,
  },
  {
    key: 2,
    label: 'clients',
    component: IntegrationSAPClientsTab,
  },
  {
    key: 3,
    label: 'logs',
    component: IntegrationSAPLogsTab,
  },
];

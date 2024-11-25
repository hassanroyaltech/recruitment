import { VisaLogsTab, VisaFormsTab } from '../tabs';
import { ManageVisasPermissions } from '../../../../../../permissions';
import { VisaFormPermissions } from '../../../../../../permissions/visas/VisaForm.Permissions';

export const VisaStatusTabs = [
  {
    key: 1,
    label: 'logs',
    component: VisaLogsTab,
    permissionId: ManageVisasPermissions.ViewAllAllocationRequests.key,
  },
  {
    key: 2,
    label: 'forms',
    component: VisaFormsTab,
    permissionId: VisaFormPermissions.ViewVisaForm.key,
  },
];

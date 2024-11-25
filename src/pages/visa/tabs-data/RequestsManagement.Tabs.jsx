import {
  RequestDetailsTab,
  RequestAttachmentsTab,
  RequestReservedVisasTab,
  RequestSearchForVisaTab,
} from '../dialogs/visa-requests-management/tabs';
import { VisaFormsTab } from '../../../components/Views/CandidateModals/evarecCandidateModal/VisaStatusTab/tabs';
import { EvaRecManageVisaPermissions } from '../../../permissions/eva-rec/EvaRecManageVisa.Permissions';
import { ManageVisasPermissions } from '../../../permissions';
import { VisaFormPermissions } from '../../../permissions/visas/VisaForm.Permissions';

export const RequestsManagementTabs = [
  {
    key: 1,
    label: 'details',
    component: RequestDetailsTab,
  },
  {
    key: 2,
    label: 'attachments',
    component: RequestAttachmentsTab,
    defaultPermissions: {
      ViewAttachments: ManageVisasPermissions.ViewAttachments,
      ViewAttachmentsEvarec: EvaRecManageVisaPermissions.ViewAttachments,
    },
  },
  {
    key: 3,
    label: 'reserved-visas',
    component: RequestReservedVisasTab,
    defaultPermissions: {
      ViewVisaReservation: ManageVisasPermissions.ViewVisaReservation,
      ViewVisaReservationEvarec: EvaRecManageVisaPermissions.ViewVisaReservation,
    },
  },
  {
    key: 4,
    label: 'search-for-visa',
    component: RequestSearchForVisaTab,
  },
  {
    key: 5,
    label: 'forms',
    component: VisaFormsTab,
    permissionId: VisaFormPermissions.ViewVisaForm.key,
  },
];

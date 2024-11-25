import {
  RequestedToAllocateTab,
  RequestedToReserveTab,
} from '../visa-all-requests/tabs';
import { MassAllocationTab } from '../visa-all-requests/tabs/mass-allocation/MassAllocation.Tab';
import { ManageVisasPermissions } from '../../../permissions';

export const AllRequestsTabs = [
  {
    key: 1,
    label: 'reservations',
    component: RequestedToReserveTab,
    permissionId: ManageVisasPermissions.ViewVisaReservation.key,
  },
  {
    key: 2,
    label: 'allocations',
    component: RequestedToAllocateTab,
    permissionId: ManageVisasPermissions.ViewVisaAllocation.key,
  },
  {
    key: 3,
    label: 'mass-allocation',
    component: MassAllocationTab,
    permissionId: ManageVisasPermissions.MassAllocation.key,
  },
];

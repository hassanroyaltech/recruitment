import { VisaRequestsTypesEnum } from './VisaRequestsTypes.Enum';

// each location can have different way of saving or close or ...
export const VisaRequestsCallLocationsEnum = {
  EvaRecVisaStatusNewRequest: {
    key: 1,
    requestType: VisaRequestsTypesEnum.Allocation,
  },
  EvaRecVisaStatusAllocate: {
    key: 2,
    requestType: VisaRequestsTypesEnum.ConfirmAllocation,
  },
  AllRequestsAllocationTabAllocate: {
    key: 3,
    requestType: VisaRequestsTypesEnum.ConfirmAllocation,
  },
  AllRequestsReservationNewRequest: {
    key: 4,
    requestType: VisaRequestsTypesEnum.Reservation,
  },
  AllRequestsReservationsTabReserve: {
    key: 5,
    requestType: VisaRequestsTypesEnum.ConfirmReservation,
  },
  EvaRecVisaStatusEdit: {
    key: 6,
    requestType: VisaRequestsTypesEnum.EditAllocation,
  },
  EvaRecVisaStatusViewDetails: {
    key: 7,
    requestType: VisaRequestsTypesEnum.ViewAllocation,
  },
  EvaRecVisaStatusRequestMoreInfo: {
    key: 8,
    requestType: VisaRequestsTypesEnum.Allocation,
  },
  AllRequestsReservationEdit: {
    key: 9,
    requestType: VisaRequestsTypesEnum.EditReservation,
  },
  AllRequestsReservationView: {
    key: 10,
    requestType: VisaRequestsTypesEnum.ViewReservation,
  },
  AllRequestsReservationMoreInfo: {
    key: 11,
    requestType: VisaRequestsTypesEnum.Reservation,
  },
  AllRequestsReservationReserve: {
    key: 12,
    requestType: VisaRequestsTypesEnum.ConfirmReservation,
  },
  AllRequestsAllocationEdit: {
    key: 13,
    requestType: VisaRequestsTypesEnum.EditAllocation,
  },
  AllRequestsAllocationView: {
    key: 14,
    requestType: VisaRequestsTypesEnum.ViewAllocation,
  },
  AllRequestsAllocationMoreInfo: {
    key: 15,
    requestType: VisaRequestsTypesEnum.Allocation,
  },
  AllRequestsAllocationAllocate: {
    key: 16,
    requestType: VisaRequestsTypesEnum.ConfirmAllocation,
  },
};

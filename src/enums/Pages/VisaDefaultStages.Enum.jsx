export const VisaDefaultStagesEnum = {
  Available: {
    key: 'available',
    value: 'available',
  },
  Reserved: {
    key: 'reserved',
    value: 'reserved',
    statisticsDescriptions: { before: 'last-request', between: 'by' },
  },
  Allocated: {
    key: 'allocated',
    value: 'allocated',
    statisticsDescriptions: { before: 'last-time-issued', between: 'for' },
  },
  Used: {
    key: 'used',
    value: 'used',
  },
  Declined: {
    key: 'declined',
    value: 'declined',
  },
};

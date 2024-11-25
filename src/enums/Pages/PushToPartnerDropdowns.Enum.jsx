export const PushToPartnerGendersEnum = {
  Male: {
    key: 'Male',
    value: 'male',
  },
  Female: {
    key: 'Female',
    value: 'female',
  },
};

export const PushToPartnerMaritalStatusesEnum = {
  Single: {
    key: 'Single',
    value: 'single',
  },
  Married: {
    key: 'Married',
    value: 'married',
  },
  Divorced: {
    key: 'Divorced',
    value: 'divorced',
  },
};

export const PushToPartnerContractTypesEnum = {
  FixedTerm: {
    key: 'Fixed term',
    value: 'fixed-term',
  },
  Indefinite: {
    key: 'Indefinite',
    value: 'indefinite',
    is_without_contract_period: true,
  },
};

export const PushToPartnerContractPeriodsEnum = {
  OneYear: {
    key: '1 year',
    value: '1-year',
    fixedEndDateYears: 1,
  },
  TwoYear: {
    key: '2 years',
    value: '2-years',
    fixedEndDateYears: 2,
  },
  Custom: {
    key: 'Custom',
    value: 'custom',
  },
};
// === Start for Deel
export const PushToPartnerOfferStatusesEnum = {
  Accepted: {
    key: 'offer-accepted',
    value: 'offer-accepted',
  },
  Sent: {
    key: 'offer-sent',
    value: 'offer-sent',
  },
  Declined: {
    key: 'offer-declined',
    value: 'offer-declined',
  },
  Delete: {
    key: 'offer-delete',
    value: 'offer-delete',
  },
};

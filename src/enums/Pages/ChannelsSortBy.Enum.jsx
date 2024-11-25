export const ChannelsSortByEnum = {
  relevant: {
    key: 'relevant',
    value: 'relevant',
    direction: 'asc',
  },
  recent: {
    key: 'recent',
    value: 'recent',
    direction: 'asc',
  },
  costFromHighToLow: {
    direction: 'desc',
    key: 'list_price.desc',
    value: 'cost-high-to-low',
  },
  costFromLowToHigh: {
    direction: 'asc',
    key: 'list_price.asc',
    value: 'cost-low-to-high',
  },
  orderFrequencyFromLowToHigh: {
    direction: 'asc',
    key: 'order_frequency.asc',
    value: 'order-frequency-low-to-high',
  },
  orderFrequencyFromHighToLow: {
    direction: 'desc',
    key: 'order_frequency.desc',
    value: 'order-frequency-high-to-low',
  },
  orderFrequencyFromNewToOld: {
    direction: 'desc',
    key: 'created.desc',
    value: 'created-new-to-old',
  },
  createdFromOldToNew: {
    direction: 'asc',
    key: 'created.asc',
    value: 'created-old-to-new',
  },
};

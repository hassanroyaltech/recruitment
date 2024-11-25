export const PipelineStagePeriodTypesEnum = {
  Hours: {
    key: 1,
    value: 'hours',
    singleValue: 'hour',
    momentKey: 'h',
    maxRepeating: 6,
    maxRecurring: 10,
  },
  Days: {
    key: 2,
    value: 'days',
    singleValue: 'day',
    momentKey: 'd',
    maxRepeating: 4,
    maxRecurring: 10,
  },
  Weeks: {
    key: 3,
    value: 'weeks',
    singleValue: 'week',
    momentKey: 'w',
    maxRepeating: 3,
    maxRecurring: 4,
  },
};

export const ReviewDynamicFormHelperEnum = {
  'degree-types': {
    apiPath: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${process.env.REACT_APP_VERSION_API}/degree-types`,
    apiProps: { for_campaign: true },
    dataPath: {
      results: 'results',
      title: 'title',
      uuid: 'id',
    },
  },
  country: {
    apiPath: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${process.env.REACT_APP_VERSION_API}/country`,
    apiProps: { for_campaign: true },
    dataPath: {
      results: 'results',
      title: 'title',
      uuid: 'id',
    },
  },
  'job-major': {
    apiPath: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${process.env.REACT_APP_VERSION_API}/job-major`,
    apiProps: { for_campaign: true },
    dataPath: {
      results: 'results',
      title: 'title',
      uuid: 'id',
    },
  },
  industry: {
    apiPath: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${process.env.REACT_APP_VERSION_API}/industry`,
    apiProps: { for_campaign: true },
    dataPath: {
      results: 'results',
      title: 'title',
      uuid: 'id',
    },
  },
  'career-level': {
    apiPath: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${process.env.REACT_APP_VERSION_API}/career-level`,
    apiProps: { for_campaign: true },
    dataPath: {
      results: 'results',
      title: 'title',
      uuid: 'id',
    },
  },
  'dynamic-service': {
    apiPath: '',
    apiProps: { for_campaign: true },
    dataPath: {
      results: 'results',
      title: 'name',
      uuid: 'id',
    },
  },
};

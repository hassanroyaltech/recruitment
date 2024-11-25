export const DynamicFormHelpersEnum = {
  'business-types': {
    key: 'business-types',
    apiPath: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/helper/${process.env.REACT_APP_VERSION_API}/degree-types`,
    apiProps: {},
    dataPath: {
      results: 'results',
      title: 'title',
      uuid: 'id',
    },
  },
};

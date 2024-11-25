import moment from 'moment';

export const VitallyVerifyUser = (response) => {
  window.Vitally.account({
    accountId: response?.account_uuid,
    traits: {
      name: response?.account_name?.en,
    },
  });
  window.Vitally.user({
    userId: response?.uuid,
    accountId: response?.account_uuid,
    traits: {
      name: `${response?.first_name?.en || ''} ${response?.last_name?.en || ''}`,
      email: response?.email,
    },
  });
  window.Vitally.track({
    event: 'Login User/Employee',
    userId: response?.uuid,
    properties: {
      'event name': 'Login User/Employee',
      email: response?.email,
      'user name': `${response?.first_name?.en || ''} ${
        response?.last_name?.en || ''
      }`,
      'created at': moment().locale('en').format('MMMM DD, YYYY hh:mm A'),
    },
  });
};

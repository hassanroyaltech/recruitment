import moment from 'moment';

export const IdentifyVitallyAccount = () => {
  const {
    account_uuid: accountId,
    results: {
      user: { account_name },
    },
  } = JSON.parse(localStorage.getItem('user')) || {};

  if (!accountId || !account_name?.en) return;

  window.Vitally.account({
    accountId,
    traits: {
      name: account_name.en,
    },
  });
};

export const IdentifyVitallyUser = () => {
  const {
    results: { user },
  } = JSON.parse(localStorage.getItem('user')) || {};
  const { uuid: userId, first_name, last_name, email } = user || {};

  if (!userId || !first_name?.en || !last_name?.en || !email) return;

  window.Vitally?.user({
    userId,
    accountId: user?.account_uuid,
    traits: {
      name: `${first_name.en} ${last_name.en}`,
      email,
    },
  });
};

export const VitallyTrack = (event_name) => {
  const {
    results: { user },
  } = JSON.parse(localStorage.getItem('user')) || {};
  const { uuid: userId } = user || {};
  IdentifyVitallyAccount();
  IdentifyVitallyUser();
  window.Vitally.track({
    event: event_name,
    userId,
    properties: {
      'event name': event_name,
      email: user?.email,
      'user name': `${user?.first_name?.en || ''} ${user?.last_name?.en || ''}`,
      'created at': moment().locale('en').format('MMMM DD, YYYY hh:mm A'),
    },
  });
};

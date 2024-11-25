import { useEffect, useState } from 'react';
import moment from 'moment';

function useVitally() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))?.results?.user,
  );

  const identifyAccount = () => {
    if (!user?.account_uuid || !user?.account_name?.en) return;

    window.Vitally.account({
      accountId: user?.account_uuid,
      traits: {
        name: user?.account_name?.en,
      },
    });
  };

  const identifyUser = () => {
    if (!user?.uuid || !user?.first_name?.en || !user?.last_name?.en || !user?.email)
      return;

    window.Vitally.user({
      userId: user?.uuid,
      accountId: user?.account_uuid,
      traits: {
        name: `${user?.first_name.en} ${user?.last_name.en}`,
        email: user?.email,
      },
    });
  };

  const VitallyTrack = (eventName, extraProps) => {
    if (!user?.uuid) return;

    identifyAccount();
    identifyUser();

    window.Vitally.track({
      event: eventName,
      userId: user?.uuid,
      properties: {
        'event name': eventName,
        email: user?.email,
        'user name': `${user?.first_name?.en || ''} ${user?.last_name?.en || ''}`,
        'created at': moment().locale('en').format('MMMM DD, YYYY hh:mm A'),
        ...extraProps,
      },
    });
  };

  useEffect(() => {
    // Fetch initial user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser)?.results?.user);

    // Listener for localStorage changes
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        const updatedUser = event.newValue
          ? JSON.parse(event.newValue)?.results?.user
          : null;
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function (remove listener when component unmounts)
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  return { VitallyTrack };
}

export default useVitally;

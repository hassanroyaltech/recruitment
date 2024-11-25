import { useRef, useEffect, useCallback } from 'react';
import { GlobalTranslate, showSuccess } from '../helpers';
import { LogoutHelper } from '../helpers/Logout.Helper';

export const useInactivityLogout = (timeoutDuration = 1800000) => {
  // 1800000 ms = 30 minutes
  const localTimeoutDurationRef = useRef(timeoutDuration);
  const turnOffInactivityLogoutRef = useRef(false);
  const logoutTimer = useRef(null);

  const logoutUser = useCallback(() => {
    if (
      window.location.pathname.includes('/el/')
      || window.location.pathname.includes('/v2/recipient-login')
      || window.location.pathname.includes('/onboarding/invitations')
      || !localStorage.getItem('token')
    )
      return;
    // to prevent multiple logout calls at the same time if there are multiple open tabs
    if (
      localStorage.getItem('lastActivityTab')
      && localStorage.getItem('lastActivityTab') !== sessionStorage.getItem('tabID')
    )
      return;
    LogoutHelper();
    showSuccess(GlobalTranslate.t(`Shared:LoginView.logout-successfully`));
    // For instance, clear the token storage, redirect to login page, etc.
  }, []);

  const resetTimer = useCallback(() => {
    const localTimer = localTimeoutDurationRef.current;
    // to prevent multiple logout calls at the same time if there are multiple open tabs
    if (
      localStorage.getItem('lastActivityTab')
      && localStorage.getItem('lastActivityTab') !== sessionStorage.getItem('tabID')
    )
      return;
    if (localTimer >= 2147483647) return;
    clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => logoutUser(), localTimer);
  }, [logoutUser]);

  const updateTheHookHandler = useCallback(
    ({ newTimeoutDuration, newTurnOffInactivityLogoutValue }) => {
      localTimeoutDurationRef.current = newTimeoutDuration || timeoutDuration;
      turnOffInactivityLogoutRef.current = newTurnOffInactivityLogoutValue ?? false;
    },
    [timeoutDuration],
  );

  useEffect(() => {
    // Events to listen for activity
    const events = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    function handleEvent() {
      if (sessionStorage.getItem('tabID'))
        localStorage.setItem('lastActivityTab', sessionStorage.getItem('tabID'));
      if (turnOffInactivityLogoutRef.current) return;
      resetTimer();
    }

    events.forEach((event) => window.addEventListener(event, handleEvent, true));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleEvent, true),
      );
      clearTimeout(logoutTimer.current);
    };
  }, [resetTimer]);

  return { updateTheHookHandler };
};

import React, { useCallback, useEffect } from 'react';
import { SwitchRouteComponent } from '../../components';
import { OnboardingRoute } from '../../routes';
import { SetGlobalAfterSideMenuComponent } from '../../helpers';
import { OnboardingMenuSection } from './sections';
import './Onboarding.Style.scss';

const OnboardingPage = () => {
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to init the side menu
   * */
  const onOnboardingMenuInit = useCallback(() => {
    SetGlobalAfterSideMenuComponent(<OnboardingMenuSection />);
  }, []);

  useEffect(() => {
    onOnboardingMenuInit();
  }, [onOnboardingMenuInit]);

  useEffect(
    () => () => {
      SetGlobalAfterSideMenuComponent(null);
    },
    [],
  );

  return <SwitchRouteComponent routes={OnboardingRoute} />;
};

export default OnboardingPage;

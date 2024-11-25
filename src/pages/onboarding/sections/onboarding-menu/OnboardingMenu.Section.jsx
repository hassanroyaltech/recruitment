import React from 'react';
import { SpacesSection } from './sections';
import './OnboardingMenu.Style.scss';
import PropTypes from 'prop-types';
import { OnboardingMenuForSourceEnum } from '../../../../enums';

export const OnboardingMenuSection = ({
  forSource,
  getIsWithoutData,
  getReturnedData,
  getSelectedConnection,
  getOnConnectionsClicked,
  getMenuHeader,
  getIsActiveCollapseItem,
  isWithSelectTheFirstItem,
  isGlobalLoading,
  getIsLoading,
  directoryData,
}) => (
  <div className="onboarding-menu-wrapper">
    {(getMenuHeader && getMenuHeader()) || <div className="separator-h mb-2" />}
    <div className="onboarding-menu-content">
      <SpacesSection
        forSource={forSource}
        getIsWithoutData={getIsWithoutData}
        getReturnedData={getReturnedData}
        getSelectedConnection={getSelectedConnection}
        getIsLoading={getIsLoading}
        isGlobalLoading={isGlobalLoading}
        getIsActiveCollapseItem={getIsActiveCollapseItem}
        isWithSelectTheFirstItem={isWithSelectTheFirstItem}
        getOnConnectionsClicked={getOnConnectionsClicked}
        directoryData={directoryData}
      />
    </div>
  </div>
);
OnboardingMenuSection.propTypes = {
  forSource: PropTypes.oneOf(
    Object.values(OnboardingMenuForSourceEnum).map((item) => item),
  ),
  getIsWithoutData: PropTypes.func,
  getReturnedData: PropTypes.func,
  getIsLoading: PropTypes.func,
  getOnConnectionsClicked: PropTypes.func,
  getMenuHeader: PropTypes.func,
  isWithSelectTheFirstItem: PropTypes.bool,
  isGlobalLoading: PropTypes.bool,
  getIsActiveCollapseItem: PropTypes.func,
  getSelectedConnection: PropTypes.func,
};
OnboardingMenuSection.defaultProps = {
  forSource: OnboardingMenuForSourceEnum.Onboarding,
};

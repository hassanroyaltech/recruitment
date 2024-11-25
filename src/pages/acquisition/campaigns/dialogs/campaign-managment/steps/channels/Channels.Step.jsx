// noinspection ES6PreferShortImport

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { ChannelDetailsCard } from '../../../../../shared/cards';
import { ChannelsTabs } from '../../../../../shared/tabs-data';
import { LoaderComponent, TabsComponent } from '../../../../../../../components';
import './ChannelsStep.Style.scss';

export const ChannelsStep = ({
  activeItem,
  state,
  nextHandler,
  onStateChanged,
  globalIsLoading,
  parentTranslationPath,
  translationPath,
  handleRemoveChannel,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);

  const channelsTabsData = useMemo(() => {
    if (
      state.selectedChannels?.length
      || state.selectedContracts?.length
      || state.savedSelectedContracts?.length
      || state.savedSelectedChannels?.length
    )
      return ChannelsTabs.map((item) => ({
        ...item,
        disabled: item.isContracts
          ? !!state.selectedChannels.length
          : !!state.selectedContracts.length,
      }));
    return ChannelsTabs;
  }, [
    activeItem.is_contract,
    // state?.savedSelectedChannels?.length,
    // state?.savedSelectedContracts?.length,
    state?.selectedChannels.length,
    state?.selectedContracts.length,
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const onLoadingChanged = (newValue) => {
    setIsLoading(newValue);
  };

  return (
    <div className="channels-step-wrapper childs-wrapper">
      <div className="channels-contents-wrapper">
        <div className="mb-2 px-2">
          <span className="texts-header c-primary">
            {t(`${translationPath}channels`)}
          </span>
        </div>
        <div className="px-2">
          <TabsComponent
            data={channelsTabsData}
            currentTab={activeTab}
            labelInput="label"
            idRef="ChannelsTabsRef"
            isWithLine
            isPrimary
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            isDisabled={isLoading || globalIsLoading}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            dynamicComponentProps={{
              state,
              onStateChanged,
              activeItem,
              isLoading,
              onLoadingChanged,
              parentTranslationPath,
            }}
          />
        </div>
      </div>
      <div className="channels-details-card-wrapper">
        <ChannelDetailsCard
          selectedChannels={state.selectedChannels}
          selectedContracts={state.selectedContracts}
          total={state.totalCost}
          parentTranslationPath={parentTranslationPath}
          isForCampaign={true}
          globalIsLoading={globalIsLoading}
          handleRemoveChannel={handleRemoveChannel}
        />
        <div className="d-flex-center">
          {((state.selectedChannels && state.selectedChannels.length > 0)
            || (state.selectedContracts && state.selectedContracts.length > 0)) && (
            <div className="d-inline-flex mb-2 px-2 w-50">
              <ButtonBase
                className="btns theme-outline mx-0 w-100"
                disabled={globalIsLoading}
                type="submit"
              >
                <LoaderComponent
                  isLoading={globalIsLoading}
                  isSkeleton
                  wrapperClasses="position-absolute w-100 h-100"
                  skeletonStyle={{ width: '100%', height: '100%' }}
                />
                <span>{t('Shared:save-and-exit')}</span>
              </ButtonBase>
            </div>
          )}
          {((state.selectedChannels && state.selectedChannels.length > 0)
            || (state.selectedContracts && state.selectedContracts.length > 0)) && (
            <div className="d-inline-flex mb-2 px-2 w-50">
              <ButtonBase
                className="btns theme-solid bg-green-primary mx-0 w-100"
                onClick={nextHandler}
                disabled={globalIsLoading}
              >
                <span>{t('Shared:next')}</span>
              </ButtonBase>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ChannelsStep.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  globalIsLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  nextHandler: PropTypes.func.isRequired,
  translationPath: PropTypes.string,
  handleRemoveChannel: PropTypes.func,
};
ChannelsStep.defaultProps = {
  translationPath: 'ChannelsStep.',
};

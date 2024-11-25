import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { ChannelDetailsCard, ChannelsCard } from '../../../../../shared/cards';
import { LoaderComponent } from '../../../../../../../components';
import './Payment.Style.scss';

export const PaymentStep = ({
  activeItem,
  state,
  goToPageHandler,
  payAndStartCampaignHandler,
  globalIsLoading,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="payment-step-wrapper childs-wrapper">
      <div className="payment-contents-wrapper">
        <div className="mb-2 px-2">
          <span className="texts-header c-primary">
            {t(`${translationPath}payment`)}
          </span>
        </div>
        <div className="payment-step-body-wrapper">
          <ChannelsCard
            data={{
              results: [...state.selectedChannels, ...state.selectedContracts].map(
                (item) => ({
                  ...item,
                  ...item.channel,
                  channel: {},
                }),
              ),
              totalCount:
                state.selectedChannels.length + state.selectedContracts.length,
            }}
            campaignUuid={(activeItem && activeItem.uuid) || undefined}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
      <div className="channels-details-card-wrapper">
        <ChannelDetailsCard
          selectedChannels={state.selectedChannels}
          selectedContracts={state.selectedContracts}
          total={state.totalCost}
          parentTranslationPath={parentTranslationPath}
        />
        <div className="d-flex-center">
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
          <div className="d-inline-flex mb-2 px-2 w-50">
            <ButtonBase
              className="btns theme-outline mx-0 w-100"
              onClick={goToPageHandler(0)}
              disabled={globalIsLoading}
            >
              <span className="far fa-edit" />
              <span className="px-1">{t(`${translationPath}edit-order`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="d-flex-v-center">
          <ButtonBase
            className="btns theme-solid bg-green-primary mb-2 mx-2 w-100"
            onClick={payAndStartCampaignHandler}
            disabled={globalIsLoading}
          >
            <LoaderComponent
              isLoading={globalIsLoading}
              isSkeleton
              wrapperClasses="position-absolute w-100 h-100"
              skeletonStyle={{ width: '100%', height: '100%' }}
            />
            <span>
              {t(
                `${translationPath}${
                  (state.totalCost > 0 && 'pay-and-start-campaign')
                  || 'start-campaign'
                }`,
              )}
            </span>
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

PaymentStep.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  goToPageHandler: PropTypes.func.isRequired,
  payAndStartCampaignHandler: PropTypes.func.isRequired,
  globalIsLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
PaymentStep.defaultProps = {
  translationPath: 'PaymentStep.',
};

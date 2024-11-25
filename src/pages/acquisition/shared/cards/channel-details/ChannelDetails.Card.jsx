import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './ChannelDetailsCard.Style.scss';
import { ButtonBase } from '@mui/material';

export const ChannelDetailsCard = ({
  selectedChannels,
  selectedContracts,
  // totalClicks,
  total,
  cardRef,
  parentTranslationPath,
  translationPath,
  isForCampaign,
  globalIsLoading,
  handleRemoveChannel,
  wrapperClasses,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div
      className={`channel-details-card-wrapper subchilds-wrapper ${
        wrapperClasses || ''
      }`}
    >
      <div className="card-wrapper">
        <div className="card-content-wrapper">
          <div className="card-header-wrapper texts-header-light px-3 py-2">
            <span>{t(`${translationPath}selected-channels`)}</span>
            <span className="px-1">
              ({selectedChannels.length + selectedContracts.length})
            </span>
          </div>
          <div className="card-body-wrapper">
            {selectedChannels.length + selectedContracts.length > 0 && (
              <>
                <div className="card-body-item-wrapper selected-channels-items-wrapper">
                  <div className="mb-2 title-wrapper">
                    <span>{t(`${translationPath}channels`)}</span>
                  </div>
                  {[...selectedChannels, ...selectedContracts].map((item, index) => (
                    <div
                      className="selected-channel-item"
                      key={`${cardRef}${index + 1}`}
                    >
                      <div className="channel-details-item details-title-wrapper d-flex-v-center-h-between">
                        <span>
                          {(item.channel && item.channel.title)
                            || item.contract?.channel?.name
                            || item.title
                            || 'N/A'}
                        </span>
                        {isForCampaign && (
                          <ButtonBase
                            className="btns-icon theme-transparent"
                            disabled={globalIsLoading}
                            onClick={() => {
                              handleRemoveChannel({
                                channel: item,
                                selectedChannels,
                                selectedContracts,
                              });
                            }}
                          >
                            <span className="fas fa-times" />
                          </ButtonBase>
                        )}
                      </div>
                      <div className="channel-details-item">
                        <span>x</span>
                        <span className="px-1">
                          {item.credits || item.credits === 0
                            ? item.credits
                            : item.credit || 0}
                        </span>
                        <span>{t(`${translationPath}credits`)}</span>
                      </div>
                      {!item.is_contract && (
                        <div className="channel-details-item">
                          <span>$</span>
                          <span className="px-1">
                            {item.contract
                              ? 0
                              : item.cost || item.cost === 0
                                ? item.cost
                                : 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="card-body-item-wrapper">
                  <div className="title-wrapper">
                    <span>{t(`${translationPath}total`)}</span>
                    <span>:</span>
                  </div>
                  <div className="total-text">
                    <span>$</span>
                    <span className="px-1">{total}</span>
                  </div>
                </div>
              </>
            )}
            {selectedChannels.length + selectedContracts.length === 0 && (
              <div className="c-gray-secondary">
                <span>
                  {t(`${translationPath}no-selected-channels-description`)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChannelDetailsCard.propTypes = {
  selectedChannels: PropTypes.instanceOf(Array),
  selectedContracts: PropTypes.instanceOf(Array),
  // totalClicks: PropTypes.number,
  total: PropTypes.number,
  cardRef: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
  isForCampaign: PropTypes.bool,
  globalIsLoading: PropTypes.bool,
  handleRemoveChannel: PropTypes.func,
};
ChannelDetailsCard.defaultProps = {
  selectedChannels: [],
  selectedContracts: [],
  cardRef: 'ChannelDetailsCardRef',
  translationPath: 'ChannelDetailsCard.',
  // totalClicks: 0,
  total: 0,
};

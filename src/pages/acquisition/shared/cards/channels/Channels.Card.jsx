import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  Inputs,
  LoadableImageComponant,
  LoaderComponent,
  TooltipsComponent,
} from '../../../../../components';
import { useEventListener } from '../../../../../hooks';
import './ChannelsCard.Style.scss';
import {
  AddChannelsToCampaignV2,
  AddContractToCampaignV2,
} from '../../../../../services';
import { floatHandler, showError } from '../../../../../helpers';
import { MutateChannelsDataHelper } from '../../../campaigns/helpers/MutateChannelsData.helper';
import { MutateContractsDataHelper } from '../../../campaigns/helpers/MutateContractsData.helper';

export const ChannelsCard = ({
  selectedChannels,
  selectedContracts,
  parentId,
  subParentId,
  idRef,
  campaignUuid,
  isMyChannelCredits,
  data,
  isLoading,
  isLoadingRef,
  isMyContract,
  onLoadMore,
  cardRef,
  onSelectedChannelsChanged,
  onChannelsCreditsChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loadingItems, setLoadingItems] = useState([]);
  const bodyRef = useRef(null);
  const onScrollHandler = useCallback(() => {
    if (
      onLoadMore
      && (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
        || bodyRef.current.scrollTop + bodyRef.current.clientHeight
          >= bodyRef.current.firstChild.clientHeight - 5)
      && data.results.length < data.totalCount
      && !isLoadingRef.current
      && !isLoading
    )
      onLoadMore();
  }, [
    data.results.length,
    data.totalCount,
    isLoading,
    isLoadingRef.current,
    onLoadMore,
  ]);
  useEventListener('scroll', onScrollHandler, bodyRef.current);
  const getSelectedChannel = useCallback(
    (uuid) => {
      if (isMyContract)
        return selectedContracts.findIndex((item) => item.contract_id === uuid);
      else
        return selectedChannels.findIndex(
          (item) =>
            item.channel_uuid === uuid || (isMyChannelCredits && item.uuid === uuid),
        );
    },
    [isMyChannelCredits, selectedChannels, selectedContracts, isMyContract],
  );
  const getSelectedChannelsIndex = useCallback(
    (uuid) => selectedChannels.findIndex((item) => item.uuid === uuid),
    [selectedChannels],
  );
  const onSelectedChannelsClicked = useCallback(
    (channel) => async () => {
      if (!campaignUuid) {
        if (!isMyChannelCredits) return;
        const localSelectedChannelIndex = getSelectedChannelsIndex(channel.uuid);
        const localSelectedChannels = [...selectedChannels];
        if (localSelectedChannelIndex !== -1)
          localSelectedChannels.splice(localSelectedChannelIndex, 1);
        else localSelectedChannels.push({ ...channel, cost: channel.final_cost });
        if (onSelectedChannelsChanged)
          onSelectedChannelsChanged({
            id: parentId,
            value: localSelectedChannels,
          });
        return;
      }
      const localSelectedChannelIndex = getSelectedChannel(channel.uuid);
      setLoadingItems((items) => [...items, channel.uuid]);
      const bodyObj = {
        ...(channel.is_contract
          ? {
            contract_id: localSelectedChannelIndex !== -1 ? null : channel.uuid,
          }
          : {
            channels:
                localSelectedChannelIndex !== -1
                  ? selectedChannels
                    .filter((item) => item.uuid !== channel.uuid)
                    .map((item) => item.uuid) || []
                  : [channel.uuid].concat(
                    selectedChannels.map((item) => item.uuid) || [],
                  ),
          }),
        campaign_uuid: campaignUuid,
      };
      let response;
      if (channel.is_contract) response = await AddContractToCampaignV2(bodyObj);
      else response = await AddChannelsToCampaignV2(bodyObj);
      setLoadingItems((items) => {
        const localItems = [...items];
        const itemIndex = localItems.indexOf(channel.uuid);
        if (itemIndex !== -1) localItems.splice(itemIndex, 1);
        return [...localItems];
      });
      if (response && response.status === 200) {
        if (onSelectedChannelsChanged)
          onSelectedChannelsChanged(
            isMyContract
              ? {
                id: 'selectedContracts',
                value: response.data?.results?.campaign_contract
                  ? MutateContractsDataHelper([
                    response.data?.results?.campaign_contract,
                  ])
                  : [],
              }
              : {
                id: 'selectedChannels',
                value:
                    MutateChannelsDataHelper(
                      response.data?.results?.campaign_channels,
                    ) || [],
              },
          );
        onSelectedChannelsChanged({
          id: 'totalCost',
          value:
            (response.data && response.data.results && response.data.results.cost)
            || 0,
        });
      } else if (localSelectedChannelIndex !== -1)
        showError(
          (response && response.data.message)
            || t(`${translationPath}channel-delete-failed`),
        );
      else
        showError(
          (response && response.data.message)
            || t(`${translationPath}channel-add-failed`),
        );
    },
    [
      isMyContract,
      campaignUuid,
      getSelectedChannel,
      getSelectedChannelsIndex,
      isMyChannelCredits,
      onSelectedChannelsChanged,
      parentId,
      selectedChannels,
      t,
      translationPath,
    ],
  );
  const getSavingChannelsIndex = useCallback(
    (uuid) => loadingItems.findIndex((item) => item === uuid),
    [loadingItems],
  );
  // useEffect(() => {
  //   if (!isLoading && !isLoadingRef.current) onScrollHandler();
  // }, [isLoading, onScrollHandler]);
  return (
    <div className="channels-card-wrapper subchilds-wrapper" ref={bodyRef}>
      <div className="channels-cards-wrapper">
        {data
          && data.results.map((item, index) => (
            <div
              className={`channel-card-wrapper card-wrapper${
                (getSelectedChannel(item.uuid) !== -1 && ' selected') || ''
              }${
                (onChannelsCreditsChanged
                  && getSelectedChannelsIndex(item.uuid) !== -1
                  && ' selected')
                || ''
              }`}
              key={`${cardRef}${index + 1}`}
            >
              <div className="card-content-wrapper">
                <div className="card-body-wrapper">
                  <div className="body-sections-wrapper">
                    <div className="px-2 channel-logo-wrapper">
                      <LoadableImageComponant
                        src={item.logo && item.logo.logo}
                        classes="channel-logo"
                        skeltonClasses="channel-logo"
                        alt={`${t(translationPath)}channel-logo-image`}
                        // defaultImage={ManIcon}
                      />
                    </div>
                    <div className="card-body-items-wrapper">
                      <div className="card-body-item texts-header c-black-light">
                        <span>
                          {item.title
                            || item.channel?.title
                            || item.contract?.channel?.name
                            || 'N/A'}
                        </span>
                      </div>
                      <div className="card-body-item fw-medium">
                        <span>{t(`${translationPath}my-channel-credit`)}</span>
                        <span className="c-green-primary px-1">
                          ({item.credit ? item.credit : 0})
                        </span>
                      </div>
                      <div className="card-body-item">
                        {(item.period || item.range) && !item.is_contract && (
                          <span>
                            <span>
                              {t(`${translationPath}time-to-process`)}
                              <span>:</span>
                            </span>
                            <span className="px-1">{item.period || 'N/A'}</span>
                            <span>{item.range}</span>
                          </span>
                        )}
                        {!item?.is_contract && item.duration && (
                          <>
                            <span className="px-1">&#x25cf;</span>
                            <span>
                              <span>
                                {t(`${translationPath}active-duration`)}
                                <span>:</span>
                              </span>
                              <span className="px-1">{item.duration || 'N/A'}</span>
                              <span>{t(`${translationPath}days`)}</span>
                            </span>
                          </>
                        )}
                        {item?.is_contract && item.expiry_date && (
                          <>
                            <span>
                              <span>
                                {t(`${translationPath}expiry-date`)}
                                <span>:</span>
                              </span>
                              <span className="px-1">
                                {item.expiry_date || 'N/A'}
                              </span>
                            </span>
                          </>
                        )}
                        {item.period && (
                          <>
                            <span className="px-1">&#x25cf;</span>
                            {item.final_cost && <span>${item.final_cost}</span>}
                          </>
                        )}
                        {/* <span>&#x25cf;</span>
                        <span className="px-1 fw-medium">
                          {t(`${translationPath}matching-score`)}
                        </span>
                        <span className="c-green-primary fw-medium">
                          {item.percentage_cost ? item.percentage_cost : 0}
                          <span>%</span>
                        </span> */}
                        {item.description && (
                          <TooltipsComponent
                            contentComponent={
                              <span className="far fa-question-circle mx-1" />
                            }
                            title={item.description}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {onSelectedChannelsChanged && (
                    <ButtonBase
                      className="btns-icon select-btn to-square theme-outline"
                      onClick={onSelectedChannelsClicked(item)}
                      disabled={
                        loadingItems?.length > 0
                        || (isMyContract
                          && selectedContracts.length > 0
                          && getSelectedChannel(item.uuid) === -1)
                        || (!isMyContract && selectedContracts.length > 0)
                      }
                    >
                      <LoaderComponent
                        isLoading={getSavingChannelsIndex(item.uuid) !== -1}
                        isSkeleton
                        wrapperClasses="position-absolute w-100 h-100"
                        skeletonStyle={{ width: '100%', height: '100%' }}
                      />
                      <span
                        className={`fas fa-${
                          (getSelectedChannel(item.uuid) !== -1 && 'check') || 'plus'
                        }`}
                      />
                    </ButtonBase>
                  )}
                  {onChannelsCreditsChanged && (
                    <div className="d-inline-flex-v-center px-2">
                      <ButtonBase
                        className="btns-icon select-btn mx-0 to-square theme-outline"
                        onClick={() => {
                          const localSelectedChannels = [...selectedChannels];
                          const channelIndex = getSelectedChannelsIndex(item.uuid);
                          if (localSelectedChannels[channelIndex][subParentId] === 1)
                            localSelectedChannels.splice(channelIndex, 1);
                          else localSelectedChannels[channelIndex][subParentId] -= 1;
                          if (onChannelsCreditsChanged)
                            onChannelsCreditsChanged({
                              id: 'totalCost',
                              value: floatHandler(
                                localSelectedChannels.reduce(
                                  (sum, element) =>
                                    sum + element.cost * element[subParentId],
                                  0,
                                ),
                                3,
                              ),
                            });
                          if (onChannelsCreditsChanged)
                            onChannelsCreditsChanged({
                              id: parentId,
                              value: localSelectedChannels,
                            });
                        }}
                        disabled={
                          getSelectedChannelsIndex(item.uuid) === -1
                          || selectedChannels[getSelectedChannelsIndex(item.uuid)][
                            subParentId
                          ] === 0
                        }
                      >
                        <span className="fas fa-minus" />
                      </ButtonBase>
                      <Inputs
                        idRef={`channelsCreditsRef${idRef}`}
                        value={
                          getSelectedChannelsIndex(item.uuid) !== -1
                            ? selectedChannels[getSelectedChannelsIndex(item.uuid)][
                              subParentId
                            ]
                            : 0
                        }
                        type="number"
                        min={0}
                        wrapperClasses="channels-card-input-wrapper"
                        themeClass="theme-solid"
                        onInputChanged={(event) => {
                          let { value } = event.target;
                          value = +floatHandler(value, 0);
                          const localSelectedChannels = [...selectedChannels];
                          const channelIndex = getSelectedChannelsIndex(item.uuid);
                          if (channelIndex !== -1)
                            if (value <= 0)
                              localSelectedChannels.splice(channelIndex, 1);
                            else
                              localSelectedChannels[channelIndex][subParentId]
                                = value;
                          else if (value > 0)
                            localSelectedChannels.push({
                              ...item,
                              cost: item.final_cost,
                              [subParentId]: value,
                            });
                          if (onChannelsCreditsChanged)
                            onChannelsCreditsChanged({
                              id: 'totalCost',
                              value: floatHandler(
                                localSelectedChannels.reduce(
                                  (sum, element) =>
                                    sum + element.cost * element[subParentId],
                                  0,
                                ),
                                3,
                              ),
                            });
                          if (onChannelsCreditsChanged)
                            onChannelsCreditsChanged({
                              id: parentId,
                              value: localSelectedChannels,
                            });
                        }}
                      />
                      <ButtonBase
                        className="btns-icon select-btn mx-0 to-square theme-outline"
                        onClick={() => {
                          const localSelectedChannels = [...selectedChannels];
                          const channelIndex = getSelectedChannelsIndex(item.uuid);
                          if (channelIndex !== -1)
                            localSelectedChannels[channelIndex][subParentId] += 1;
                          else
                            localSelectedChannels.push({
                              ...item,
                              cost: item.final_cost,
                              [subParentId]: 1,
                            });
                          if (onChannelsCreditsChanged)
                            onChannelsCreditsChanged({
                              id: 'totalCost',
                              value: floatHandler(
                                localSelectedChannels.reduce(
                                  (sum, element) =>
                                    sum + element.final_cost * element[subParentId],
                                  0,
                                ),
                                3,
                              ),
                            });
                          if (onChannelsCreditsChanged)
                            onChannelsCreditsChanged({
                              id: parentId,
                              value: localSelectedChannels,
                            });
                        }}
                      >
                        <span className="fas fa-plus" />
                      </ButtonBase>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <LoaderComponent
        isLoading={isLoading}
        isSkeleton
        wrapperClasses="channel-card-wrapper card-wrapper"
        skeletonClasses="card-content-wrapper"
        skeletonStyle={{ minHeight: 125 }}
      />
    </div>
  );
};

ChannelsCard.propTypes = {
  isLoadingRef: PropTypes.shape({
    current: PropTypes.bool,
  }),
  campaignUuid: PropTypes.string,
  selectedChannels: PropTypes.instanceOf(Array),
  selectedContracts: PropTypes.instanceOf(Array),
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  idRef: PropTypes.string,
  data: PropTypes.shape({
    results: PropTypes.instanceOf(Array),
    totalCount: PropTypes.number,
  }),
  onSelectedChannelsChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  isMyContract: PropTypes.bool,
  isMyChannelCredits: PropTypes.bool,
  onLoadMore: PropTypes.func,
  onChannelsCreditsChanged: PropTypes.func,
  cardRef: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ChannelsCard.defaultProps = {
  selectedChannels: [],
  selectedContracts: [],
  data: {
    results: [],
    totalCount: 0,
  },
  isLoading: false,
  isMyContract: false,
  isLoadingRef: {
    current: false,
  },
  onLoadMore: undefined,
  campaignUuid: undefined,
  onSelectedChannelsChanged: undefined,
  onChannelsCreditsChanged: undefined,
  parentId: undefined,
  isMyChannelCredits: undefined,
  idRef: undefined,
  subParentId: undefined,
  cardRef: 'ChannelsCardRef',
  translationPath: 'ChannelsCard.',
};

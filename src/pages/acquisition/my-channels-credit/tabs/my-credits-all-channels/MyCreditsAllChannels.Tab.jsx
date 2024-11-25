import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetAllChannelsCredit } from '../../../../../services';
import { ChannelsCard } from '../../../shared/cards';
import { MutateChannelsDataHelper } from '../../../campaigns/helpers/MutateChannelsData.helper';

export const MyCreditsAllChannelsTab = ({
  state,
  onStateChanged,
  filter,
  filterBy,
  onFilterChanged,
  isLoading,
  onIsLoadingChanged,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localIsLoading, setLocalIsLoading] = useState(isLoading);
  const [channels, setChannels] = useState({
    results: [],
    totalCount: 0,
  });
  const isLoadingRef = useRef(false);

  const getAllChannels = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    if (filter.page === 0)
      setChannels({
        results: [],
        totalCount: 0,
      });
    const response = await GetAllChannelsCredit({ ...filter, ...filterBy });
    if (response && response.status === 200) {
      const results = MutateChannelsDataHelper(response.data.results.data);

      if (filter.page === 0)
        setChannels({
          results: results || [],
          totalCount: response.data.results.total || 0,
        });
      else
        setChannels((items) => ({
          results: items.results.concat(results || []),
          totalCount: response.data.results.total || 0,
        }));
    } else
      setChannels({
        results: [],
        totalCount: 0,
      });
    isLoadingRef.current = false;
    setLocalIsLoading(false);
  }, [filter, filterBy]);
  useEffect(() => {
    setLocalIsLoading(true);
    getAllChannels();
  }, [getAllChannels, filter, filterBy]);
  useEffect(() => {
    if (onIsLoadingChanged) onIsLoadingChanged(localIsLoading);
  }, [onIsLoadingChanged, localIsLoading]);
  return (
    <div className="all-channels-tab-wrapper mt-2 childs-wrapper">
      {/*<ChannelsFilter*/}
      {/*  filter={filter}*/}
      {/*  filterBy={filterBy}*/}
      {/*  onFilterByChanged={onFilterByChanged}*/}
      {/*  onFilterChanged={onFilterChanged}*/}
      {/*  parentTranslationPath={parentTranslationPath}*/}
      {/*/>*/}
      {!isLoading
        && !localIsLoading
        && channels
        && channels.results.length === 0 && (
        <div className="d-flex-center header-text-x2">
          <span>{t('there-are-no-channels-credit-available')}</span>
        </div>
      )}
      <ChannelsCard
        selectedChannels={state.campaign_channels || []}
        selectedContracts={state.campaign_contracts || []}
        data={channels}
        parentId="campaign_channels"
        subParentId="credits"
        onLoadMore={() => {
          if (localIsLoading || isLoadingRef.current || isLoading) return;
          setLocalIsLoading(true);
          if (onFilterChanged) onFilterChanged({ ...filter, page: filter.page + 1 });
        }}
        isMyChannelCredits
        onSelectedChannelsChanged={onStateChanged}
        isLoading={localIsLoading || isLoadingRef.current || isLoading}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

MyCreditsAllChannelsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  filterBy: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  onFilterByChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onIsLoadingChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

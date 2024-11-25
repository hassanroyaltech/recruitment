import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { GetAllChannelsV2 } from '../../../../../services';
import { ChannelsCard } from '../../../shared/cards';
import { ChannelsFilter } from '../../../shared/filters';
import { MutateChannelsDataHelper } from '../../../campaigns/helpers/MutateChannelsData.helper';

export const BuyCreditsAllChannelsTab = ({
  state,
  onStateChanged,
  filter,
  filterBy,
  onFilterChanged,
  onFilterByChanged,
  isLoading,
  onIsLoadingChanged,
  parentTranslationPath,
}) => {
  const [localIsLoading, setLocalIsLoading] = useState(isLoading);
  const isLoadingRef = useRef(false);
  const [channels, setChannels] = useState({
    results: [],
    totalCount: 0,
  });

  const getAllChannels = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    if (filter.page === 0)
      setChannels({
        results: [],
        totalCount: 0,
      });

    const response = await GetAllChannelsV2({
      ...filter,
      ...filterBy,
      category_id: filterBy.category?.parent?.id,
    });
    if (response && response.status === 200) {
      const results = await MutateChannelsDataHelper(response.data.results.data);
      if (filter.page === 0)
        setChannels({
          results: results,
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
      <ChannelsFilter
        filter={filter}
        filterBy={filterBy}
        onFilterByChanged={onFilterByChanged}
        onFilterChanged={onFilterChanged}
        parentTranslationPath={parentTranslationPath}
      />
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
        onChannelsCreditsChanged={onStateChanged}
        isLoading={localIsLoading || isLoadingRef.current || isLoading}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

BuyCreditsAllChannelsTab.propTypes = {
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

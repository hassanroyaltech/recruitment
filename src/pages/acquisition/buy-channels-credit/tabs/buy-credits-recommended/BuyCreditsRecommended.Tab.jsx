import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ChannelsCard } from '../../../shared/cards';
import { ChannelsFilter } from '../../../shared/filters';
import { GetAllRecommendedChannels } from '../../../../../services';

export const BuyCreditsRecommendedTab = ({
  state,
  isLoading,
  onStateChanged,
  onFilterChanged,
  onIsLoadingChanged,
  filter,
  parentTranslationPath,
}) => {
  const [localIsLoading, setLocalIsLoading] = useState(isLoading);
  const [channels, setChannels] = useState({
    results: [],
    totalCount: 0,
  });
  const getRecommendedChannels = useCallback(async () => {
    const response = await GetAllRecommendedChannels({
      ...filter,
    });
    if (response && response.status === 200)
      if (filter.page === 1)
        setChannels({
          results: response.data.results.data || [],
          totalCount: response.data.results.total || 0,
        });
      else
        setChannels((items) => ({
          results: items.results.concat(response.data.results.data || []),
          totalCount: response.data.results.total || 0,
        }));
    else
      setChannels({
        results: [],
        totalCount: 0,
      });

    setLocalIsLoading(false);
  }, [filter]);
  useEffect(() => {
    setLocalIsLoading(true);
    getRecommendedChannels();
  }, [getRecommendedChannels, filter]);
  useEffect(() => {
    if (onIsLoadingChanged) onIsLoadingChanged(localIsLoading);
  }, [onIsLoadingChanged, localIsLoading]);

  return (
    <div className="buy-credits-recommended-wrapper mt-2 childs-wrapper">
      <ChannelsFilter
        filter={filter}
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
          setLocalIsLoading(true);
          if (onFilterChanged) onFilterChanged({ ...filter, page: filter.page + 1 });
        }}
        onChannelsCreditsChanged={onStateChanged}
        isLoading={localIsLoading}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

BuyCreditsRecommendedTab.propTypes = {
  state: PropTypes.shape({
    campaign_channels: PropTypes.instanceOf(Array),
    campaign_contracts: PropTypes.instanceOf(Array),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  onIsLoadingChanged: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

// noinspection ES6PreferShortImport

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChannelsCard } from '../../../../../../../shared/cards';
import { ChannelsFilter } from '../../../../../../../shared/filters';
import { GetAllChannelsV2 } from '../../../../../../../../../services';
import { ChannelsSortByEnum } from '../../../../../../../../../enums';
import { MutateChannelsDataHelper } from '../../../../../../helpers/MutateChannelsData.helper';

export const AllChannelsTab = ({
  state,
  activeItem,
  onStateChanged,
  isLoading,
  onLoadingChanged,
  parentTranslationPath,
}) => {
  const [channels, setChannels] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 0,
    title: '',
  });
  const [filterBy, setFilterBy] = useState({
    order_by: ChannelsSortByEnum.costFromLowToHigh.key,
    direction: ChannelsSortByEnum.costFromLowToHigh.direction,
  });
  const isLoadingRef = useRef(false);
  const [isLocalLoading, setIsLocalLoading] = useState(isLoading);
  const getAllChannels = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    if (filter.page === 0)
      setChannels({
        results: [],
        totalCount: 0,
      });
    const response = await GetAllChannelsV2({ ...filter, ...filterBy });
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
    setIsLocalLoading(false);
  }, [filter, filterBy]);
  const onFilterByChanged = (newValue) => {
    setFilterBy(newValue);
  };
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };
  useEffect(() => {
    setIsLocalLoading(true);
    getAllChannels();
  }, [getAllChannels, filter, filterBy]);
  useEffect(() => {
    if (onLoadingChanged) onLoadingChanged(isLocalLoading);
  }, [isLocalLoading, onLoadingChanged]);

  return (
    <div className="all-channels-tab-wrapper mt-3 childs-wrapper">
      <ChannelsFilter
        filter={filter}
        filterBy={filterBy}
        onFilterByChanged={onFilterByChanged}
        onFilterChanged={onFilterChanged}
        parentTranslationPath={parentTranslationPath}
      />
      <ChannelsCard
        selectedChannels={state.selectedChannels}
        selectedContracts={state.selectedContracts}
        data={channels}
        campaignUuid={(activeItem && activeItem.uuid) || undefined}
        onLoadMore={() => {
          if (isLoadingRef.current || isLoading || isLocalLoading) return;

          setIsLocalLoading(true);
          setFilter((items) => ({ ...items, page: filter.page + 1 }));
        }}
        onSelectedChannelsChanged={onStateChanged}
        isLoading={isLoadingRef.current || isLoading || isLocalLoading}
        isLoadingRef={isLoadingRef}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

AllChannelsTab.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onLoadingChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

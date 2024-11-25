import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GetAllRecommendedChannels, GetAllRecommendedChannelsV2 } from 'services';
import { ChannelsCard } from '../../../../../../../shared/cards';
import { ChannelsFilter } from '../../../../../../../shared/filters';
import { MutateChannelsDataHelper } from '../../../../../../helpers/MutateChannelsData.helper';

export const RecommendedTab = ({
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
  // const [filter, setFilter] = useState({
  //   limit: 10,
  //   page: 1,
  //   title: '',
  // });
  // const [filterBy, setFilterBy] = useState({
  //   order_by: '',
  //   direction: 'asc',
  // });
  const [isLocalLoading, setIsLocalLoading] = useState(isLoading);
  const getRecommendedChannels = useCallback(async () => {
    if (!activeItem || !activeItem.job_uuid) return;
    const response = await GetAllRecommendedChannelsV2({
      // ...filterBy,
      job_uuid: activeItem.job_uuid,
    });
    if (response && response.status === 200)
      setChannels({
        results: MutateChannelsDataHelper(response.data.results) || [],
        totalCount: response.data.results?.length || 0,
      });
    else
      setChannels({
        results: [],
        totalCount: 0,
      });

    setIsLocalLoading(false);
  }, [activeItem]);
  // const onFilterByChanged = (newValue) => {
  //   setFilterBy(newValue);
  // };
  // const onFilterChanged = (newValue) => {
  //   setFilter(newValue);
  // };
  useEffect(() => {
    setIsLocalLoading(true);
    getRecommendedChannels();
  }, [getRecommendedChannels]);
  useEffect(() => {
    if (onLoadingChanged) onLoadingChanged(isLocalLoading);
  }, [isLocalLoading, onLoadingChanged]);
  return (
    <div className="recommended-tab-wrapper mt-3 childs-wrapper">
      {/*<ChannelsFilter*/}
      {/*  filter={filter}*/}
      {/*  // filterBy={filterBy}*/}
      {/*  // onFilterByChanged={onFilterByChanged}*/}
      {/*  onFilterChanged={onFilterChanged}*/}
      {/*  parentTranslationPath={parentTranslationPath}*/}
      {/*/>*/}
      <ChannelsCard
        selectedChannels={state.selectedChannels}
        selectedContracts={state.selectedContracts}
        data={channels}
        campaignUuid={(activeItem && activeItem.uuid) || undefined}
        onLoadMore={() => {
          setIsLocalLoading(true);
          // setFilter((items) => ({ ...items, page: items.page + 1 }));
        }}
        onSelectedChannelsChanged={onStateChanged}
        isLoading={isLocalLoading}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

RecommendedTab.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onLoadingChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

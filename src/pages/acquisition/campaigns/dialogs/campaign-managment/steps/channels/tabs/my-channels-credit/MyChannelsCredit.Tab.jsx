// noinspection ES6PreferShortImport

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GetAllChannelsCredit, GetAllConnectedChannels } from 'services';
import { useTranslation } from 'react-i18next';
import { ChannelsCard } from '../../../../../../../shared/cards';
import { MutateChannelsDataHelper } from '../../../../../../helpers/MutateChannelsData.helper';

export const MyChannelsCreditTab = ({
  state,
  activeItem,
  onStateChanged,
  isLoading,
  onLoadingChanged,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [channels, setChannels] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 0,
    title: '',
  });
  // const [filterBy, setFilterBy] = useState({
  //   order_by: '',
  //   direction: 'asc',
  // });
  const [isLocalLoading, setIsLocalLoading] = useState(isLoading);
  const getRecommendedChannels = useCallback(async () => {
    const getApis = [];
    if (filter.page === 0)
      getApis.push(
        GetAllConnectedChannels({
          ...filter,
        }),
      );
    getApis.push(
      GetAllChannelsCredit({
        ...filter,
      }),
    );
    const response = await Promise.all(getApis);
    if (
      response
      && response.length >= 1
      && response.some((item) => item.status === 200)
    ) {
      const successResults = response
        .filter((item) => item.status === 200)
        .reduce(
          (total, item) => ({
            results: total.results.concat(
              MutateChannelsDataHelper(item.data.results.data || []),
            ),
            totalCount:
              total.totalCount
              + (item.data.results.total
                ? item.data.results.total
                : item.data.results.data.length),
          }),
          { results: [], totalCount: 0 },
        );
      if (filter.page === 0) setChannels(successResults);
      else
        setChannels((items) => ({
          results: items.results.concat(successResults.results),
          totalCount: successResults.totalCount,
        }));
    } else
      setChannels({
        results: [],
        totalCount: 0,
      });

    setIsLocalLoading(false);
  }, [filter]);
  useEffect(() => {
    setIsLocalLoading(true);
    getRecommendedChannels();
  }, [getRecommendedChannels, filter]);
  useEffect(() => {
    if (onLoadingChanged) onLoadingChanged(isLocalLoading);
  }, [isLocalLoading, onLoadingChanged]);
  return (
    <div className="recommended-tab-wrapper mt-3 childs-wrapper">
      {!isLoading && !isLocalLoading && channels.results.length === 0 && (
        <div className="d-flex-center header-text-x2">
          <span className="ml--1-reversed">
            {t('there-are-no-channels-credit-available')}
          </span>
        </div>
      )}
      <ChannelsCard
        selectedChannels={state.selectedChannels}
        selectedContracts={state.selectedContracts}
        data={channels}
        campaignUuid={(activeItem && activeItem.uuid) || undefined}
        onLoadMore={() => {
          setIsLocalLoading(true);
          setFilter((items) => ({ ...items, page: items.page + 1 }));
        }}
        onSelectedChannelsChanged={onStateChanged}
        isLoading={isLocalLoading}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

MyChannelsCreditTab.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onLoadingChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

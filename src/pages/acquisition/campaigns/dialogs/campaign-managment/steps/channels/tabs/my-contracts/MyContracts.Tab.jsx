// noinspection ES6PreferShortImport

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ChannelsCard } from '../../../../../../../shared/cards';
import { showError } from '../../../../../../../../../helpers';
import { GetAllMyContracts } from '../../../../../../../../../services';
import { MutateContractsDataHelper } from '../../../../../../helpers/MutateContractsData.helper';

export const MyContractsTab = ({
  state,
  activeItem,
  onStateChanged,
  isLoading,
  onLoadingChanged,
  parentTranslationPath,
}) => {
  const isMountedRef = useRef(true);
  const { t } = useTranslation(parentTranslationPath);
  const [contracts, setContracts] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const isLoadingRef = useRef(isLoading);
  const [isLocalLoading, setIsLocalLoading] = useState(isLoading);
  //
  // const getVonqCustomerID = useCallback(async () => {
  //   setIsLocalLoading(true);
  //   const response = await IntegrationsGenerateVonqToken();
  //   if (response && response.status === 201)
  //     setFilter((items) => ({ ...items, customer_id: response.data.token }));
  //   else {
  //     setIsLocalLoading(true);
  //     showError(t('Shared:failed-to-get-saved-data'), response);
  //   }
  // }, [t]);

  const getMyContracts = useCallback(async () => {
    setIsLocalLoading(true);
    const response = await GetAllMyContracts({
      ...filter,
      offset: (filter.page - 1) * 10,
    });
    setIsLocalLoading(false);
    if (!isMountedRef.current) return;
    if (response) {
      const results = MutateContractsDataHelper(response.data.results.data);
      if (filter.page === 1)
        setContracts({
          results,
          totalCount: response.data?.results?.total || 0,
        });
      else
        setContracts((items) => ({
          results: [...items.results, ...results],
          totalCount: response.data?.results?.total || 0,
        }));
    } else {
      setContracts({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
    // const response = await GetAllMyContracts(filter);
    // if (response && response.status === 200)
    //   if (filter.page === 1)
    //     setContracts({
    //       results: response.data.results,
    //       totalCount: response.data.count,
    //     });
    //   else
    //     setContracts((items) => ({
    //       results: items.results.push(...response.data.results),
    //       totalCount: response.data.count,
    //     }));
    // else {
    //   setContracts({
    //     results: [],
    //     totalCount: 0,
    //   });
    //   showError(t('Shared:failed-to-get-saved-data'), response);
    // }
    isLoadingRef.current = false;
    setIsLocalLoading(false);
  }, [filter, t]);

  useEffect(() => {
    isLoadingRef.current = true;
    setIsLocalLoading((item) => item || true);
    getMyContracts();
  }, [getMyContracts]);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  // useEffect(() => {
  //   getVonqCustomerID();
  // }, []);

  useEffect(() => {
    if (onLoadingChanged) onLoadingChanged(isLocalLoading);
  }, [isLocalLoading, onLoadingChanged]);

  return (
    <div className="my-contracts-tab-wrapper mt-3 childs-wrapper">
      {!isLoading && !isLocalLoading && contracts.results.length === 0 && (
        <div className="d-flex-center header-text-x2">
          <span className="ml--1-reversed">
            {t('there-are-no-contracts-available')}
          </span>
        </div>
      )}
      <ChannelsCard
        selectedChannels={state.selectedChannels}
        selectedContracts={state.selectedContracts}
        data={contracts}
        campaignUuid={(activeItem && activeItem.uuid) || undefined}
        onLoadMore={() => {
          isLoadingRef.current = true;
          setIsLocalLoading(true);
          setFilter((items) => ({ ...items, page: items.page + 1 }));
        }}
        onSelectedChannelsChanged={onStateChanged}
        isLoadingRef={isLoadingRef}
        isLoading={isLocalLoading}
        parentTranslationPath={parentTranslationPath}
        isMyContract
      />
      {/*<VonqIntegrationComponent*/}
      {/*  getAfterHapiInjection={getMyContracts}*/}
      {/*  getBeforeHapiInjection={getBeforeHapiInjection}*/}
      {/*  isWithoutHTMLBody*/}
      {/*  parentTranslationPath={parentTranslationPath}*/}
      {/*/>*/}
    </div>
  );
};

MyContractsTab.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onLoadingChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

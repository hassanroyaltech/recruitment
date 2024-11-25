import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import {
  CollapseComponent,
  LoaderComponent,
  PaginationComponent,
  TooltipsComponent,
} from '../../../../../../../components';
import TablesComponent from '../../../../../../../components/Tables/Tables.Component';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../../../helpers';
import i18next from 'i18next';
import {
  LookupsImportEnum,
  LookupsImportStatusEnum,
} from '../../../../../../../enums';
import {
  GetAllLookupsImportHistory,
  GetLookupsImportHistoryDetails,
  ValidatedLookupsImport,
} from '../../../../../../../services';
import Empty from '../../../../../../recruiter-preference/components/Empty';

const LookupsImportHistoryTab = ({
  // filter,
  // onPageIndexChanged,
  // onPageSizeChanged,
  // state,
  // onStateChanged,
  // isSubmitted,
  // errors,
  getTableHeaderByCol,
  enumItem,
  parentTranslationPath,
  // translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [historyCollapsesToggle, setHistoryCollapsesToggle] = useState([]);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    model: enumItem.key,
    search: '',
  });
  const [lookupsHistory, setLookupsHistory] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current active collapse item
   */
  const getHistoryCollapseItem = useMemo(
    () =>
      ({ item }) =>
        historyCollapsesToggle.find((element) => element.uuid === item.uuid),
    [historyCollapsesToggle],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current active collapse item
   */
  const getLookupStatusEnumItem = useMemo(
    () =>
      ({ item }) =>
        Object.values(LookupsImportStatusEnum).find(
          (element) => element.key === item.status,
        ),
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current active collapse item index
   */
  const getHistoryCollapseIndex = useMemo(
    () =>
      ({ item, items }) =>
        (items || historyCollapsesToggle).findIndex(
          (element) => element.uuid === item.uuid,
        ),
    [historyCollapsesToggle],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the collapse & return the details data
   * when open the collapse for the first time or when the data is not available
   */
  const collapseToggleHandler = useCallback(
    async ({ item }) => {
      const index = getHistoryCollapseIndex({ item });
      const currentToggleItem = getHistoryCollapseItem({ item });
      if (currentToggleItem && currentToggleItem.data)
        setHistoryCollapsesToggle((items) => {
          if (index > -1) {
            items[index].isOpen = !items[index].isOpen;
            return [...items];
          }
          return items;
        });
      else {
        setHistoryCollapsesToggle((items) => {
          const localItems = [...items];
          if (index > -1) {
            localItems[index].isLoading = true;
            return [...localItems];
          }
          return [
            ...localItems,
            {
              uuid: item.uuid,
              isOpen: true,
              isLoading: true,
            },
          ];
        });
        const response = await GetLookupsImportHistoryDetails({ uuid: item.uuid });
        if (response && response.status === 200)
          setHistoryCollapsesToggle((items) => {
            const localItems = [...items];
            const localIndex = getHistoryCollapseIndex({ item, items });
            localItems[localIndex] = {
              ...localItems[localIndex],
              ...response.data.results,
              isLoading: false,
            };
            return [...localItems];
          });
        else {
          setHistoryCollapsesToggle((items) => {
            const localItems = [...items];
            const localIndex = getHistoryCollapseIndex({ item, items });
            localItems[localIndex].isLoading = false;
            return [...localItems];
          });
          showError(t('Shared:failed-to-get-saved-data'), response);
        }
      }
    },
    [getHistoryCollapseIndex, getHistoryCollapseItem, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to start import after validate the fields
   */
  const startImportHandler = useCallback(
    async (item) => {
      setIsLoading(true);
      const response = await ValidatedLookupsImport(item);
      // setIsLoading(false);
      if (response && response.status === 200) {
        setFilter((items) => ({ ...items }));
        showSuccess(t('file-imported-successfully'));
      } else {
        setIsLoading(false);
        setLookupsHistory({ results: [], totalCount: 0 });
        showError(t('file-import-failed'), response);
      }
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all lookup's history
   */
  const getAllLookupsHistory = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllLookupsImportHistory(filter);
    setIsLoading(false);
    if (response && response.status === 200)
      // if (filter.page === 1)
      setLookupsHistory({
        results: response.data.results || [],
        totalCount: response.data.paginate?.total,
      });
    // else
    //   setLookupsHistory((items) => ({
    //     results: [...items.results, ...(response.data.results || [])],
    //     totalCount: response.data.paginate?.total || 0,
    //   }));
    else {
      setLookupsHistory({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  useEffect(() => {
    void getAllLookupsHistory();
  }, [getAllLookupsHistory, filter]);

  return (
    <div className="lookups-import-history-tab tab-content-wrapper">
      {isLoading && (
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          wrapperClasses="my-4"
          skeletonItems={[
            {
              variant: 'rectangular',
              style: { minHeight: 30, marginTop: 5, marginBottom: 5 },
            },
          ]}
          numberOfRepeat={6}
        />
      )}
      <div className="lookups-import-body-wrapper">
        {lookupsHistory.results.map((item, index) => (
          <div
            key={`lookupsHistoryKey${index + 1}`}
            className="lookups-import-item-wrapper"
          >
            <div className="lookups-import-item-header">
              <span className="d-inline-flex-center">
                <span className="d-inline-flex-center">
                  <span className="created-by-text">{t(`created-by`)}</span>
                  <span>:</span>
                  <div className="px-1 c-gray-primary">
                    <span className="px-1">
                      {item.created_by?.name?.[i18next.language]
                        || item.created_by?.name?.en}
                    </span>
                  </div>
                </span>
                <div className="status-wrapper">
                  <span
                    className={`status-text${
                      (getLookupStatusEnumItem({ item })?.color
                        && ` ${getLookupStatusEnumItem({ item })?.color}`)
                      || ''
                    }`}
                  >
                    {getLookupStatusEnumItem({ item })?.value
                      && t(getLookupStatusEnumItem({ item }).value)}
                  </span>
                </div>
              </span>
              <span>
                {item.summary && (
                  <>
                    <TooltipsComponent
                      contentComponent={
                        <span className="px-1">{item.summary.total_rows}</span>
                      }
                      title="total-rows"
                      parentTranslationPath={parentTranslationPath}
                      translationPath=""
                    />
                    <TooltipsComponent
                      contentComponent={
                        <span className="px-1">{item.summary.total_create}</span>
                      }
                      title="total-created"
                      parentTranslationPath={parentTranslationPath}
                      translationPath=""
                    />
                    <TooltipsComponent
                      contentComponent={
                        <span className="px-1">{item.summary.total_update}</span>
                      }
                      title="total-updated"
                      parentTranslationPath={parentTranslationPath}
                      translationPath=""
                    />
                    <TooltipsComponent
                      contentComponent={
                        <span className="px-1">{item.summary.total_errors}</span>
                      }
                      title="total-failed"
                      parentTranslationPath={parentTranslationPath}
                      translationPath=""
                    />
                  </>
                )}
                {getLookupStatusEnumItem({ item })?.isWithStartImport && (
                  <ButtonBase
                    className="btns theme-transparent mx-1"
                    onClick={() =>
                      startImportHandler({
                        uuid: item.uuid,
                      })
                    }
                  >
                    <span>{t('start-import')}</span>
                  </ButtonBase>
                )}
                <ButtonBase
                  className="btns-icon theme-transparent"
                  disabled={getLookupStatusEnumItem({ item })?.isDisabled}
                  onClick={() =>
                    collapseToggleHandler({
                      item,
                    })
                  }
                >
                  <span
                    className={`fas fa-chevron-${
                      (getHistoryCollapseItem({
                        item,
                      })?.isOpen
                        && 'up')
                      || 'down'
                    }`}
                  />
                </ButtonBase>
              </span>
            </div>
            <CollapseComponent
              isOpen={
                getHistoryCollapseItem({
                  item,
                })?.isOpen
              }
              component={
                <div className="active-stage-precondition-body">
                  <TablesComponent
                    data={
                      getHistoryCollapseItem({
                        item,
                      })?.data
                    }
                    isLoading={
                      isLoading
                      || getHistoryCollapseItem({
                        item,
                      })?.isLoading
                    }
                    headerData={
                      getTableHeaderByCol({
                        col: getHistoryCollapseItem({ item })?.col,
                      }) || []
                    }
                    pageIndex={0}
                    pageSize={
                      getHistoryCollapseItem({
                        item,
                      })?.data?.length
                    }
                    totalItems={
                      getHistoryCollapseItem({
                        item,
                      })?.data?.length
                    }
                    isDynamicDate
                    themeClasses="theme-transparent"
                    // onPageIndexChanged={onPageIndexChanged}
                    // onPageSizeChanged={onPageSizeChanged}
                    // isWithCheck
                    // getIsDisabledRow={(row) =>
                    //   !!selectedRows.length && row.uuid !== selectedRows[0]?.uuid
                    // }
                    // onSelectCheckboxChanged={({ selectedRows }) =>
                    //   setSelectedRows(selectedRows)
                    // }
                  />
                </div>
              }
            />
          </div>
        ))}
        {!isLoading && lookupsHistory.totalCount === 0 && <Empty />}
      </div>
      {lookupsHistory.totalCount > 0 && (
        <div className="lookups-import-footer-wrapper">
          <PaginationComponent
            idRef="lookupsImportHistoryPaginationRef"
            totalCount={lookupsHistory.totalCount}
            pageSize={filter.limit}
            pageIndex={filter.page - 1}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        </div>
      )}
    </div>
  );
};

LookupsImportHistoryTab.propTypes = {
  // filter: PropTypes.object.isRequired,
  // onPageIndexChanged: PropTypes.func.isRequired,
  // onPageSizeChanged: PropTypes.func.isRequired,
  // state: PropTypes.shape({
  //   file: PropTypes.object,
  //   file_uuid: PropTypes.string,
  // }).isRequired,
  // isSubmitted: PropTypes.bool.isRequired,
  getTableHeaderByCol: PropTypes.func,
  enumItem: PropTypes.oneOf(Object.values(LookupsImportEnum)).isRequired,
  // onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  // translationPath: PropTypes.string.isRequired,
};

export default LookupsImportHistoryTab;

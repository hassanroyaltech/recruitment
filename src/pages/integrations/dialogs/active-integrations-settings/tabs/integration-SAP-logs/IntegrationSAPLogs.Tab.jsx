import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../../../../helpers';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import { GetAllIntegrationSAPLogs } from '../../../../../../services';

const IntegrationSAPLogsTab = ({ parentTranslationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState({
    results: [],
    totalCount: 0,
  });

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });

  const [tableColumns] = useState([
    {
      id: 1,
      input: 'entity_id',
      label: t('entity-id'),
      isHidden: false,
      isSortable: true,
      cellClasses: 'w-30',
    },
    {
      id: 2,
      input: 'event_type',
      label: t('event-type'),
      isHidden: false,
      isSortable: true,
      // cellClasses: 'w-30',
    },
    {
      id: 3,
      input: 'status',
      label: t('status'),
      isHidden: false,
      isSortable: true,
    },
    {
      id: 4,
      input: 'created_at',
      label: t('created-at'),
      isHidden: false,
      isSortable: true,
      isDate: true,
    },
    {
      id: 5,
      input: 'updated_at',
      label: t('updated-at'),
      isHidden: false,
      isSortable: true,
      isDate: true,
    },
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all logs with filter for SAP integrations
   */
  const getAllIntegrationSAPLogs = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllIntegrationSAPLogs({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setLogs({
        results: response.data.results.data,
        totalCount: response.data.results.total
          ? response.data.results.total
          : response.data.results.data.length,
      });
    else {
      setLogs({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);
  //
  // /**
  //  * @param action
  //  * @param row
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to handle the table actions
  //  */
  // const onActionClicked = (action, row) => {
  //   setActiveItem(row);
  //   if (action.key === SystemActionsEnum.edit.key)
  //     onIsOpenDialogsChanged('eventsManagement', true)();
  //   else if (action.key === SystemActionsEnum.delete.key)
  //     onIsOpenDialogsChanged('eventsDelete', true)();
  // };

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

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    getAllIntegrationSAPLogs().catch();
  }, [getAllIntegrationSAPLogs, filter]);

  return (
    <div className="integration-sap-logs-tab-wrapper tab-wrapper">
      <TablesComponent
        data={logs.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        totalItems={logs.totalCount}
        // selectedRows={selectedRows}
        // isWithCheckAll
        // isWithCheck
        isDynamicDate
        uniqueKeyInput="uuid"
        getIsDisabledRow={(row) => row.can_delete === false}
        // onSelectAllCheckboxChanged={() => {
        //   setSelectedRows((items) =>
        //     globalSelectedRowsHandler(
        //       items,
        //       employees.results.filter((item) => item.can_delete !== false)
        //     )
        //   );
        // }}
        // onSelectCheckboxChanged={({ selectedRow }) => {
        //   if (!selectedRow) return;
        //   setSelectedRows((items) => globalSelectedRowHandler(items, selectedRow));
        //}}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    </div>
  );
};

IntegrationSAPLogsTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
};

export default IntegrationSAPLogsTab;

import React, { lazy, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../../../../helpers';
import { SystemActionsEnum } from '../../../../../../enums';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import { ConfirmDeleteDialog } from '../../../../../setups/shared';
import {
  DeleteIntegrationSAPEvents,
  GetAllIntegrationSAPEvents,
} from '../../../../../../services';
import { ButtonBase } from '@mui/material';
const SAPEventsManagementDialog = lazy(() =>
  import('./dialogs/SAPEventsManagement.Dialog'),
);

const IntegrationSAPEventsTab = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState({
    results: [],
    totalCount: 0,
  });

  const [isOpenDialogs, setIsOpenDialogs] = useState({
    eventsManagement: false,
    eventsDelete: false,
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
      input: 'event_name',
      label: t('event-name'),
      isHidden: false,
      isSortable: true,
      cellClasses: 'w-30',
    },
    {
      id: 2,
      input: 'event_key',
      label: t('event-key'),
      isHidden: false,
      isSortable: true,
      // cellClasses: 'w-30',
    },
    {
      id: 3,
      input: 'event_url',
      label: t('event-url'),
      isHidden: false,
      isSortable: true,
    },
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all events with filter for SAP integrations
   */
  const getAllIntegrationSAPEvents = useCallback(async () => {
    setIsLoading(true);
    // { ...filter } // to be added in the future (when we revamp project)
    const response = await GetAllIntegrationSAPEvents();
    setIsLoading(false);
    if (response && response.status === 200)
      setEvents({
        results: response.data.results,
        totalCount: response.data.paginate
          ? response.data.paginate.total
          : response.data.results.length,
      });
    else {
      setEvents({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [t]);

  /**
   * @param action
   * @param row
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the table actions
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key)
      onIsOpenDialogsChanged('eventsManagement', true)();
    else if (action.key === SystemActionsEnum.delete.key)
      onIsOpenDialogsChanged('eventsDelete', true)();
  };

  /**
   * @param key
   * @param newValue - bool
   * @param isClearActiveItem - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback(
    (key, newValue, isClearActiveItem = false) =>
      () => {
        if (isClearActiveItem) setActiveItem(null);
        setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
      },
    [],
  );

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
    getAllIntegrationSAPEvents().catch();
  }, [getAllIntegrationSAPEvents]);

  return (
    <div className="integration-sap-events-tab-wrapper tab-wrapper">
      <div className="d-flex-v-center-h-end mb-3">
        <ButtonBase
          className="btns theme-transparent"
          onClick={onIsOpenDialogsChanged('eventsManagement', true)}
        >
          <span>{t(`${translationPath}add-new-event`)}</span>
        </ButtonBase>
      </div>
      <TablesComponent
        data={events.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        totalItems={events.totalCount}
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
        isWithTableActions
        onActionClicked={onActionClicked}
        tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
        tableActionsOptions={{
          // eslint-disable-next-line max-len
          getTooltipTitle: ({ row, actionEnum }) =>
            (actionEnum.key === SystemActionsEnum.delete.key
              && row.can_delete === false
              && t('Shared:can-delete-description'))
            || '',
          // eslint-disable-next-line max-len
          getDisabledAction: (item, rowIndex, actionEnum) =>
            actionEnum.key === SystemActionsEnum.delete.key
            && item.can_delete === false,
          isSticky: true,
          right: '0',
        }}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />

      {isOpenDialogs.eventsManagement && (
        <SAPEventsManagementDialog
          isOpen={isOpenDialogs.eventsManagement}
          activeItem={activeItem}
          onSave={() => {
            getAllIntegrationSAPEvents().catch();
          }}
          isOpenChanged={onIsOpenDialogsChanged('eventsManagement', false, true)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}

      {isOpenDialogs.eventsDelete && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="event-deleted-successfully"
          onSave={() => {
            getAllIntegrationSAPEvents().catch();
            // setFilter((items) => ({ ...items, page: 1 }));
            // if (isBulkDelete) setSelectedRows([]);
            // else {
            //   const localSelectedRows = [...selectedRows];
            //   const selectedRowIndex = selectedRows.findIndex(
            //     (item) => item.uuid === activeItem.uuid
            //   );
            //   if (selectedRowIndex !== -1) {
            //     localSelectedRows.splice(selectedRowIndex, 1);
            //     setSelectedRows(localSelectedRows);
            //   }
            // }
          }}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('eventsDelete', false, true)();
            // setActiveItem(null);
            // if (isBulkDelete) {
            //   setIsBulkDelete(false);
            //   setSelectedRows([]);
            // }
          }}
          descriptionMessage="event-delete-description"
          deleteApi={DeleteIntegrationSAPEvents}
          apiProps={{
            // uuid:
            //   (isBulkDelete // api doesn't have bulk delete
            //     && selectedRows.length > 0
            //     && selectedRows.map((item) => item.uuid))
            //   || (activeItem && [activeItem.uuid]),
            uuid: activeItem.uuid,
          }}
          errorMessage="event-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDialogs.eventsDelete}
        />
      )}
    </div>
  );
};

IntegrationSAPEventsTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default IntegrationSAPEventsTab;

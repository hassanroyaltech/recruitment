import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { TableColumnsPopoverComponent, TabsComponent } from '../../../../components';
import { ConfirmDeleteDialog, SharedInputControl } from '../../shared';
import { CommitteesTabs } from '../../shared/tabs-data';
import { DeleteSetupsCommittee, GetAllSetupsCommittees } from '../../../../services';
import { SystemActionsEnum, TablesNameEnum } from '../../../../enums';
import { CommitteesManagementDialog } from './dialogs';
import {
  getIsAllowedPermissionV2,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { CommitteesPermissions } from '../../../../permissions';

const translationPath = 'CommitteesPage.';
const parentTranslationPath = 'SetupsPage';

const CommitteesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const isMounted = useRef(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [committeesPageTabsData] = useState(() => CommitteesTabs);
  const [activeItem, setActiveItem] = useState(null);
  const [committeeType, setCommitteeType] = useState(CommitteesTabs[0]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });
  const [committees, setCommittees] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  /**
   * @param action
   * @param row
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onAddClicked = () => {
    setIsOpenManagementDialog(true);
  };

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change filter from child
   */
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change selected rows from child
   */
  const onSelectedRowsChanged = (newValue) => {
    setSelectedRows(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is open delete dialog from child
   */
  const onIsOpenDeleteDialogChanged = (newValue) => {
    setIsOpenDeleteDialog(newValue);
  };

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is bulk delete from child
   */
  const onIsBulkDeleteChanged = (newValue) => {
    setIsBulkDelete(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all committees with filter
   */
  const getAllSetupsCommittees = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsCommittees({
      ...filter,
      committee_type: committeeType.key,
    });
    if (!isMounted.current) return;
    setIsLoading(false);
    if (response && response.status === 200)
      setCommittees({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setCommittees({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [committeeType.key, filter, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page and send it to parent
   */
  const onPageIndexChanged = (newIndex) => {
    if (onFilterChanged) onFilterChanged({ ...filter, page: newIndex + 1 });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size and send it to parent
   */
  const onPageSizeChanged = (newPageSize) => {
    if (onFilterChanged) onFilterChanged({ ...filter, page: 1, limit: newPageSize });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change selected columns
   * (must be callback)
   */
  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setCommittees((items) => {
      const localItems = { ...items };
      const localItemIndex = localItems.results.findIndex(
        (item) => item[primary_key] === row[primary_key],
      );
      if (localItemIndex === -1) return items;
      localItems.results[localItemIndex][key]
        = !localItems.results[localItemIndex][key];
      return JSON.parse(JSON.stringify(localItems));
    });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is loading columns
   * (must be callback)
   */
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    if (committeeType) getAllSetupsCommittees();
  }, [committeeType, getAllSetupsCommittees, filter]);

  // this is to prevent any memory leak if user changed tab fast
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  return (
    <div className="users-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}committees`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}committees-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="committeesTabsRef"
          currentTab={activeTab}
          data={committeesPageTabsData}
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
            if (filter.page > 1) setFilter((items) => ({ ...items, page: 1 }));
            setCommitteeType(committeesPageTabsData[currentTab]);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />

        <div className="d-flex-v-center-h-between flex-wrap pt-3">
          <div className="d-inline-flex mb-2">
            <SharedInputControl
              idRef="searchRef"
              title="search"
              placeholder="search"
              stateKey="search"
              themeClass="theme-filled"
              endAdornment={
                <span className="end-adornment-wrapper">
                  <span className="fas fa-search" />
                </span>
              }
              onValueChanged={(newValue) => {
                if (onFilterChanged)
                  onFilterChanged({
                    ...filter,
                    page: 1,
                    search: newValue.value,
                  });
              }}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div>
            {selectedRows && selectedRows.length > 0 && (
              <div className="d-inline-flex mb-2 mx-1">
                <ButtonBase
                  className="btns-icon theme-transparent c-warning"
                  onClick={() => {
                    onIsBulkDeleteChanged(true);
                    onIsOpenDeleteDialogChanged(true);
                  }}
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              </div>
            )}
            <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                columns={tableColumns}
                feature_name={TablesNameEnum.Committee.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
            <ButtonBase
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: CommitteesPermissions.AddCommittees.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                if (onAddClicked) onAddClicked();
              }}
              className="btns theme-solid mx-3 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">
                {t(
                  `${translationPath}add-${
                    (committeeType && committeeType.valueSingle) || null
                  }`,
                )}
              </span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            data={committees.results}
            isLoading={isLoading || isLoadingColumns}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={committees.totalCount}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: CommitteesPermissions.DeleteCommittees.key,
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              onSelectedRowsChanged(
                globalSelectedRowsHandler(
                  selectedRows,
                  committees.results.filter((item) => item.can_delete !== false),
                ),
              );
            }}
            onSelectCheckboxChanged={({ selectedRow }) => {
              if (!selectedRow) return;
              onSelectedRowsChanged(
                globalSelectedRowHandler(selectedRows, selectedRow),
              );
            }}
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
              getDisabledAction: (row, rowIndex, action) => {
                if (action.key === SystemActionsEnum.edit.key)
                  return !getIsAllowedPermissionV2({
                    permissionId: CommitteesPermissions.UpdateCommittees.key,
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: CommitteesPermissions.DeleteCommittees.key,
                      permissions: permissionsReducer,
                    })
                  );
                return true;
              },
            }}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        </div>
      </div>
      {isOpenManagementDialog && committeeType && (
        <CommitteesManagementDialog
          activeItem={activeItem}
          committeeType={committeeType}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            if (activeItem) setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenManagementDialog}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="committees-deleted-successfully"
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
            if (isBulkDelete) setSelectedRows([]);
            else {
              const localSelectedRows = [...selectedRows];
              const selectedRowIndex = selectedRows.findIndex(
                (item) => item.uuid === activeItem.uuid,
              );
              if (selectedRowIndex !== -1) {
                localSelectedRows.splice(selectedRowIndex, 1);
                setSelectedRows(localSelectedRows);
              }
            }
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            if (isBulkDelete) {
              setIsBulkDelete(false);
              setSelectedRows([]);
            }
          }}
          descriptionMessage="committees-delete-description"
          deleteApi={DeleteSetupsCommittee}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="committees-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

export default CommitteesPage;

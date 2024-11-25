import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { ConfirmDeleteDialog, SharedInputControl } from '../../shared';
import { DeleteSetupsLocation, GetAllSetupsLocations } from '../../../../services';
import {
  getIsAllowedPermissionV2,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../../components';
import { SystemActionsEnum, TablesNameEnum } from '../../../../enums';
import { LocationsManagementDialog } from './dialogs';
import { LocationsPermissions } from '../../../../permissions';

const translationPath = 'LocationsPage.';
const parentTranslationPath = 'SetupsPage';

const LocationsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all locations with filter
   */
  const getAllSetupsLocations = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsLocations({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setLocations({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setLocations({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
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
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
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
    setLocations((items) => {
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
    getAllSetupsLocations();
  }, [getAllSetupsLocations, filter]);

  return (
    <div className="locations-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}locations`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}locations-setup-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
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
                setFilter((items) => ({
                  ...items,
                  page: 1,
                  search: newValue.value,
                }));
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
                    setIsBulkDelete(true);
                    setIsOpenDeleteDialog(true);
                  }}
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              </div>
            )}
            <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                columns={tableColumns}
                feature_name={TablesNameEnum.Locations.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
            <ButtonBase
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: LocationsPermissions.AddLocations.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-3 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-location`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            data={locations.results}
            isLoading={isLoading || isLoadingColumns}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={locations.totalCount}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: LocationsPermissions.DeleteLocations.key,
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  locations.results.filter((item) => item.can_delete !== false),
                ),
              );
            }}
            onSelectCheckboxChanged={({ selectedRow }) => {
              if (!selectedRow) return;
              setSelectedRows((items) =>
                globalSelectedRowHandler(items, selectedRow),
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
                    permissionId: LocationsPermissions.UpdateLocations.key,
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: LocationsPermissions.DeleteLocations.key,
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
      {isOpenManagementDialog && (
        <LocationsManagementDialog
          activeItem={activeItem}
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
          successMessage="location-setups-deleted-successfully"
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
          descriptionMessage="location-setups-delete-description"
          deleteApi={DeleteSetupsLocation}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="location-setups-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

export default LocationsPage;

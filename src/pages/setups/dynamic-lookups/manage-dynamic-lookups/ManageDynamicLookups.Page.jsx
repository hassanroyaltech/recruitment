import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { ConfirmDeleteDialog, SharedInputControl } from '../../shared';
import {
  CreateSetupsDynamicLookups,
  DeleteSetupsDynamicLookups,
  GetAllSetupsDynamicLookups,
  GetSetupsDynamicLookupsById,
  UpdateSetupsDynamicLookups,
} from '../../../../services';
import {
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  getIsAllowedPermissionV2,
  showError,
} from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../../components';
import { SystemActionsEnum, TablesNameEnum } from '../../../../enums';
import { CategoriesPermissions } from '../../../../permissions';
import { LookupsManagementDialog } from 'pages/setups/shared/dialogs/lookups-management/LookupsManagementDialog';

const translationPath = 'ManageDynamicLookupsPage.';
const parentTranslationPath = 'SetupsPage';

const ManageDynamicLookupsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicLookups, setDynamicLookups] = useState(() => ({
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

  const GetAllDynamicLookups = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsDynamicLookups({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setDynamicLookups({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setDynamicLookups({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setDynamicLookups((items) => {
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

  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  useEffect(() => {
    GetAllDynamicLookups();
  }, [GetAllDynamicLookups, filter]);

  return (
    <div className="dynamic-lookups-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}dynamic-lookups`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}dynamic-lookups-description`)}
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
                feature_name={TablesNameEnum.DynamicLookups.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
            <ButtonBase
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: CategoriesPermissions.AddCategories.key, // change later
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-3 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">
                {t(`${translationPath}add-dynamic-lookup`)}
              </span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            isDynamicDate
            isWithTableActions
            uniqueKeyInput="uuid"
            pageSize={filter.limit}
            data={dynamicLookups.results}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            onActionClicked={onActionClicked}
            totalItems={dynamicLookups.totalCount}
            onPageSizeChanged={onPageSizeChanged}
            onPageIndexChanged={onPageIndexChanged}
            isLoading={isLoading || isLoadingColumns}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: CategoriesPermissions.DeleteCategories.key, // change later
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  dynamicLookups.results.filter((item) => item.can_delete !== false),
                ),
              );
            }}
            onSelectCheckboxChanged={({ selectedRow }) => {
              if (!selectedRow) return;
              setSelectedRows((items) =>
                globalSelectedRowHandler(items, selectedRow),
              );
            }}
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
                    permissionId: CategoriesPermissions.UpdateCategories.key, // change later
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: CategoriesPermissions.DeleteCategories.key, // change later
                      permissions: permissionsReducer,
                    })
                  );
                return true;
              },
            }}
          />
        </div>
      </div>
      {isOpenManagementDialog && (
        <LookupsManagementDialog
          activeItem={activeItem}
          lookup={{
            key: 1,
            label: 'dynamic-lookups',
            valueSingle: 'dynamic-lookup',
            feature_name: TablesNameEnum.DynamicLookups.key,
            updateAPI: UpdateSetupsDynamicLookups,
            createAPI: CreateSetupsDynamicLookups,
            viewAPI: GetSetupsDynamicLookupsById,
            listAPI: GetAllSetupsDynamicLookups,
            deleteAPI: DeleteSetupsDynamicLookups,
          }}
          onSave={() => {
            setFilter({ ...filter, page: filter.page });
          }}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            if (activeItem) setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenManagementDialog}
          updateSuccessMessage="dynamic-lookup-updated-successfully"
          createSuccessMessage="dynamic-lookup-created-successfully"
          createFailedMessage="failed-to-create-dynamic-lookup"
          updateFailedMessage="failed-to-update-dynamic-lookup"
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="dynamic-lookup-deleted-successfully"
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
          descriptionMessage="dynamic-lookup-delete-description"
          deleteApi={DeleteSetupsDynamicLookups}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="dynamic-lookup-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          isOpen={isOpenDeleteDialog}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default ManageDynamicLookupsPage;

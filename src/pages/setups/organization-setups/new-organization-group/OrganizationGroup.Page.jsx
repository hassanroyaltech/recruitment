import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { ConfirmDeleteDialog, SharedInputControl } from '../../shared';
import {
  DeleteSetupsNewOrganizationGroup,
  GetAllSetupsNewOrganizationGroup,
} from '../../../../services';
import {
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
  getIsAllowedPermissionV2,
} from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../../components';
import { NewOrganizationGroupManagementDialog } from './dialogs';
import { LookupsImportEnum, SystemActionsEnum, TablesNameEnum } from '../../../../enums';
import { OrganizationGroupPermissions } from '../../../../permissions';
import { LookupImportDialog } from '../../shared/dialogs/lookups-import/LookupsImport.Dialog';

const translationPath = 'OrganizationGroupPage.';
const parentTranslationPath = 'SetupsPage';

const NewOrganizationGroupPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenLookupImportDialog, setIsOpenLookupImportDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationGroup, setOrganizationGroup] = useState(() => ({
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
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to get all organizationGroup with filter
   */
  const getAllCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsNewOrganizationGroup({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setOrganizationGroup({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setOrganizationGroup({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
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
    setOrganizationGroup((items) => {
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
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change is loading columns
   * (must be callback)
   */
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories, filter]);

  return (
    <div className="organizationGroup-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}organization-group`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}organization-group-description`)}
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
          <div className="px-2">
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
                feature_name={TablesNameEnum.NewOrganizationGroup.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
            <ButtonBase
              // disabled={
              //   !getIsAllowedPermissionV2({
              //     permissionId: PositionTitlePermissions.AddPositionTitle.key,
              //     permissions: permissionsReducer,
              //   })
              // }
              onClick={() => {
                setIsOpenLookupImportDialog(true);
              }}
              className="btns theme-solid mx-2 mb-2"
            >
              <span className="fas fa-file-import" />
              <span className="px-2">{t(`${translationPath}import-${LookupsImportEnum.organization_group.value}`)}</span>
            </ButtonBase>
            <ButtonBase
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId:
                    OrganizationGroupPermissions.AddOrganizationGroup.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-2 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">
                {t(`${translationPath}add-organization-group`)}
              </span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            isDynamicDate
            isWithCheckAll
            isWithCheck
            selectedRows={selectedRows}
            uniqueKeyInput="uuid"
            pageSize={filter.limit}
            data={organizationGroup.results}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            totalItems={organizationGroup.totalCount}
            onPageSizeChanged={onPageSizeChanged}
            onPageIndexChanged={onPageIndexChanged}
            isLoading={isLoading || isLoadingColumns}
            // isSelectAllDisabled={!getIsAllowedPermissionV2({
            //   permissionId: OrganizationGroupPermissions.DeleteOrganizationGroup.key,
            //   permissions: permissionsReducer,
            // })}
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  organizationGroup.results.filter(
                    (item) => item.can_delete !== false,
                  ),
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
                    permissionId:
                      OrganizationGroupPermissions.UpdateOrganizationGroup.key,
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId:
                        OrganizationGroupPermissions.DeleteOrganizationGroup.key,
                      permissions: permissionsReducer,
                    })
                  );
                return true;
              },
            }}
            tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
          />
        </div>
      </div>
      {isOpenManagementDialog && (
        <NewOrganizationGroupManagementDialog
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
      {isOpenLookupImportDialog && (
        <LookupImportDialog
          enumItem={LookupsImportEnum.organization_group}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          isOpenChanged={() => {
            setIsOpenLookupImportDialog(false);
          }}
          isOpen={isOpenLookupImportDialog}
          translationPath={translationPath}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="organization-group-deleted-successfully"
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
          descriptionMessage="organization-group-delete-description"
          deleteApi={DeleteSetupsNewOrganizationGroup}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="organization-group-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          isOpen={isOpenDeleteDialog}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default NewOrganizationGroupPage;

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDeleteDialog, SharedInputControl } from '../../shared';
import {
  DeleteSetupsBranch,
  GetAllSetupsBranches,
  GetAllSetupsUserBranches,
} from '../../../../services';
import {
  showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  getIsAllowedPermissionV2,
} from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../../components';
import { BranchesManagementDialog } from './dialogs';
import { SystemActionsEnum, TablesNameEnum } from '../../../../enums';
import { updateBranches } from '../../../../stores/actions/branchesActions';
import { updateSelectedBranch } from '../../../../stores/actions/selectedBranchActions';
import { BranchesPermissions } from '../../../../permissions';

const translationPath = 'BranchesPage.';
const parentTranslationPath = 'SetupsPage';

const BranchesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all branches with filter
   */
  const getAllSetupsBranches = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsBranches({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setBranches({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setBranches({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all branches for current account
   */
  const getAllSetupsUserBranches = useCallback(async () => {
    const response = await GetAllSetupsUserBranches();
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      dispatch(
        updateBranches({
          results: results.companies,
          totalCount: results.companies.length,
          excluded_countries: results?.excluded_countries,
        }),
      );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [dispatch, t]);

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
    setBranches((items) => {
      const localItems = { ...items };
      const localItemIndex = localItems.results.findIndex(
        (item) => item[primary_key] === row[primary_key],
      );
      if (localItemIndex === -1) return items;
      localItems.results[localItemIndex][key]
        = !localItems.results[localItemIndex][key];
      return JSON.parse(JSON.stringify(localItems));
    });
    getAllSetupsUserBranches();
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is loading columns
   * (must be callback)
   */
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  /**
   * @author Aladdin Al-Awadat (a.alawadat@elevatus.io)
   * @Description this method is to close the management dialog handler
   */
  const onIsOpenBranchesManagementChanged = useCallback(() => {
    setIsOpenManagementDialog(false);
    if (activeItem) setActiveItem(null);
  }, [activeItem]);

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    getAllSetupsBranches();
  }, [getAllSetupsBranches, filter]);

  return (
    <div className="branches-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}branches-setup`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}branches-setup-description`)}
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
                feature_name={TablesNameEnum.Company.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
            <ButtonBase
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: BranchesPermissions.AddBranches.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-3 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-branch`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            data={branches.results}
            isLoading={isLoading || isLoadingColumns}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={branches.totalCount}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: BranchesPermissions.DeleteBranches.key,
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  branches.results.filter((item) => item.can_delete !== false),
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
              getDisabledAction: (item, rowIndex, action) => {
                if (action.key === SystemActionsEnum.edit.key)
                  return !getIsAllowedPermissionV2({
                    permissionId: BranchesPermissions.UpdateBranches.key,
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    !getIsAllowedPermissionV2({
                      permissionId: BranchesPermissions.DeleteBranches.key,
                      permissions: permissionsReducer,
                    }) || item.can_delete === false
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
        <BranchesManagementDialog
          activeItem={activeItem}
          onSave={() => {
            getAllSetupsUserBranches();
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          isOpenChanged={onIsOpenBranchesManagementChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenManagementDialog}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="branch-setups-deleted-successfully"
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
            if (
              selectedBranchReducer
              && activeItem.uuid === selectedBranchReducer.uuid
            ) {
              const localActiveBranch = (
                (branchesReducer
                  && branchesReducer.branches
                  && branchesReducer.branches.results)
                || []
              ).find((item) => item.uuid !== activeItem.uuid && item.can_access);

              dispatch(updateSelectedBranch(localActiveBranch));
            }
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
          descriptionMessage="branch-setups-delete-description"
          deleteApi={DeleteSetupsBranch}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="branch-setups-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

export default BranchesPage;

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { ConfirmDeleteDialog, SharedInputControl } from '../../../setups/shared';
import {
  DeleteSetupsPreScreening,
  GetAllSetupsPreScreening,
} from '../../../../services';
import {
  showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  GlobalHistory,
  getIsAllowedPermissionV2,
} from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../../components';
import { SystemActionsEnum, TablesNameEnum } from '../../../../enums';
import { PreScreeningApprovalPermissions } from 'permissions';
import { useSelector } from 'react-redux';

const translationPath = '';
const parentTranslationPath = 'InitialApproval';

const PreScreeningApprovalPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [approvals, setApprovals] = useState(() => ({
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
   * @Description this method is to get all pre-screening-approval with filter
   */
  const getAllApprovals = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsPreScreening({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setApprovals({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setApprovals({
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
    if (action.key === SystemActionsEnum.edit.key)
      GlobalHistory.push(
        `/recruiter/job/initial-approval/pre-screening-approval/add-approval?uuid=${row.uuid}`,
      );
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
   * @Description this method is to change is loading columns
   * (must be callback)
   */
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  // this to get table data on init & on filter change & on columns change
  useEffect(() => {
    getAllApprovals();
  }, [getAllApprovals, filter]);

  return (
    <div className="page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}pre-screening`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}approve-applicants-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex mb-2">
            <SharedInputControl
              title="search"
              idRef="searchRef"
              stateKey="search"
              placeholder="search"
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
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId:
                        PreScreeningApprovalPermissions.DeletePreScreening.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              </div>
            )}
            <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                isLoading={isLoading}
                columns={tableColumns}
                onColumnsChanged={onColumnsChanged}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                feature_name={TablesNameEnum.PreScreeningSettings.key}
              />
            </div>
            <ButtonBase
              onClick={() => {
                GlobalHistory.push(
                  '/recruiter/job/initial-approval/pre-screening-approval/add-approval',
                );
              }}
              className="btns theme-solid mx-3 mb-2"
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: PreScreeningApprovalPermissions.AddPreScreening.key,
                  permissions: permissionsReducer,
                })
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-new-approval`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            isWithCheck
            isDynamicDate
            isWithCheckAll
            isWithTableActions
            uniqueKeyInput="uuid"
            pageSize={filter.limit}
            data={approvals.results}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            totalItems={approvals.totalCount}
            onActionClicked={onActionClicked}
            onPageSizeChanged={onPageSizeChanged}
            onPageIndexChanged={onPageIndexChanged}
            isLoading={isLoading || isLoadingColumns}
            selectedRows={selectedRows}
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  approvals.results.filter((item) => item.can_delete !== false),
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
              getDisabledAction: (item, rowIndex, actionEnum) =>
                (actionEnum.key === SystemActionsEnum.delete.key
                  && (item.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId:
                        PreScreeningApprovalPermissions.DeletePreScreening.key,
                      permissions: permissionsReducer,
                    })))
                || (actionEnum.key === SystemActionsEnum.edit.key
                  && !getIsAllowedPermissionV2({
                    permissionId:
                      PreScreeningApprovalPermissions.UpdatePreScreening.key,
                    permissions: permissionsReducer,
                  })),
            }}
          />
        </div>
      </div>
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
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
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          apiDeleteKey="uuid"
          activeItemKey="uuid"
          activeItem={activeItem}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            if (isBulkDelete) {
              setIsBulkDelete(false);
              setSelectedRows([]);
            }
          }}
          isOpen={isOpenDeleteDialog}
          deleteApi={DeleteSetupsPreScreening}
          errorMessage="approval-delete-failed"
          parentTranslationPath={parentTranslationPath}
          successMessage="approval-deleted-successfully"
          descriptionMessage="approval-delete-description"
        />
      )}
    </div>
  );
};

export default PreScreeningApprovalPage;

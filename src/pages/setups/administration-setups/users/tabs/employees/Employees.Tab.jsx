import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import {
  ConfirmDeleteDialog,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
import {
  DeleteSetupsEmployee,
  GetAllSetupsEmployees,
  SendReminderSetupsUser,
} from '../../../../../../services';
import {
  showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  GlobalSecondaryDateFormat,
  getIsAllowedPermissionV2,
  showSuccess,
} from '../../../../../../helpers';
import { EmployeeManagementDialog } from './dialogs';
import {
  LookupsImportEnum,
  SystemActionsEnum,
  TablesNameEnum,
  UsersVerificationStatusesEnum
} from '../../../../../../enums';
import {
  PopoverComponent,
  TableColumnsPopoverComponent,
} from '../../../../../../components';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import { PermissionsManagementDialog } from '../dialogs/PermissionsManagement.Dialog';
import { EmployeeProfileDialog } from './dialogs/empolyee-profile/EmployeeProfile.Dialog';
import { UsersPermissions } from '../../../../../../permissions';
import { LookupImportDialog } from '../../../../shared/dialogs/lookups-import/LookupsImport.Dialog';

const translationPath = 'EmployeesPage.';
const parentTranslationPath = 'SetupsPage';

const EmployeesTab = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenLookupImportDialog, setIsOpenLookupImportDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenViewDialog, setIsOpenViewDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenPermissionsDialog, setIsOpenPermissionsDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [usersVerificationStatusesEnum] = useState(() =>
    Object.values(UsersVerificationStatusesEnum),
  );
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
    verification_status: '',
  });

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to get all employees with filter
   */
  const getAllEmployees = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsEmployees({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setEmployees({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setEmployees({
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
    else if (action.key === SystemActionsEnum.view.key) setIsOpenViewDialog(true);
    else if (action.key === SystemActionsEnum.permissions.key)
      setIsOpenPermissionsDialog(true);
    else if (action.key === SystemActionsEnum.reminder.key) sendReminder([row]);
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
    const birthDataIndex = newValue.findIndex((item) => item.input === 'birth_date');
    const localNewValue = [...newValue];

    if (birthDataIndex !== -1)
      localNewValue[birthDataIndex].dateFormat = GlobalSecondaryDateFormat;

    setTableColumns(localNewValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setEmployees((items) => {
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
   * @Description this method is to close the management dialog
   */
  const isOpenManagementDialogChanged = useCallback(() => {
    setIsOpenManagementDialog(false);
    if (activeItem) setActiveItem(null);
  }, [activeItem]);

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
    getAllEmployees();
  }, [getAllEmployees, filter]);

  const filterSelectedItems = useCallback(
    ({ key, value }) => (selectedRows || []).filter((item) => item[key] === value),
    [selectedRows],
  );
  const forDeleteArray = useMemo(
    () => filterSelectedItems({ key: 'can_delete', value: true }),
    [filterSelectedItems],
  );

  const forRemindArray = useMemo(
    () =>
      (selectedRows || []).filter((item) =>
        [
          UsersVerificationStatusesEnum.Pending.value,
          UsersVerificationStatusesEnum.Expired.value,
        ].includes(item.verification_status),
      ),
    [selectedRows],
  );

  const sendReminder = useCallback(
    async (items) => {
      setIsLoading(true);
      const localeItems = { user_uuid: items.map((item) => item.user_uuid) };
      try {
        const response = await SendReminderSetupsUser(localeItems);
        setIsLoading(false);
        if (response?.status === 200 || response?.status === 201) {
          showSuccess(t('reminder-sent-successfully'));
          if (items?.length > 0) setSelectedRows([]);
          setFilter((items) => ({ ...items }));
        } else showError(t('failed-to-send-reminder'), response);
      } catch (error) {
        setIsLoading(false);
        showError(t('failed-to-send-reminder'), error);
      }
    },
    [t],
  );

  return (
    <div className="employees-page tab-wrapper">
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
          <div className="px-2">
            {selectedRows && selectedRows.length > 0 && (
              <div className="d-inline-flex mb-2 mx-1">
                {forDeleteArray?.length > 0 && (
                  <ButtonBase
                    className="btns-icon theme-transparent c-warning"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: UsersPermissions.DeleteUsers.key,
                        permissions: permissionsReducer,
                      })
                    }
                    onClick={() => {
                      setIsBulkDelete(true);
                      setIsOpenDeleteDialog(true);
                    }}
                  >
                    <span className={SystemActionsEnum.delete.icon} />
                  </ButtonBase>
                )}
                {forRemindArray?.length > 0 && (
                  <ButtonBase
                    className="btns-icon theme-transparent c-primary"
                    onClick={(e) => setPopoverAttachedWith(e.target)}
                  >
                    <span className="fas fa-cog" />
                  </ButtonBase>
                )}
              </div>
            )}
            <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                isLoading={isLoading}
                columns={tableColumns}
                onReloadData={onReloadDataHandler}
                onColumnsChanged={onColumnsChanged}
                feature_name={TablesNameEnum.Employees.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
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
              <span className="px-2">
                {t(`${translationPath}import-${LookupsImportEnum.employee.value}`)}
              </span>
            </ButtonBase>
            <ButtonBase
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-2 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-employee`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="d-flex-v-center-h-end">
          <SharedAutocompleteControl
            title="verification-status"
            stateKey="status"
            placeholder="select-verification-status"
            editValue={filter?.verification_status || ''}
            isDisabled={isLoading}
            onValueChanged={({ value }) => {
              setFilter((items) => ({
                ...items,
                page: 1,
                verification_status: value,
              }));
            }}
            initValues={usersVerificationStatusesEnum}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) => t(`${option.title}`)}
          />
        </div>
        <div className="px-2">
          <TablesComponent
            data={employees.results}
            isLoading={isLoading || isLoadingColumns}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={employees.totalCount}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            // isSelectAllDisabled={!getIsAllowedPermissionV2({
            //   permissionId: UsersPermissions.DeleteUsers.key,
            //   permissions: permissionsReducer,
            // })}
            getIsDisabledRow={(row) =>
              row.can_delete === false
              && ![
                UsersVerificationStatusesEnum.Pending.value,
                UsersVerificationStatusesEnum.Expired.value,
              ].includes(row.verification_status)
            }
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  employees.results.filter(
                    (item) =>
                      item.can_delete !== false
                      || [
                        UsersVerificationStatusesEnum.Pending.value,
                        UsersVerificationStatusesEnum.Expired.value,
                      ].includes(item.verification_status),
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
            tableActions={[
              // SystemActionsEnum.permissions,
              SystemActionsEnum.view,
              SystemActionsEnum.edit,
              SystemActionsEnum.reminder,
              SystemActionsEnum.delete,
            ]}
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
                    permissionId: UsersPermissions.UpdateUsers.key,
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: UsersPermissions.DeleteUsers.key,
                      permissions: permissionsReducer,
                    })
                  );
                if (action.key === SystemActionsEnum.reminder.key)
                  return ![
                    UsersVerificationStatusesEnum.Pending.value,
                    UsersVerificationStatusesEnum.Expired.value,
                  ].includes(row.verification_status);
                if (action.key === SystemActionsEnum.view.key)
                  return !getIsAllowedPermissionV2({
                    permissionId: UsersPermissions.ViewUsers.key,
                    permissions: permissionsReducer,
                  });
                return true;
              },
            }}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        </div>
      </div>
      {isOpenManagementDialog && (
        <EmployeeManagementDialog
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          isOpenChanged={isOpenManagementDialogChanged}
          isOpen={isOpenManagementDialog}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenLookupImportDialog && (
        <LookupImportDialog
          enumItem={LookupsImportEnum.employee}
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
      {isOpenPermissionsDialog && (
        <PermissionsManagementDialog
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          singleKey="employee"
          isOpenChanged={() => {
            setIsOpenPermissionsDialog(false);
            if (activeItem) setActiveItem(null);
          }}
          isOpen={isOpenPermissionsDialog}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
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
          activeItem={activeItem}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            if (isBulkDelete) {
              setIsBulkDelete(false);
              setSelectedRows([]);
            }
          }}
          deleteApi={DeleteSetupsEmployee}
          successMessage="employee-deleted-successfully"
          descriptionMessage="employee-delete-description"
          apiProps={{
            uuid:
              (isBulkDelete
                && forDeleteArray.length > 0
                && forDeleteArray.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          apiDeleteKey="uuid"
          activeItemKey="uuid"
          isOpen={isOpenDeleteDialog}
          errorMessage="employee-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenViewDialog && (
        <EmployeeProfileDialog
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          singleKey="employee"
          isOpenChanged={() => {
            setIsOpenViewDialog(false);
            if (activeItem) setActiveItem(null);
          }}
          isOpen={isOpenViewDialog}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {
        <PopoverComponent
          idRef="employessActionsPopoverRef"
          attachedWith={popoverAttachedWith}
          handleClose={() => setPopoverAttachedWith(null)}
          component={
            <div className="d-flex-column p-1">
              <ButtonBase
                className={`btns theme-transparent m-0`}
                onClick={() => {
                  setPopoverAttachedWith(null);
                  sendReminder(forRemindArray);
                }}
                disabled={forRemindArray?.length === 0}
              >
                <span className="px-2">
                  <span className={`${SystemActionsEnum.reminder.icon}`} />
                  <span className="px-1"></span>
                  {t(`send-reminder`)}{' '}
                </span>
              </ButtonBase>
            </div>
          }
        />
      }
    </div>
  );
};

export default EmployeesTab;

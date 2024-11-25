import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { ConfirmDeleteDialog, SharedInputControl } from '../../setups/shared';
import { DeleteSetupsEmployee, GetAllSetupsEmployees } from '../../../services';
import {
  showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  GlobalSecondaryDateFormat,
} from '../../../helpers';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../components';
import { EmployeeManagementDialog } from './dialogs';
import { LookupsImportEnum, SystemActionsEnum, TablesNameEnum } from '../../../enums';
import { LookupImportDialog } from '../../setups/shared/dialogs/lookups-import/LookupsImport.Dialog';

const translationPath = 'EmployeesPage.';
const parentTranslationPath = 'SetupsPage';

const EmployeesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenLookupImportDialog, setIsOpenLookupImportDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState(() => ({
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

  return (
    <div className="employees-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}employees`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}employees-description`)}
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
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  employees.results.filter((item) => item.can_delete !== false),
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
              getDisabledAction: (item, rowIndex, actionEnum) =>
                actionEnum.key === SystemActionsEnum.delete.key
                && item.can_delete === false,
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
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            if (activeItem) setActiveItem(null);
          }}
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
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          apiDeleteKey="uuid"
          activeItemKey="uuid"
          isOpen={isOpenDeleteDialog}
          errorMessage="employee-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
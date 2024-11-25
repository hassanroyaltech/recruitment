import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import {
  ConfirmDeleteDialog,
  // SharedInputControl,
} from '../../../../shared';
import {
  DeleteSetupsProvider,
  GetAllSetupsProviders,
} from '../../../../../../services';
import {
  showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  // GlobalSecondaryDateFormat,
  getIsAllowedPermissionV2,
} from '../../../../../../helpers';
import { ProviderManagementDialog } from './dialogs';
import {
  SystemActionsEnum,
  // TablesNameEnum,
} from '../../../../../../enums';
import {
  DialogComponent,
  // TableColumnsPopoverComponent,
} from '../../../../../../components';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import { PermissionsManagementDialog } from '../dialogs/PermissionsManagement.Dialog';
import { AgencyPermissions } from '../../../../../../permissions';
import PropTypes from 'prop-types';
import ProviderProfilePage from 'pages/provider/profile/Profile.Page';
import { ProviderRatingDrawer } from 'pages/provider/rating/Rating.Drawer';

const translationPath = 'ProvidersPage.';
const parentTranslationPath = 'SetupsPage';

const ProvidersTab = ({ userType }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenPermissionsDialog, setIsOpenPermissionsDialog] = useState(false);
  const [isOpenProfileDialog, setIsOpenProfileDialog] = useState(false);
  // const [tableColumns, setTableColumns] = useState([]);
  // const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [openedRatingDrawer, setOpenedRatingDrawer] = useState(false);

  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  // const userReducer = useSelector((state) => state?.userReducer);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    // search: '',
    // status: false,
    use_for: 'list',
    type: userType, // agency or university
    order_by: undefined,
    order_type: undefined,
  });

  const getAllProviders = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsProviders({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setProviders({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setProviders({
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
    // if (action.key === SystemActionsEnum.view.key) setIsOpenProfileDialog(true);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
    else if (action.key === SystemActionsEnum.view.key)
      openDetailsDrawerHandler(row);
    else if (action.key === SystemActionsEnum.permissions.key)
      setIsOpenPermissionsDialog(true);
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  // const onColumnsChanged = useCallback((newValue) => {
  //   const birthDataIndex = newValue.findIndex((item) => item.input === 'birth_date');
  //   const localNewValue = [...newValue];

  //   if (birthDataIndex !== -1)
  //     localNewValue[birthDataIndex].dateFormat = GlobalSecondaryDateFormat;

  //   setTableColumns(localNewValue);
  // }, []);

  // const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
  //   setProviders((items) => {
  //     const localItems = { ...items };
  //     const localItemIndex = localItems.results.findIndex(
  //       (item) => item[primary_key] === row[primary_key]
  //     );
  //     if (localItemIndex === -1) return items;
  //     localItems.results[localItemIndex][key]
  //       = !localItems.results[localItemIndex][key];
  //     return JSON.parse(JSON.stringify(localItems));
  //   });
  // };

  const isOpenManagementDialogChanged = useCallback(() => {
    setIsOpenManagementDialog(false);
    if (activeItem) setActiveItem(null);
  }, [activeItem]);

  // const onIsLoadingColumnsChanged = useCallback((newValue) => {
  //   setIsLoadingColumns(newValue);
  // }, []);

  const openDetailsDrawerHandler = useCallback((item) => {
    setOpenedRatingDrawer(true);
    setActiveItem(item);
  }, []);

  useEffect(() => {
    getAllProviders();
  }, [getAllProviders, filter]);

  return (
    <div className="providers-page tab-wrapper">
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex mb-2">
            {/* <SharedInputControl
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
            /> */}
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
            {/* <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                isLoading={isLoading}
                columns={tableColumns}
                onReloadData={onReloadDataHandler}
                onColumnsChanged={onColumnsChanged}
                feature_name={TablesNameEnum.Employees.key} // TODO: change to Providers later
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
              />
            </div> */}
            <ButtonBase
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-3 mb-2"
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: AgencyPermissions.AddAgency.key,
                  permissions: permissionsReducer,
                })
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">
                {t(`${translationPath}invite-${userType}`)}
              </span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            headerData={[
              {
                id: 1,
                label: t(`${translationPath}name`),
                input: 'name',
              },
              {
                id: 2,
                label: t(`${translationPath}email`),
                input: 'email',
              },
              {
                id: 3,
                label: t(`${translationPath}invitation-status`),
                input: 'invitation_status',
              },
              {
                id: 4,
                label: t(`${translationPath}member-type`),
                input: 'member_type',
              },
              {
                id: 5,
                label: t(`${translationPath}has-access`),
                input: 'has_access',
                component: (row) =>
                  `${row.has_access} ${t(`${translationPath}entities`)}`,
              },
            ]}
            data={providers.results}
            isLoading={
              isLoading
              //  ||isLoadingColumns
            }
            // headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={providers.totalCount}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: AgencyPermissions.DeleteAgency.key,
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  providers.results.filter((item) => item.can_delete !== false), // check later
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
              SystemActionsEnum.view,
              SystemActionsEnum.edit,
              SystemActionsEnum.delete,
            ]}
            tableActionsOptions={{
              getTooltipTitle: ({ row, actionEnum }) =>
                (actionEnum.key === SystemActionsEnum.delete.key
                  && row.can_delete === false
                  && t('Shared:can-delete-description'))
                || '',
              getDisabledAction: (row, rowIndex, action) => {
                if (action.key === SystemActionsEnum.edit.key)
                  return !getIsAllowedPermissionV2({
                    permissionId: AgencyPermissions.UpdateAgency.key,
                    permissions: permissionsReducer,
                  });
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: AgencyPermissions.DeleteAgency.key,
                      permissions: permissionsReducer,
                    })
                  );
                if (action.key === SystemActionsEnum.view.key)
                  return (
                    !row.user_uuid
                    || !getIsAllowedPermissionV2({
                      permissionId: AgencyPermissions.ViewAgency.key,
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
      {isOpenProfileDialog && (
        <DialogComponent
          maxWidth="md"
          titleText={`view-${userType}`}
          dialogContent={
            <ProviderProfilePage
              activeItem={activeItem}
              source="providers"
              userType={userType}
            />
          }
          isOpen={isOpenProfileDialog}
          onCloseClicked={() => setIsOpenProfileDialog(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenManagementDialog && (
        <ProviderManagementDialog
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          isOpenChanged={isOpenManagementDialogChanged}
          isOpen={isOpenManagementDialog}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          userType={userType}
        />
      )}
      {isOpenPermissionsDialog && (
        <PermissionsManagementDialog
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          singleKey="provider"
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
          deleteApi={DeleteSetupsProvider}
          successMessage="provider-deleted-successfully"
          descriptionMessage="provider-delete-description"
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]), // change when bulk is added to array
          }}
          apiDeleteKey="uuid"
          activeItemKey="uuid"
          isOpen={isOpenDeleteDialog}
          errorMessage="provider-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {openedRatingDrawer && (
        <ProviderRatingDrawer
          openedRatingDrawer={openedRatingDrawer}
          setOpenedRatingDrawer={setOpenedRatingDrawer}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          activeProvider={activeItem}
          userType={userType}
          setActiveItem={setActiveItem}
        />
      )}
    </div>
  );
};

export default ProvidersTab;

ProvidersTab.propTypes = {
  userType: PropTypes.oneOf(['agency', 'university']).isRequired,
};

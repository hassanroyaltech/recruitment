import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { ProviderMemberManagementDialog } from './dialogs';
import { DeleteProviderMember, GetAllProviderMembers } from 'services';
import {
  showError,
  GlobalSecondaryDateFormat,
  getIsAllowedPermissionV2,
  globalSelectedRowsHandler,
  globalSelectedRowHandler,
} from 'helpers';
import { SystemActionsEnum, TablesNameEnum } from 'enums';
import { ConfirmDeleteDialog } from 'pages/setups/shared';
import { TableColumnsPopoverComponent, DialogComponent } from 'components';
import TablesComponent from 'components/Tables/Tables.Component';
import { UsersPermissions } from 'permissions';
import { PermissionsManagementDialog } from 'pages/setups/administration-setups/permissions/dialogs';
import ProviderProfilePage from '../profile/Profile.Page';

const translationPath = 'ProviderMemberPage.';
const parentTranslationPath = 'ProviderPage';

const ProviderMembersPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenPermissionsDialog, setIsOpenPermissionsDialog] = useState(false);
  const [isOpenProfileDialog, setIsOpenProfileDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((state) => state?.userReducer);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    // search: '',
    // status: false,
    use_for: 'list',
    order_by: undefined,
    order_type: undefined,
  });

  const getAllProviderMembers = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllProviderMembers({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setMembers({
        results: response.data?.results,
        totalCount: response.data?.paginate?.total,
      });
    else {
      setMembers({
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
    if (action.key === SystemActionsEnum.view.key) setIsOpenProfileDialog(true);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
    else if (action.key === SystemActionsEnum.permissions.key)
      setIsOpenPermissionsDialog(true);
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const onColumnsChanged = useCallback((newValue) => {
    const birthDataIndex = newValue.findIndex((item) => item.input === 'birth_date');
    const localNewValue = [...newValue];

    if (birthDataIndex !== -1)
      localNewValue[birthDataIndex].dateFormat = GlobalSecondaryDateFormat;

    setTableColumns(localNewValue);
  }, []);

  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setMembers((items) => {
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

  const isOpenManagementDialogChanged = useCallback(() => {
    setIsOpenManagementDialog(false);
    if (activeItem) setActiveItem(null);
  }, [activeItem]);

  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  useEffect(() => {
    getAllProviderMembers();
  }, [getAllProviderMembers, filter]);

  return (
    <div className="provider-members-page tab-wrapper m-4">
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="page-header-wrapper px-3 pb-3">
            <span className="header-text-x2 d-flex mb-1">
              {t(`${translationPath}members`)}
            </span>
            <span className="description-text">
              {t(`${translationPath}members-description`)}
            </span>
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
                feature_name={TablesNameEnum.Employees.key} // TODO: change to Members later
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
              />
            </div> */}
            <ButtonBase
              onClick={() => {
                setIsOpenManagementDialog(true);
              }}
              className="btns theme-solid mx-3 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}invite-member`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            data={members.results}
            isLoading={isLoading || isLoadingColumns}
            // headerData={tableColumns}
            headerData={[
              {
                id: 1,
                label: t(`${translationPath}first-name`),
                input: 'first_name',
              },
              {
                id: 2,
                label: t(`${translationPath}last-name`),
                input: 'last_name',
              },
              {
                id: 3,
                label: t(`${translationPath}email`),
                input: 'email',
              },
              {
                id: 4,
                label: t(`${translationPath}member-type`),
                input: 'member_type',
              },
            ]}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={members.totalCount}
            selectedRows={selectedRows}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: UsersPermissions.DeleteUsers.key, // change later
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  members.results.filter((item) => item.can_delete !== false),
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
                if (action.key === SystemActionsEnum.edit.key) return false;
                // return !getIsAllowedPermissionV2({
                //   permissionId: UsersPermissions.UpdateUsers.key, //change later
                //   permissions: permissionsReducer,
                // });
                if (action.key === SystemActionsEnum.delete.key) return false;
                // return (
                //   row.can_delete === false
                //   || !getIsAllowedPermissionV2({
                //     permissionId: UsersPermissions.DeleteUsers.key, //change later
                //     permissions: permissionsReducer,
                //   })
                // );
                if (action.key === SystemActionsEnum.view.key)
                  return !row.user_uuid;
                  // || !getIsAllowedPermissionV2({
                  //   permissionId: UsersPermissions.ViewUsers.key, //change later
                  //   permissions: permissionsReducer,
                  // })
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
          titleText="view-member"
          dialogContent={
            <ProviderProfilePage activeItem={activeItem} source="members" />
          }
          isOpen={isOpenProfileDialog}
          onCloseClicked={() => setIsOpenProfileDialog(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenManagementDialog && (
        <ProviderMemberManagementDialog
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
      {isOpenPermissionsDialog && (
        <PermissionsManagementDialog
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          singleKey="member"
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
          deleteApi={DeleteProviderMember}
          successMessage="provider-member-deleted-successfully"
          descriptionMessage="provider-member-delete-description"
          apiProps={{
            member_uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && activeItem.uuid), // change when bulk is added to array
          }}
          apiDeleteKey="uuid"
          activeItemKey="uuid"
          isOpen={isOpenDeleteDialog}
          errorMessage="provider-member-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default ProviderMembersPage;

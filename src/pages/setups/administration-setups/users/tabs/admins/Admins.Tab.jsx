import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { SharedAutocompleteControl, SharedInputControl } from '../../../../shared';
import {
  showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  getIsAllowedPermissionV2,
} from '../../../../../../helpers';
import { GetAllSetupsUsers } from '../../../../../../services';
import {
  PopoverComponent,
  TableColumnsPopoverComponent,
} from '../../../../../../components';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import {
  SetupsUsersTypesEnums,
  SystemActionsEnum,
  TablesNameEnum,
  UsersVerificationStatusesEnum,
} from '../../../../../../enums';
import { UsersPermissions } from '../../../../../../permissions';

const AdminsTab = ({
  filter,
  onAddClicked,
  selectedRows,
  onActionClicked,
  onFilterChanged,
  translationPath,
  parentTranslationPath,
  onIsBulkDeleteChanged,
  onSelectedRowsChanged,
  onIsOpenDeleteDialogChanged,
  sendReminder,
  isLoadingReminder,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [usersVerificationStatusesEnum] = useState(() =>
    Object.values(UsersVerificationStatusesEnum),
  );
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const isMounted = useRef(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  // const [selectedUsers, setSelectedUsers] = useState([]);
  // const [isCheckBoxLoading, setIsCheckBoxLoading] = useState(false);
  const [admins, setAdmins] = useState(() => ({
    results: [],
    totalCount: 0,
  }));

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all admins with filter
   */
  const getAllSetupsAdmins = useCallback(
    async (hasLoading) => {
      if (!hasLoading) setIsLoading(true);
      const response = await GetAllSetupsUsers({
        ...filter,
        user_type: SetupsUsersTypesEnums.Admins.key,
      });
      if (!isMounted.current) return;
      if (!hasLoading) setIsLoading(false);
      if (response && response.status === 200)
        // setSelectedUsers(response.data.results
        //   .filter((item) => item.is_cc)?.map((item) => item.uuid));
        setAdmins({
          results: response.data.results,
          totalCount: response.data.paginate.total,
        });
      else {
        setAdmins({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), response);
        if (!hasLoading) setIsLoading(false);
      }
    },
    [filter, t],
  );

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
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the is cc status for a user
   */
  // const carbonCopyUsersHandler = useCallback(async (uuid) => {
  //   if ((selectedUsers && selectedUsers.length > 0) || uuid) {
  //     setIsCheckBoxLoading(true);
  //     const result = await SetCarbonCopyUsers({ uuid });
  //
  //     if (result && result.status === 202) {
  //       getAllSetupsAdmins(true);
  //       showSuccess(t(`${translationPath}users-updated-successfully`));
  //       setIsCheckBoxLoading(false);
  //     } else {
  //       setIsCheckBoxLoading(false);
  //       if (result && result.data && result.data.errors)
  //         showError(Object.values(result.data.errors)
  //           .map((item, index) => <div key={`${index + 1}-error`}>{`- ${item}`}</div>));
  //       else if (result && result.data && result.data.message)
  //         showError(result.data.message);
  //     }
  //   }
  // }, [getAllSetupsAdmins, selectedUsers, t, translationPath]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change selected columns
   * (must be callback)
   */
  const onColumnsChanged = useCallback((newValue) => {
    // if (newValue && !newValue.find((item) => item.input === 'is_cc'))
    //   newValue.push({
    //     input: 'is_cc',
    //     label: t(`${translationPath}carbon-copy`),
    //     isHidden: false,
    //     component: (row) => (
    //       <CheckboxesComponent
    //         isLoading={isCheckBoxLoading}
    //         isDisabled={isCheckBoxLoading}
    //         idRef={`cc-checkbox-label-${row.uuid + 1}`}
    //         singleChecked={row.is_cc || selectedUsers.find((el) => el === row.uuid)}
    //         onSelectedCheckboxChanged={() => {
    //           setSelectedUsers((items) => {
    //             const userIndex = items.findIndex((el) => el === row.uuid);
    //             if (userIndex !== -1) items.splice(userIndex, 1);
    //             else items.push(row.uuid);
    //             return [...items];
    //           });
    //           carbonCopyUsersHandler(row.uuid);
    //         }}
    //       />
    //     ),
    //   });

    setTableColumns(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setAdmins((items) => {
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
    getAllSetupsAdmins();
  }, [getAllSetupsAdmins, filter]);

  // this is to prevent any memory leak if user changed tab fast
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  const filterSelectedItems = useCallback(
    ({ key, value }) => {
      if (key === 'can_delete')
        return (selectedRows || []).filter((item) => item.can_delete !== false);
      else return (selectedRows || []).filter((item) => item[key] === value);
    },
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
        ].includes(item.status),
      ),
    [selectedRows],
  );

  return (
    <div className="admins-page tab-wrapper">
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
                {forDeleteArray?.length > 0 && (
                  <ButtonBase
                    className="btns-icon theme-transparent c-warning"
                    onClick={() => {
                      onIsBulkDeleteChanged(true);
                      onIsOpenDeleteDialogChanged(true);
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
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                feature_name={TablesNameEnum.Admins.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
              />
            </div>
            <ButtonBase
              onClick={() => {
                if (onAddClicked) onAddClicked(SetupsUsersTypesEnums.Admins);
              }}
              className="btns theme-solid mx-3 mb-2"
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-admin`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="d-flex-v-center-h-end">
          <SharedAutocompleteControl
            title="verification-status"
            stateKey="status"
            placeholder="select-verification-status"
            editValue={filter?.status || ''}
            isDisabled={isLoading}
            onValueChanged={({ value }) => {
              onFilterChanged({ ...filter, page: 1, status: value });
            }}
            initValues={usersVerificationStatusesEnum}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) => t(`${option.title}`)}
          />
        </div>
        <div className="px-2">
          <TablesComponent
            isWithCheck
            isDynamicDate
            isWithCheckAll
            isWithTableActions
            data={admins.results}
            uniqueKeyInput="uuid"
            pageSize={filter.limit}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            selectedRows={selectedRows}
            totalItems={admins.totalCount}
            onPageSizeChanged={onPageSizeChanged}
            onPageIndexChanged={onPageIndexChanged}
            onSelectAllCheckboxChanged={() => {
              onSelectedRowsChanged(
                globalSelectedRowsHandler(
                  selectedRows,
                  admins.results.filter(
                    (item) =>
                      item.can_delete !== false
                      || [
                        UsersVerificationStatusesEnum.Pending.value,
                        UsersVerificationStatusesEnum.Expired.value,
                      ].includes(item.status),
                  ),
                ),
              );
            }}
            isLoading={isLoading || isLoadingColumns || isLoadingReminder}
            onSelectCheckboxChanged={({ selectedRow }) => {
              if (!selectedRow) return;
              onSelectedRowsChanged(
                globalSelectedRowHandler(selectedRows, selectedRow),
              );
            }}
            onActionClicked={onActionClicked(SetupsUsersTypesEnums.Admins)}
            tableActions={[
              // SystemActionsEnum.permissions,
              // SystemActionsEnum.userInfo,
              SystemActionsEnum.edit,
              SystemActionsEnum.reminder,
              SystemActionsEnum.delete,
            ]}
            isSelectAllDisabled={
              !getIsAllowedPermissionV2({
                permissionId: UsersPermissions.DeleteUsers.key,
                permissions: permissionsReducer,
              })
            }
            getIsDisabledRow={(row) =>
              row.can_delete === false
              && ![
                UsersVerificationStatusesEnum.Pending.value,
                UsersVerificationStatusesEnum.Expired.value,
              ].includes(row.status)
            }
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
                if (action.key === SystemActionsEnum.reminder.key)
                  return ![
                    UsersVerificationStatusesEnum.Pending.value,
                    UsersVerificationStatusesEnum.Expired.value,
                  ].includes(row.status);
                if (action.key === SystemActionsEnum.delete.key)
                  return (
                    row.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: UsersPermissions.DeleteUsers.key,
                      permissions: permissionsReducer,
                    })
                  );
                return true;
              },
            }}
          />
        </div>
      </div>
      {
        <PopoverComponent
          idRef="adminsActionsPopoverRef"
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

AdminsTab.propTypes = {
  filter: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    search: PropTypes.string,
    status: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  }).isRequired,
  onAddClicked: PropTypes.func.isRequired,
  sendReminder: PropTypes.func.isRequired,
  onActionClicked: PropTypes.func.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  onSelectedRowsChanged: PropTypes.func.isRequired,
  onIsBulkDeleteChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  selectedRows: PropTypes.instanceOf(Array).isRequired,
  onIsOpenDeleteDialogChanged: PropTypes.func.isRequired,
  isLoadingReminder: PropTypes.bool,
};

export default AdminsTab;

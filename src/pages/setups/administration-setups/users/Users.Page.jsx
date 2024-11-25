import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsComponent } from '../../../../components';
import { ConfirmDeleteDialog } from '../../shared';
import { UsersTabs } from '../../shared/tabs-data';
import { DeleteSetupsUser, SendReminderSetupsUser } from '../../../../services';
import { SystemActionsEnum } from '../../../../enums';
import { UsersManagementDialog } from './dialogs';
import { showError, showSuccess } from '../../../../helpers';

const translationPath = 'UsersPage.';
const parentTranslationPath = 'SetupsPage';

const UsersPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [adminsTabsData] = useState(() => UsersTabs);
  const [activeItem, setActiveItem] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoadingReminder, setIsLoadingReminder] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: false,
    use_for: 'list',
  });

  /**
   * @param currentUserType
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */

  const sendReminder = useCallback(
    async (items) => {
      const localeItems = { user_uuid: items.map((item) => item.uuid) };
      setIsLoadingReminder(true);
      try {
        const response = await SendReminderSetupsUser(localeItems);
        setIsLoadingReminder(false);
        if (response?.status === 200 || response?.status === 201) {
          showSuccess(t('reminder-sent-successfully'));
          if (items?.length > 0) onSelectedRowsChanged([]);
          setFilter((items) => ({ ...items }));
        } else showError(t('failed-to-send-reminder'), response);
      } catch (error) {
        setIsLoadingReminder(false);
        showError(t('failed-to-send-reminder'), error);
      }
    },
    [t],
  );

  const onActionClicked = (currentUserType) => (action, row) => {
    setUserType(currentUserType);
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
    else if (action.key === SystemActionsEnum.reminder.key) sendReminder([row]);
  };

  /**
   * @param currentUserType
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onAddClicked = (currentUserType) => {
    setUserType(currentUserType);
    setIsOpenManagementDialog(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change filter from child
   */
  const onFilterChanged = useCallback((newValue) => {
    setFilter(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change selected rows from child
   */
  const onSelectedRowsChanged = (newValue) => {
    setSelectedRows(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is open delete dialog from child
   */
  const onIsOpenDeleteDialogChanged = (newValue) => {
    setIsOpenDeleteDialog(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is bulk delete from child
   */
  const onIsBulkDeleteChanged = (newValue) => {
    setIsBulkDelete(newValue);
  };

  return (
    <div className="users-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">{t('users')}</span>
        <span className="description-text">
          {t(`${translationPath}users-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="usersTabsRef"
          data={adminsTabsData}
          currentTab={activeTab}
          translationPath={translationPath}
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
          }}
          parentTranslationPath={parentTranslationPath}
          dynamicComponentProps={{
            filter,
            onActionClicked,
            onFilterChanged,
            onAddClicked,
            selectedRows,
            onSelectedRowsChanged,
            onIsOpenDeleteDialogChanged,
            onIsBulkDeleteChanged,
            parentTranslationPath,
            translationPath,
            sendReminder,
            isLoadingReminder,
          }}
        />
      </div>
      {userType && (
        <UsersManagementDialog
          userType={userType}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          activeItem={activeItem}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            if (userType) setUserType(null);
            if (activeItem) setActiveItem(null);
          }}
          isOpen={isOpenManagementDialog}
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
            setUserType(null);
            if (isBulkDelete) {
              setIsBulkDelete(false);
              setSelectedRows([]);
            }
          }}
          deleteApi={DeleteSetupsUser}
          successMessage="user-deleted-successfully"
          descriptionMessage="user-delete-description"
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
          errorMessage="user-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default UsersPage;

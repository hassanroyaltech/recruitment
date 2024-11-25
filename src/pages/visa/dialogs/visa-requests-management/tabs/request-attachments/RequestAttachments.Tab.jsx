import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import { SystemActionsEnum } from '../../../../../../enums';
import { VisaAttachmentsDialog } from '../../../visa-attachments/VisaAttachments.Dialog';
import { ButtonBase } from '@mui/material';
import { getIsAllowedPermissionV2 } from '../../../../../../helpers';
import { useSelector } from 'react-redux';
import { EvaRecManageVisaPermissions } from '../../../../../../permissions/eva-rec/EvaRecManageVisa.Permissions';
import { ManageVisasPermissions } from '../../../../../../permissions';

export const RequestAttachmentsTab = ({
  state,
  onStateChanged,
  isLoading,
  getIsDisabledFieldsOrActions,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    visaAttachmentsManagement: false,
  });
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [activeItem, setActiveItem] = useState(null);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const [tableColumns] = useState([
    {
      id: 1,
      isSortable: false,
      // label: '#',
      isCounter: true,
      isSticky: true,
    },
    {
      id: 2,
      isSortable: false,
      component: (row) => <span>{row.name}</span>,
      isSticky: false,
    },
    {
      id: 3,
      isSortable: false,
      component: (row) => <span>{row.type}</span>,
      isSticky: false,
    },
    {
      id: 4,
      isSortable: false,
      component: (row) => <span>{row.file_size}</span>,
      isSticky: false,
    },
    {
      id: 5,
      isSortable: false,
      component: (row) => <span>{row.comment}</span>,
      isSticky: false,
    },
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page and send it to parent
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size and send it to parent
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @param actionKey - string same as the attribute name
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle open or close the dialogs in the page
   */
  const dialogsStatusHandler = useCallback(
    (actionKey, isClosed = false) =>
      () => {
        if (isClosed) setActiveItem((item) => (item ? null : item));

        setIsOpenDialogs((items) => ({ ...items, [actionKey]: !items[actionKey] }));
      },
    [],
  );

  /**
   * @param action
   * @param row
   * @param rowIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row, rowIndex) => {
    if (action.key === SystemActionsEnum.edit.key) {
      setActiveItem({ ...row });
      dialogsStatusHandler('visaAttachmentsManagement')();
    } else if (action.key === SystemActionsEnum.delete.key) {
      const localState = { ...state };
      if (rowIndex !== -1) {
        localState.attachments.splice(rowIndex, 1);
        localState.attachmentsDetails.splice(rowIndex, 1);
        onStateChanged({ id: 'edit', value: localState });
      }
    } else if (action.key === SystemActionsEnum.download.key) {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.download = row.fileName || row.name;
      link.href = row.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="request-details-tab-wrapper tab-wrapper">
      <div className="mb-3">
        <span>{t(`${translationPath}attached-files`)}</span>
        <span className="px-1 c-gray-primary">
          <span>&bull;</span>
          <span className="px-1">{state.attachments.length}</span>
        </span>
      </div>
      {state.attachmentsDetails.length === 0 && (
        <div className="description-text mb-3">
          <span>{t(`${translationPath}no-attached-files`)}</span>
        </div>
      )}
      <TablesComponent
        data={state.attachmentsDetails}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        totalItems={state.attachmentsDetails.length}
        isDynamicDate
        uniqueKeyInput="uuid"
        wrapperClasses="px-0"
        getIsDisabledRow={(row) => row.can_delete === false}
        isWithTableActions
        isPopoverActions
        isWithoutTableHeader
        onActionClicked={onActionClicked}
        tableActions={[
          SystemActionsEnum.edit,
          SystemActionsEnum.delete,
          SystemActionsEnum.download,
        ]}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isWithoutBoxWrapper
        themeClasses="theme-transparent"
        tableActionsOptions={{
          getTooltipTitle: ({ row, actionEnum }) =>
            (actionEnum.key === SystemActionsEnum.delete.key
              && row.can_delete === false
              && t('Shared:can-delete-description'))
            || '',
          getDisabledAction: (item, rowIndex, actionEnum) =>
            (getIsDisabledFieldsOrActions()
              && SystemActionsEnum.download.key !== actionEnum.key)
            || (actionEnum.key === SystemActionsEnum.delete.key
              && item.can_delete === false),
        }}
      />
      <ButtonBase
        className="btns theme-transparent mx-0 mt-3"
        disabled={
          isLoading
          || getIsDisabledFieldsOrActions()
          || !getIsAllowedPermissionV2({
            permissions,
            defaultPermissions: {
              UploadAttachments: ManageVisasPermissions.UploadAttachments,
              UploadAttachmentsEvarec: EvaRecManageVisaPermissions.UploadAttachments,
            },
          })
        }
        onClick={dialogsStatusHandler('visaAttachmentsManagement')}
      >
        <span className="fas fa-plus" />
        <span className="px-1">{t(`${translationPath}upload-a-file`)}</span>
      </ButtonBase>
      {isOpenDialogs.visaAttachmentsManagement && (
        <VisaAttachmentsDialog
          activeItem={activeItem}
          comment={(activeItem && activeItem.comment) || undefined}
          isOpen={isOpenDialogs.visaAttachmentsManagement}
          onSave={({ attachment, comment }) => {
            const localState = { ...state };
            if (activeItem) {
              const attachmentIndex = localState.attachments.findIndex(
                (item) => item.uuid === activeItem.uuid,
              );
              const attachmentDetailsIndex = localState.attachmentsDetails.findIndex(
                (item) => item.uuid === activeItem.uuid,
              );

              localState.attachments[attachmentIndex] = {
                uuid: attachment.uuid,
                comment,
              };
              localState.attachmentsDetails[attachmentDetailsIndex] = {
                ...attachment,
                comment,
              };
            } else {
              localState.attachments.push({ uuid: attachment.uuid, comment });
              localState.attachmentsDetails.push({ ...attachment, comment });
            }
            onStateChanged({ id: 'edit', value: localState });
          }}
          translationPath={translationPath}
          isOpenChanged={dialogsStatusHandler('visaAttachmentsManagement', true)}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

RequestAttachmentsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  getIsDisabledFieldsOrActions: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

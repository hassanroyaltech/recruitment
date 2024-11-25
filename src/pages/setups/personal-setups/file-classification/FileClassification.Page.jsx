import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { FileClassificationsTabs } from '../../shared/tabs-data';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { FileClassificationPermissions } from '../../../../permissions';

const translationPath = 'FileClassification.';
const parentTranslationPath = 'SetupsPage';

const FileClassificationPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [classificationsTabsData] = useState(() => FileClassificationsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'file-classification-updated-successfully',
    createSuccessMessage: 'file-classification-created-successfully',
    updateFailedMessage: 'file-classification-update-failed',
    createFailedMessage: 'file-classification-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'file-classification-deleted-successfully',
    descriptionMessage: 'file-classification-delete-description',
    errorMessage: 'file-classification-delete-failed',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change filter from child
   */
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };

  return (
    <div className="users-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}file-classification`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}file-classification-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="fileClassificationsTabsRef"
          currentTab={activeTab}
          data={classificationsTabsData}
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
            setFilter((items) => (items.page === 1 ? items : { ...items, page: 1 }));
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          dynamicComponentProps={{
            filter,
            onFilterChanged,
            parentTranslationPath,
            translationPath,
            isDisabledDelete: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                FileClassificationPermissions.DeleteFileClassification.key,
            }),
            isDisabledAdd: !getIsAllowedPermissionV2({
              permissions,
              permissionId: FileClassificationPermissions.AddFileClassification.key,
            }),
            isDisabledUpdate: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                FileClassificationPermissions.UpdateFileClassification.key,
            }),
            updateSuccessMessage:
              managementDialogMessagesRef.current.updateSuccessMessage,
            updateFailedMessage:
              managementDialogMessagesRef.current.updateFailedMessage,
            createSuccessMessage:
              managementDialogMessagesRef.current.createSuccessMessage,
            createFailedMessage:
              managementDialogMessagesRef.current.createFailedMessage,
            successMessage: deleteDialogMessagesRef.current.successMessage,
            descriptionMessage: deleteDialogMessagesRef.current.descriptionMessage,
            errorMessage: deleteDialogMessagesRef.current.errorMessage,
          }}
        />
      </div>
    </div>
  );
};

export default FileClassificationPage;

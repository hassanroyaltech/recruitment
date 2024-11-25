import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { WorkClassificationsTabs } from '../../shared/tabs-data';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { WorkClassificationPermissions } from '../../../../permissions';

const translationPath = 'WorkClassificationPage.';
const parentTranslationPath = 'SetupsPage';

const WorkClassificationPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [classificationsTabsData] = useState(() => WorkClassificationsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'Work-classification-updated-successfully',
    createSuccessMessage: 'Work-classification-created-successfully',
    updateFailedMessage: 'Work-classification-update-failed',
    createFailedMessage: 'Work-classification-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'work-classification-deleted-successfully',
    descriptionMessage: 'work-classification-delete-description',
    errorMessage: 'work-classification-delete-failed',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: null,
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
          {t(`${translationPath}work-classification`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}work-classification-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="workClassificationsTabsRef"
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
                WorkClassificationPermissions.DeleteWorkClassification.key,
            }),
            isDisabledAdd: !getIsAllowedPermissionV2({
              permissions,
              permissionId: WorkClassificationPermissions.AddWorkClassification.key,
            }),
            isDisabledUpdate: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                WorkClassificationPermissions.UpdateWorkClassification.key,
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

export default WorkClassificationPage;

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { EducationClassificationsTabs } from '../../shared/tabs-data';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { EducationPermissions } from '../../../../permissions';

const translationPath = 'EducationClassificationPage.';
const parentTranslationPath = 'SetupsPage';

const EducationClassificationPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [classificationsTabsData] = useState(() => EducationClassificationsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'education-classification-updated-successfully',
    createSuccessMessage: 'education-classification-created-successfully',
    updateFailedMessage: 'education-classification-update-failed',
    createFailedMessage: 'education-classification-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'education-classification-deleted-successfully',
    descriptionMessage: 'education-classification-delete-description',
    errorMessage: 'education-classification-delete-failed',
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
    <div className="education-classification-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}education-classification`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}education-classification-setup-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="educationClassificationTabsRef"
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
              permissionId: EducationPermissions.DeleteWorkEducation.key,
            }),
            isDisabledAdd: !getIsAllowedPermissionV2({
              permissions,
              permissionId: EducationPermissions.AddWorkEducation.key,
            }),
            isDisabledUpdate: !getIsAllowedPermissionV2({
              permissions,
              permissionId: EducationPermissions.UpdateWorkEducation.key,
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

export default EducationClassificationPage;

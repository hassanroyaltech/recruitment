import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { CandidatePropertiesTabs } from '../../shared/tabs-data';
// import { getIsAllowedPermissionV2 } from '../../../../helpers';
// import { CandidatePropertiesPermissions } from '../../../../permissions';

const translationPath = 'CandidateProperties.';
const parentTranslationPath = 'SetupsPage';

const CandidatePropertiesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [classificationsTabsData] = useState(() => CandidatePropertiesTabs);
  // const permissions = useSelector(
  //   (reducerState) => reducerState?.permissionsReducer?.permissions,
  // );
  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'candidate-properties-updated-successfully',
    createSuccessMessage: 'candidate-properties-created-successfully',
    updateFailedMessage: 'candidate-properties-update-failed',
    createFailedMessage: 'candidate-properties-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'candidate-properties-deleted-successfully',
    descriptionMessage: 'candidate-properties-delete-description',
    errorMessage: 'candidate-properties-delete-failed',
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
          {t(`${translationPath}candidate-properties`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}candidate-properties-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="candidate-propertiesTabsRef"
          currentTab={activeTab}
          data={classificationsTabsData}
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          dynamicComponentProps={{
            filter,
            onFilterChanged,
            parentTranslationPath,
            translationPath,
            // isDisabledDelete: !getIsAllowedPermissionV2({
            //   permissions,
            //   permissionId:
            //     CandidatePropertiesPermissions.DeleteCandidateProperties.key, // change later
            // }),
            // isDisabledAdd: !getIsAllowedPermissionV2({
            //   permissions,
            //   permissionId:
            //     CandidatePropertiesPermissions.AddCandidateProperties.key, // change later
            // }),
            // isDisabledUpdate: !getIsAllowedPermissionV2({
            //   permissions,
            //   permissionId:
            //     CandidatePropertiesPermissions.UpdateCandidateProperties.key, // change later
            // }),
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

export default CandidatePropertiesPage;

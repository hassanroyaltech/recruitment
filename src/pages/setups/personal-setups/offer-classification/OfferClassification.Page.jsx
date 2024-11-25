import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { OfferClassificationsTabs } from '../../shared/tabs-data';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { OfferClassificationPermissions } from '../../../../permissions';

const translationPath = 'OfferClassification.';
const parentTranslationPath = 'SetupsPage';

const OfferClassificationPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [classificationsTabsData] = useState(() => OfferClassificationsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'offer-classification-updated-successfully',
    createSuccessMessage: 'offer-classification-created-successfully',
    updateFailedMessage: 'offer-classification-update-failed',
    createFailedMessage: 'offer-classification-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'offer-classification-deleted-successfully',
    descriptionMessage: 'offer-classification-delete-description',
    errorMessage: 'offer-classification-delete-failed',
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
          {t(`${translationPath}offer-classification`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}offer-classification-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="OfferClassificationsTabsRef"
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
                OfferClassificationPermissions.DeleteOfferClassification.key,
            }),
            isDisabledAdd: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                OfferClassificationPermissions.AddOfferClassification.key,
            }),
            isDisabledUpdate: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                OfferClassificationPermissions.UpdateOfferClassification.key,
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

export default OfferClassificationPage;

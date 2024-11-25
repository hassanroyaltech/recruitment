import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsComponent } from '../../../components';
import { VisaLookupsTabs } from './tabs/Visa-Lookups.Tab';
import { getIsAllowedPermissionV2 } from '../../../helpers';
import { useSelector } from 'react-redux';
import { VisasLookupPermissions } from '../../../permissions/visas/VisasLookup.Permissions';

const translationPath = 'VisaLookupsPage.';
const parentTranslationPath = 'VisaPage';

const VisaLookupsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [LookupsTabsData] = useState(() => VisaLookupsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'visa-lookups-updated-successfully',
    createSuccessMessage: 'visa-lookups-created-successfully',
    updateFailedMessage: 'visa-lookups-update-failed',
    createFailedMessage: 'visa-lookups-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'visa-lookups-deleted-successfully',
    descriptionMessage: 'visa-lookups-delete-description',
    errorMessage: 'visa-lookups-delete-failed',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: null,
    status: null,
    use_for: 'list',
  });

  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}visa-lookups`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}visa-lookups-setup-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="visaLookupsTabsRef"
          currentTab={activeTab}
          data={LookupsTabsData}
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
            isDisabledDelete: !getIsAllowedPermissionV2({
              permissions,
              permissionId: VisasLookupPermissions.DeleteLookup.key,
            }),
            isDisabledAdd: !getIsAllowedPermissionV2({
              permissions,
              permissionId: VisasLookupPermissions.CreateLookup.key,
            }),
            isDisabledUpdate: !getIsAllowedPermissionV2({
              permissions,
              permissionId: VisasLookupPermissions.UpdateLookup.key,
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

export default VisaLookupsPage;

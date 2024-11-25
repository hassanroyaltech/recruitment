import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { getIsAllowedPermissionV2, showError } from '../../../../helpers';
import { OfferClassificationPermissions } from '../../../../permissions';
import { GetAllSetupsDynamicLookups } from 'services';
import LookupsComponent from 'pages/setups/shared/components/lookups/Lookups.Component';
import i18next from 'i18next';

const translationPath = 'ListDynamicLookupsPage.';
const parentTranslationPath = 'SetupsPage';

const ListDynamicLookupsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [dynamicLookupsTabs, setDynamicLookupsTabs] = useState([]);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'lookup-item-updated-successfully',
    createSuccessMessage: 'lookup-item-created-successfully',
    updateFailedMessage: 'lookup-item-update-failed',
    createFailedMessage: 'lookup-item-create-failed',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'lookup-item-deleted-successfully',
    descriptionMessage: 'lookup-item-delete-description',
    errorMessage: 'lookup-item-delete-failed',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    // status: false,
    use_for: 'list',
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change filter from child
   */
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };

  const GetDynamicLookupsTabs = useCallback(async () => {
    const res = await GetAllSetupsDynamicLookups({});
    if (res && res.status === 200) {
      const tabsData = res.data.results.map((item) => ({
        label: item.name?.[i18next.language] || item.name?.en,
        component: LookupsComponent,
        props: {
          lookup: {
            key: item.uuid,
            label: 'label',
            titleText: item.name?.[i18next.language] || item.name?.en,
            valueSingle: 'lookup-item',
            feature_name: 'dynamic_lookup',
            path: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}/service/dynamic/lookups`,
            dynamic_code: item.code,
            queryText: 'query',
          },
        },
      }));
      setDynamicLookupsTabs(tabsData);
    } else showError(t('Shared:failed-to-get-saved-data'), res);
  }, [t]);

  useEffect(() => {
    GetDynamicLookupsTabs();
  }, [GetDynamicLookupsTabs]);

  return (
    <div className="users-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}dynamic-lookups`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}dynamic-lookups-description`)}
        </span>
      </div>
      {dynamicLookupsTabs.length > 0 && (
        <div className="page-body-wrapper">
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            idRef="OfferClassificationsTabsRef"
            currentTab={activeTab}
            data={dynamicLookupsTabs}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            translationPath=""
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
              isDynamicService: true,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ListDynamicLookupsPage;

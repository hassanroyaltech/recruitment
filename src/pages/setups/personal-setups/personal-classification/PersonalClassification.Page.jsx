import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { PersonalClassificationsTabs } from '../../shared/tabs-data';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { PersonalClassificationPermissions } from '../../../../permissions';

const translationPath = 'PersonalClassification.';
const parentTranslationPath = 'SetupsPage';

const PersonalClassificationPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [classificationsTabsData] = useState(() => PersonalClassificationsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
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
          {t(`${translationPath}personal-classification`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}personal-classification-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="personalClassificationsTabsRef"
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
                PersonalClassificationPermissions.DeletePersonalClassification.key,
            }),
            isDisabledAdd: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                PersonalClassificationPermissions.AddPersonalClassification.key,
            }),
            isDisabledUpdate: !getIsAllowedPermissionV2({
              permissions,
              permissionId:
                PersonalClassificationPermissions.UpdatePersonalClassification.key,
            }),
          }}
        />
      </div>
    </div>
  );
};

export default PersonalClassificationPage;

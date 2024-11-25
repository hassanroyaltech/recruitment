import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogComponent, TabsComponent } from '../../../../components';
import { useTranslation } from 'react-i18next';
import './ActiveIntegrationsSettings.Style.scss';
import { IntegrationsPartnersEnum } from '../../../../enums';

const ActiveIntegrationsSettingsDialog = ({
  activePartner,
  isOpen,
  isOpenChanged,
  getActivePartnerEnum,
  onIntegrationReload,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={`${activePartner.title} ${t(`${translationPath}settings`)}`}
      contentClasses="px-0"
      dialogContent={
        <div className="integrations-settings-management-content-dialog-wrapper">
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            idRef="settingsManagementTabsRef"
            tabsContentClasses="pt-3"
            data={getActivePartnerEnum().settingsManagementTabsData}
            currentTab={activeTab}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              onIntegrationReload,
              isOpenChanged,
              parentTranslationPath,
              translationPath,
            }}
          />
        </div>
      }
      wrapperClasses="integrations-settings-management-dialog-wrapper"
      // isSaving={isLoading}
      isOpen={isOpen}
      saveType="button"
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ActiveIntegrationsSettingsDialog.propTypes = {
  activePartner: PropTypes.shape({
    partner: PropTypes.oneOf(
      Object.values(IntegrationsPartnersEnum).map((item) => item.key),
    ),
    title: PropTypes.string,
    is_connected: PropTypes.bool,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  getActivePartnerEnum: PropTypes.func.isRequired,
  onIntegrationReload: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default ActiveIntegrationsSettingsDialog;

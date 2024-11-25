import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TabsComponent } from '../../../../components';
import { SidebarTabs } from '../../tabs-data/Sidebar.Tabs';
import InfoTab from './tabs/info/Info.Tab';
import { FormsRolesEnum } from '../../../../enums';

export const SidebarSection = ({
  preview,
  isLoadingPDF,
  isGlobalLoading,
  isOpenSideMenu,
  templateData,
  setTemplateData,
  dataSectionItems,
  setDataSectionItems,
  handleAddSection,
  fieldsItems,
  customFields,
  customSections,
  setFieldsItems,
  headerHeight,
  getFilteredRoleTypes,
  getFirstAvailableDefault,
  getCurrentDefaultEnumItem,
  getSelectedRoleEnumItem,
  UpdateDownLoadFilesSenderHandler,
  UpdateDownLoadPDFRecipientHandler,
  isSubmitted,
  errors,
  parentTranslationPath,
  translationPath,
  blocksItems,
  setBlocksItems,
  pdfRef,
  pdfDownLoad,
  isLoading,
  isInitialization,
}) => {
  const [activeTab, setActiveTab] = useState(
    templateData.editorRole === FormsRolesEnum.Creator.key ? 1 : 0,
  );
  const [sidebarTabsData] = useState(() =>
    SidebarTabs.filter(
      (item) =>
        (!item.visibleIfRole
          || item.visibleIfRole.includes(templateData.editorRole))
        && (!item.isHiddenInPreview || !preview.isActive),
    ),
  );

  return (
    <div
      className={`sidebar-section-wrapper${(isOpenSideMenu && ' is-open') || ''}${
        ((getSelectedRoleEnumItem(templateData.editorRole).isRecipientBehaviour
          || (getSelectedRoleEnumItem(preview.role).isRecipientBehaviour
            && preview.isActive))
          && ' is-without-tabs')
        || ''
      }`}
      style={{
        order:
          (getSelectedRoleEnumItem(templateData.editorRole).isRecipientBehaviour
            || (getSelectedRoleEnumItem(preview.role).isRecipientBehaviour
              && preview.isActive))
          && 1,
        top: headerHeight,
        height: `calc(100vh - ${headerHeight}px)`,
        flexWrap: 'nowrap',
        overflowY: 'auto',
      }}
    >
      {getSelectedRoleEnumItem(templateData.editorRole).isRecipientBehaviour
      || (getSelectedRoleEnumItem(preview.role).isRecipientBehaviour
        && preview.isActive) ? (
          <div className="info-wrapper">
            <InfoTab
              templateData={templateData}
              preview={preview}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isLoadingPDF={isLoadingPDF}
              isSubmitted={isSubmitted}
              isGlobalLoading={isGlobalLoading}
              UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
              UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
              pdfRef={pdfRef}
              pdfDownLoad={pdfDownLoad}
              isLoading={isLoading}
              isInitialization={isInitialization}
            />
          </div>
        ) : (
          <div className="panel-items-wrapper">
            <TabsComponent
              isPrimary
              isWithLine
              // labelInput="label"
              themeClasses="theme-icon"
              scrollButtons={false}
              tooltipTitleInput="label"
              iconComponentInput="icon"
              tooltipPlacement="right"
              orientation="vertical"
              idRef="formSidebarTabsRef"
              currentTab={activeTab}
              data={sidebarTabsData}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              dynamicComponentProps={{
                preview,
                dataSectionItems,
                setDataSectionItems,
                templateData,
                setTemplateData,
                setFieldsItems,
                customFields,
                isSubmitted,
                fieldsItems,
                customSections,
                errors,
                isLoadingPDF,
                isGlobalLoading,
                getFilteredRoleTypes,
                handleAddSection,
                getFirstAvailableDefault,
                getCurrentDefaultEnumItem,
                getSelectedRoleEnumItem,
                UpdateDownLoadFilesSenderHandler,
                UpdateDownLoadPDFRecipientHandler,
                parentTranslationPath,
                translationPath,
                blocksItems,
                setBlocksItems,
                pdfRef,
                pdfDownLoad,
                isLoading,
                isInitialization,
              }}
            />
          </div>
        )}
    </div>
  );
};

SidebarSection.propTypes = {
  templateData: PropTypes.instanceOf(Object).isRequired,
  isLoadingPDF: PropTypes.bool.isRequired,
  preview: PropTypes.shape({
    role: PropTypes.oneOf(Object.values(FormsRolesEnum).map((item) => item.key)),
    isActive: PropTypes.bool,
  }).isRequired,
  isOpenSideMenu: PropTypes.bool.isRequired,
  setTemplateData: PropTypes.func.isRequired,
  dataSectionItems: PropTypes.shape({}),
  setDataSectionItems: PropTypes.func.isRequired,
  setFieldsItems: PropTypes.func.isRequired,
  getFilteredRoleTypes: PropTypes.func.isRequired,
  getSelectedRoleEnumItem: PropTypes.func.isRequired,
  getFirstAvailableDefault: PropTypes.func.isRequired,
  getCurrentDefaultEnumItem: PropTypes.func.isRequired,
  handleAddSection: PropTypes.func.isRequired,
  isGlobalLoading: PropTypes.arrayOf(PropTypes.string).isRequired,
  headerHeight: PropTypes.number.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  // this is to make sure that fields like input
  // (default json for each one of the types of other fields (not dropdown and sections like logo))
  fieldsItems: PropTypes.instanceOf(Object).isRequired,
  // this is for the list of key values for dropdowns (the default json for custom dropdowns with its options.)
  customFields: PropTypes.instanceOf(Object).isRequired,
  // this is for the list of key values for dropdowns (the default json for header & logo & footer ...)
  customSections: PropTypes.instanceOf(Object).isRequired,
  UpdateDownLoadFilesSenderHandler: PropTypes.func.isRequired,
  UpdateDownLoadPDFRecipientHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  blocksItems: PropTypes.instanceOf(Object).isRequired,
  setBlocksItems: PropTypes.func.isRequired,
  pdfRef: PropTypes.instanceOf(Object),
  pdfDownLoad: PropTypes.func,
  isLoading: PropTypes.bool,
  isInitialization: PropTypes.bool,
};

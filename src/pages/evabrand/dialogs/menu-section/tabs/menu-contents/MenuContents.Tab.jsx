import React from 'react';
import PropTypes from 'prop-types';
import { ControlsForSectionsShared } from '../../../shared/contols-for-sections';
import { MenuContentsUploaderControl } from './controls';
import './MenuContents.Style.scss';

export const MenuContentsTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
}) => (
  <div className="menu-contents-tab-wrapper tab-wrapper pt-3">
    <ControlsForSectionsShared
      state={state}
      onStateChanged={onStateChanged}
      errors={errors}
      isSubmitted={isSubmitted}
      isWithColorPicker
      isAdvancedMode={isAdvancedMode}
      parentTranslationPath={parentTranslationPath}
    />
    <MenuContentsUploaderControl
      idRef="companyLogoRef"
      mediaItem={
        (state.section_data && state.section_data.company_logo) || undefined
      }
      onValueChanged={onStateChanged}
      isSubmitted={isSubmitted}
      errors={errors}
      parentId="section_data"
      subParentId="company_logo"
      urlStateKey="url"
      uuidStateKey="uuid"
      labelValue="upload-logo"
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
    <MenuContentsUploaderControl
      idRef="companyFaviconRef"
      mediaItem={
        (state.section_data && state.section_data.company_favicon) || undefined
      }
      onValueChanged={onStateChanged}
      isSubmitted={isSubmitted}
      errors={errors}
      parentId="section_data"
      subParentId="company_favicon"
      urlStateKey="url"
      uuidStateKey="uuid"
      labelValue="upload-favicon"
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
    <MenuContentsUploaderControl
      idRef="secondaryLogoRef"
      mediaItem={
        (state.section_data && state.section_data.secondary_logo) || undefined
      }
      onValueChanged={onStateChanged}
      isSubmitted={isSubmitted}
      errors={errors}
      parentId="section_data"
      subParentId="secondary_logo"
      urlStateKey="url"
      uuidStateKey="uuid"
      labelValue="upload-secondary-logo"
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  </div>
);

MenuContentsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

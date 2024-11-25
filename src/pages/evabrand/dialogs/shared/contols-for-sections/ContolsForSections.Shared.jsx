import React from 'react';
import PropTypes from 'prop-types';
import {
  ColorControls,
  InputsControls,
  TextEditorControls,
  UploaderControls,
} from './controls';
import './ControlsForSections.Style.scss';
import { UploaderPageEnum } from '../../../../../enums/Pages/UploaderPage.Enum';
import { SwitchComponent } from '../../../../../components';

export const ControlsForSectionsShared = ({
  state,
  onStateChanged,
  isSubmitted,
  errors,
  isWithSectionTitle,
  isWithColorPicker,
  isWithHeaderTitle,
  isWithSubheaderTitle,
  isWithBackgroundImg,
  isWithDescription,
  isExternalUrl,
  isWithExternalUrl,
  isAdvancedMode,
  uploaderPage,
  uploaderLabelValue,
  parentTranslationPath,
  translationPath,
}) => (
  <div className="controls-for-sections-shared-wrapper">
    {isWithSectionTitle && (
      <InputsControls
        editValue={state.section_title}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        stateKey="section_title"
        errors={errors}
        isHalfWidth
        title="section-title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithHeaderTitle && !isAdvancedMode && (
      <InputsControls
        idRef="SharedHeaderTitleInputRef"
        editValue={(state.constants && state.constants.header_title) || ''}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentId="constants"
        stateKey="header_title"
        errors={errors}
        isHalfWidth
        title="header-title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithHeaderTitle && isAdvancedMode && (
      <TextEditorControls
        editValue={(state.constants && state.constants.header_title) || ''}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentId="constants"
        stateKey="header_title"
        errors={errors}
        isHalfWidth
        title="header-title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithSubheaderTitle && !isAdvancedMode && (
      <InputsControls
        idRef="SharedSubheaderTitleInputRef"
        editValue={(state.constants && state.constants.sub_header_title) || ''}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentId="constants"
        stateKey="sub_header_title"
        errors={errors}
        isHalfWidth
        title="subheader-title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithSubheaderTitle && isAdvancedMode && (
      <TextEditorControls
        idRef="SharedSubheaderTitleRef"
        editValue={(state.constants && state.constants.sub_header_title) || ''}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentId="constants"
        stateKey="sub_header_title"
        errors={errors}
        isHalfWidth
        title="subheader-title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithDescription && (
      <TextEditorControls
        idRef="SharedDescriptionRef"
        editValue={(state.section_data && state.section_data.description) || ''}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentId="section_data"
        stateKey="description"
        errors={errors}
        title="description"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithColorPicker && (
      <ColorControls
        editValue={(state.constants && state.constants.background_color) || ''}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentId="constants"
        stateKey="background_color"
        errors={errors}
        isHalfWidth
        title="background-color"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    )}
    {isWithBackgroundImg && (
      <>
        {isExternalUrl && (
          <InputsControls
            idRef="SharedExternalYoutubeInputRef"
            editValue={
              (state.constants
                && state.constants.background_media
                && !state.constants.background_media.uuid
                && state.constants.background_media.url)
              || ''
            }
            onValueChanged={onStateChanged}
            isSubmitted={isSubmitted}
            parentId="constants"
            subParentId="background_media"
            stateKey="url"
            errors={errors}
            isHalfWidth
            title="youtube-link"
            placeholder="youtube-link-example"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {!isExternalUrl && (
          <UploaderControls
            mediaItem={
              (state.constants && state.constants.background_media) || undefined
            }
            uploaderPage={uploaderPage}
            onValueChanged={onStateChanged}
            isSubmitted={isSubmitted}
            parentId="constants"
            subParentId="background_media"
            urlStateKey="url"
            uuidStateKey="uuid"
            typeStateKey="type"
            errors={errors}
            isHalfWidth
            labelValue={uploaderLabelValue}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {isWithExternalUrl && (
          <div className="switch-controls-wrapper controls-wrapper">
            <SwitchComponent
              idRef="youtubeLinkSwitchRef"
              label="youtube-link"
              isChecked={isExternalUrl}
              isReversedLabel
              isFlexEnd
              onChange={(event, newValue) => {
                onStateChanged({ id: 'isExternalUrl', value: newValue });
                onStateChanged({
                  parentId: 'constants',
                  id: 'background_media',
                  value: null,
                });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        )}
      </>
    )}
  </div>
);

ControlsForSectionsShared.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func,
  errors: PropTypes.instanceOf(Object).isRequired,
  isWithSectionTitle: PropTypes.bool,
  isWithColorPicker: PropTypes.bool,
  isWithHeaderTitle: PropTypes.bool,
  isWithSubheaderTitle: PropTypes.bool,
  isWithDescription: PropTypes.bool,
  isWithBackgroundImg: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isExternalUrl: PropTypes.bool,
  isWithExternalUrl: PropTypes.bool,
  uploaderLabelValue: PropTypes.string,
  isAdvancedMode: PropTypes.bool.isRequired,
  uploaderPage: PropTypes.oneOf(Object.values(UploaderPageEnum).map((item) => item)),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ControlsForSectionsShared.defaultProps = {
  onStateChanged: undefined,
  isWithSectionTitle: false,
  isWithColorPicker: false,
  isWithHeaderTitle: false,
  isWithSubheaderTitle: false,
  isWithDescription: false,
  isWithBackgroundImg: false,
  isExternalUrl: false,
  isWithExternalUrl: false,
  isSubmitted: false,
  uploaderPage: undefined,
  uploaderLabelValue: 'upload-background-image',
  translationPath: 'ControlsForSectionsShared.',
};

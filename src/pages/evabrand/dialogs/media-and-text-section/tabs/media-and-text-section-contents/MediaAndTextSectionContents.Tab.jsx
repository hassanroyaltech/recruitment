import React from 'react';
import PropTypes from 'prop-types';
import { ControlsForSectionsShared } from '../../../shared/contols-for-sections';
import './MediaAndTextSectionContents.Style.scss';

export const MediaAndTextSectionContentsTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
}) => (
  <div className="media-and-text-section-contents-tab-wrapper tab-wrapper pt-3">
    <ControlsForSectionsShared
      state={state}
      onStateChanged={onStateChanged}
      errors={errors}
      isSubmitted={isSubmitted}
      isWithColorPicker
      isWithHeaderTitle
      isWithSubheaderTitle
      isWithBackgroundImg
      isAdvancedMode={isAdvancedMode}
      parentTranslationPath={parentTranslationPath}
    />
  </div>
);
MediaAndTextSectionContentsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

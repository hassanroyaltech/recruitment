import React from 'react';
import PropTypes from 'prop-types';
import { ControlsForSectionsShared } from '../../../shared/contols-for-sections';

export const PartnersContentsTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
}) => (
  <div className="partners-contents tab-wrapper pt-3">
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

PartnersContentsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

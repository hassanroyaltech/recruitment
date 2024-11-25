import React from 'react';
import PropTypes from 'prop-types';
import { ControlsForSectionsShared } from '../../../shared/contols-for-sections';
import './OpeningsSectionContents.Style.scss';
import { JobLimitsAutocompleteControl } from './controls';

export const OpeningsSectionContentsTab = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
}) => (
  <div className="openings-section-contents-tab-wrapper tab-wrapper pt-3">
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
    <JobLimitsAutocompleteControl
      editValue={(state && state.section_data.limit) || null}
      inputLabel="jobs-limit"
      placeholder="jobs-limit"
      errors={errors}
      isSubmitted={isSubmitted}
      parentId="section_data"
      stateKey="limit"
      errorPath="section_data.limit"
      onValueChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  </div>
);

OpeningsSectionContentsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

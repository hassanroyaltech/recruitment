// React and reactstrap
import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Standard Modal Component
import { StandardModalFrame } from 'components/Modals/StandardModalFrame';

// Slider
import { useTranslation } from 'react-i18next';

import { FilterDialogCallLocationsEnum } from '../../enums';
import FilterContentSection from './Sections/FilterContent/FilterContent.Section';
import './Filter.Style.scss';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * Define the function to return a FilterModal
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const FilterModal = memo(
  ({
    isOpen,
    onClose,
    onApply,
    isWithCheckboxes,
    isWithSliders,
    filterEditValue,
    filterEditValueTags,
    hideIncomplete,
    // showTags,
    callLocation,
    job_uuid,
    hideIncludeExclude,
    showAssessmentTestFilter,
    hideSourceFilter,
    hideReferenceAndApplicant,
    hideAssigneeFilters,
    showRmsFilters,
    showCandidateType,
    isShowHeightAndWeight,
    isShowVideoAssessmentFilter,
    isShowQuestionnaireFilter,
    isShowDynamicProperty,
    isShowAssigneeFilter,
    isShowAge
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    return (
      <StandardModalFrame
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        modalTitle={t(`${translationPath}filters`)}
        closeOnClick={onClose}
      >
        <div className="filters-dialog-wrapper px-5 pb-3">
          <FilterContentSection
            onClose={onClose}
            onApply={onApply}
            isWithCheckboxes={isWithCheckboxes}
            isWithSliders={isWithSliders}
            filterEditValue={filterEditValue}
            filterEditValueTags={filterEditValueTags}
            hideIncomplete={hideIncomplete}
            // showTags=
            callLocation={callLocation}
            job_uuid={job_uuid}
            hideIncludeExclude={hideIncludeExclude}
            showAssessmentTestFilter={showAssessmentTestFilter}
            hideSourceFilter={hideSourceFilter}
            hideReferenceAndApplicant={hideReferenceAndApplicant}
            hideAssigneeFilters={hideAssigneeFilters}
            showRmsFilters={showRmsFilters}
            showCandidateType={showCandidateType}
            isShowHeightAndWeight={isShowHeightAndWeight}
            isShowVideoAssessmentFilter={isShowVideoAssessmentFilter}
            isShowQuestionnaireFilter={isShowQuestionnaireFilter}
            isShowDynamicProperty={isShowDynamicProperty}
            isShowAssigneeFilter={isShowAssigneeFilter}
            isHalfWidth
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            isShowAge={isShowAge}
          />
        </div>
      </StandardModalFrame>
    );
  },
);

FilterModal.displayName = 'FilterModal';

FilterModal.propTypes = {
  callLocation: PropTypes.oneOf(
    Object.values(FilterDialogCallLocationsEnum).map((item) => item.key),
  ).isRequired,
  isOpen: PropTypes.bool,
  isWithSliders: PropTypes.bool,
  onClose: PropTypes.func,
  onApply: PropTypes.func,
  isWithCheckboxes: PropTypes.bool,
  filterEditValue: PropTypes.shape({}),
  filterEditValueTags: PropTypes.instanceOf(Array),
  hideIncomplete: PropTypes.bool,
  // showTags: PropTypes.bool,
  job_uuid: PropTypes.string,
  hideIncludeExclude: PropTypes.bool,
  showAssessmentTestFilter: PropTypes.bool,
  hideSourceFilter: PropTypes.bool,
  hideReferenceAndApplicant: PropTypes.bool,
  hideAssigneeFilters: PropTypes.bool,
  showRmsFilters: PropTypes.bool,
  showCandidateType: PropTypes.bool,
  isShowHeightAndWeight: PropTypes.bool,
  isShowVideoAssessmentFilter: PropTypes.bool,
  isShowQuestionnaireFilter: PropTypes.bool,
  isShowDynamicProperty: PropTypes.bool,
  isShowAssigneeFilter: PropTypes.bool,
  isShowAge:PropTypes.bool
};

FilterModal.defaultProps = {
  isOpen: undefined,
  onClose: undefined,
  onApply: undefined,
  isWithCheckboxes: undefined,
  isWithSliders: undefined,
  filterEditValue: undefined,
  filterEditValueTags: undefined,
  hideIncomplete: undefined,
  // showTags: undefined,
  job_uuid: undefined,
  hideIncludeExclude: undefined,
  showAssessmentTestFilter: undefined,
  hideSourceFilter: undefined,
  hideReferenceAndApplicant: undefined,
  hideAssigneeFilters: undefined,
  showRmsFilters: undefined,
};

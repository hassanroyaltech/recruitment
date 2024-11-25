import React, { useMemo, useState } from 'react';
import { ButtonBase } from '@mui/material';
import { ScorecardPreviewIcon } from '../../../../../../assets/icons';
import './ScorecardRatingInputs.Style.scss';
import i18next from 'i18next';
import { DynamicFormTypesEnum } from '../../../../../../enums';
import { SharedAutocompleteControl } from '../../../../../setups/shared';
const ScorecardDropdown = ({
  handleChange,
  value,
  decisionLabels,
  id,
  options,
  onChange,
  isView,
  isSubmitted,
  errors,
  errorPath,
  isFieldsDisabled,
  parentTranslationPath,
}) => {
  const memoizedOption = useMemo(
    () => (options || []).filter((item) => !!item),
    [options],
  );

  return (
    <div id={id} className="scorecard-dropdown-wrapper d-flex m-0">
      <SharedAutocompleteControl
        placeholder="select"
        isFullWidth
        getOptionLabel={(option) => option}
        sharedClassesWrapper="px-0 m-0 py-0"
        inlineLabelClasses="px-0 m-0 "
        initValues={memoizedOption}
        isDisabled={isFieldsDisabled}
        isStringArray
        stateKey="dropdown"
        parentTranslationPath={parentTranslationPath}
        onValueChanged={(newValue) => {
          onChange
            && onChange({
              value: newValue.value,
            });
        }}
        editValue={value || ''}
        type={DynamicFormTypesEnum.select.key}
        isSubmitted={isSubmitted}
        errors={errors}
        errorPath={errorPath}
      />
    </div>
  );
};
export default ScorecardDropdown;

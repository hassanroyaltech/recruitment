import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../components';
import { EvaBrandJobLimitsEnum } from '../../../../../../../enums';

export const JobLimitsAutocompleteControl = ({
  editValue,
  onValueChanged,
  idRef,
  inputLabel,
  placeholder,
  parentId,
  errorPath,
  stateKey,
  errors,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(null);
  const [data] = useState(() =>
    Object.values(EvaBrandJobLimitsEnum).map((item) => item),
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle autocomplete selected value on edit init
   */
  const getEditInit = useCallback(() => {
    if (editValue && data.length > 0) {
      const currentItem = data.find((item) => item.key === editValue);
      if (currentItem) setLocalValue(currentItem);
      else if (onValueChanged)
        onValueChanged({
          parentId,
          id: stateKey,
          value: null,
        });
    }
  }, [data, editValue, onValueChanged, parentId, stateKey]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="job-limits-autocomplete-control-wrapper control-wrapper">
      <AutocompleteComponent
        idRef={idRef}
        getOptionLabel={(option) => `${option.value}`}
        value={localValue}
        isOptionEqualToValue={(option) =>
          localValue && localValue.key === option.key
        }
        data={data}
        themeClass="theme-solid"
        inputLabel={inputLabel}
        inputPlaceholder={placeholder}
        error={errors[errorPath] && errors[errorPath].error}
        isSubmitted={isSubmitted}
        helperText={errors[errorPath] && errors[errorPath].message}
        onChange={(e, newValue) => {
          setLocalValue(newValue);
          if (onValueChanged)
            onValueChanged({
              parentId,
              id: stateKey,
              value: newValue ? newValue.key : null,
            });
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

JobLimitsAutocompleteControl.propTypes = {
  editValue: PropTypes.oneOf(
    Object.values(EvaBrandJobLimitsEnum).map((item) => item.key),
  ),
  onValueChanged: PropTypes.func,
  parentId: PropTypes.string.isRequired,
  errorPath: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  inputLabel: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

JobLimitsAutocompleteControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  idRef: 'JobLimitsAutocompleteControlRef',
};

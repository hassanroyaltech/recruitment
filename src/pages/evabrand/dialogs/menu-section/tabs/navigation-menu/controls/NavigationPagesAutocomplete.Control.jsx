import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../components';

export const NavigationPagesAutocompleteControl = ({
  data,
  editValue,
  onValueChanged,
  idRef,
  title,
  placeholder,
  isSubmitted,
  parentId,
  subParentId,
  index,
  stateKey,
  errors,
  isDisabled,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(null);
  const getEditInit = useCallback(async () => {
    if (editValue && data.length > 0) {
      const currentItem = data.find((item) => item.key === editValue);
      if (currentItem) setLocalValue(currentItem);
      else if (onValueChanged)
        onValueChanged({
          parentId,
          subParentId,
          index,
          id: stateKey,
          value: null,
        });
    }
  }, [data, editValue, index, onValueChanged, parentId, stateKey, subParentId]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="navigation-autocomplete-control-wrapper control-wrapper">
      <AutocompleteComponent
        idRef={`${idRef}${index + 1}`}
        getOptionLabel={(option) => option.value || ''}
        value={localValue}
        isOptionEqualToValue={(option) =>
          localValue && localValue.key === option.key
        }
        data={data}
        themeClass="theme-solid"
        inputLabel={title}
        isDisabled={isDisabled}
        inputPlaceholder={placeholder}
        error={
          (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
              .error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
              .message)
          || undefined
        }
        onChange={(e, newValue) => {
          setLocalValue(newValue);
          if (onValueChanged)
            onValueChanged({
              parentId,
              subParentId,
              index,
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

NavigationPagesAutocompleteControl.propTypes = {
  data: PropTypes.instanceOf(Array),
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
NavigationPagesAutocompleteControl.defaultProps = {
  data: [],
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  isDisabled: undefined,
  idRef: 'NavigationPagesAutocompleteControlRef',
};

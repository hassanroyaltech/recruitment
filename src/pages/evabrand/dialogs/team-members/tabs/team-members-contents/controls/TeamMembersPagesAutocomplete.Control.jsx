import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../components';

export const TeamMembersPagesAutocompleteControl = ({
  data,
  editValue,
  onValueChanged,
  idRef,
  title,
  placeholder,
  isSubmitted,
  parentId,
  stateKey,
  errors,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(null);
  const getEditInit = useCallback(async () => {
    if (editValue && !localValue && data.length > 0) {
      const currentItem = data.find((item) => item.key === editValue);
      if (currentItem) setLocalValue(currentItem);
      else if (onValueChanged)
        onValueChanged({
          parentId,
          id: stateKey,
          value: null,
        });
    }
  }, [data, editValue, localValue, onValueChanged, parentId, stateKey]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="team-members-page-autocomplete-control-wrapper control-wrapper">
      <AutocompleteComponent
        idRef={idRef}
        getOptionLabel={(option) => option.value || ''}
        value={localValue}
        isOptionEqualToValue={(option) =>
          localValue && localValue.key === option.key
        }
        data={data}
        themeClass="theme-solid"
        inputLabel={title}
        inputPlaceholder={placeholder}
        error={
          (errors[parentId && `${parentId}.${stateKey}`]
            && errors[parentId && `${parentId}.${stateKey}`].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[parentId && `${parentId}.${stateKey}`]
            && errors[parentId && `${parentId}.${stateKey}`].message)
          || undefined
        }
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

TeamMembersPagesAutocompleteControl.propTypes = {
  data: PropTypes.instanceOf(Array),
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TeamMembersPagesAutocompleteControl.defaultProps = {
  data: [],
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  idRef: 'TeamMembersPagesAutocompleteControlRef',
};

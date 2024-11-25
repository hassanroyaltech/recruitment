import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../../components';

export const PagesCandidatePagesAutocompleteControl = ({
  pages,
  data,
  editValue,
  onValueChanged,
  idRef,
  title,
  placeholder,
  isSubmitted,
  parentId,
  subParentId,
  subSubParentId,
  categoryIndex,
  index,
  stateKey,
  errors,
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
          index: categoryIndex,
          id: subSubParentId,
          value: [],
        });
    }
  }, [
    categoryIndex,
    data,
    editValue,
    onValueChanged,
    parentId,
    subParentId,
    subSubParentId,
  ]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="pages-candidate-pages-autocomplete-control-wrapper control-wrapper">
      <AutocompleteComponent
        idRef={`${idRef}${categoryIndex + 1}-${index + 1}`}
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
          (errors[
            parentId
              && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
          ]
            && errors[
              parentId
                && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
            ].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[
            parentId
              && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
          ]
            && errors[
              parentId
                && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
            ].message)
          || undefined
        }
        onChange={(e, newValue) => {
          setLocalValue(newValue);
          const localPages = [...(pages || [])];
          if (!localPages[index]) localPages[index] = {};
          localPages[index][stateKey] = newValue ? newValue.key : null;
          if (onValueChanged)
            onValueChanged({
              parentId,
              subParentId,
              index: categoryIndex,
              id: subSubParentId,
              value: localPages,
            });
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

PagesCandidatePagesAutocompleteControl.propTypes = {
  pages: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Array),
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  subSubParentId: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
PagesCandidatePagesAutocompleteControl.defaultProps = {
  pages: [],
  data: [],
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'PagesCandidatePagesAutocompleteControlRef',
};

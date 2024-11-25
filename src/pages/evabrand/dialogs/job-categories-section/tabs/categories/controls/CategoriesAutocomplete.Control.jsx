import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../components';
import { GetAllJobCategories } from '../../../../../../../services';

export const CategoriesAutocompleteControl = ({
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
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method get all job categories from api
   */
  const getAllJobCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllJobCategories({});
    setIsLoading(false);
    if (response && response.status === 200) setData(response.data.results);
  }, []);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle autocomplete selected value on edit init
   */
  const getEditInit = useCallback(async () => {
    if (editValue && data.length > 0) {
      const currentItem = data.find((item) => item.uuid === editValue);
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
  useEffect(() => {
    getAllJobCategories();
  }, [getAllJobCategories]);

  return (
    <div className="categories-autocomplete-control-wrapper control-wrapper">
      <AutocompleteComponent
        idRef={`${idRef}${index + 1}`}
        getOptionLabel={(option) => option.title || ''}
        value={localValue}
        isOptionEqualToValue={(option) =>
          localValue && localValue.uuid === option.uuid
        }
        data={data}
        themeClass="theme-solid"
        inputLabel={title}
        inputPlaceholder={placeholder}
        error={
          (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
              .error)
          || undefined
        }
        isSubmitted={isSubmitted}
        isLoading={isLoading}
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
              value: newValue ? newValue.uuid : null,
            });
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

CategoriesAutocompleteControl.propTypes = {
  editValue: PropTypes.number,
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
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
CategoriesAutocompleteControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'CategoriesAutocompleteControlRef',
};

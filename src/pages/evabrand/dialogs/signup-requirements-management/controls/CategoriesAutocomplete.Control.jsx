import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../components';
import { GetAllJobCategories } from '../../../../../services';

export const CategoriesAutocompleteControl = ({
  editValue,
  onValueChanged,
  idRef,
  title,
  placeholder,
  isSubmitted,
  isDisabled,
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
          id: stateKey,
          value: null,
        });
    }
  }, [data, editValue, onValueChanged, stateKey]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);
  useEffect(() => {
    getAllJobCategories();
  }, [getAllJobCategories]);

  return (
    data
    && data.length !== 1 && (
      <div className="categories-autocomplete-control-wrapper control-wrapper">
        <AutocompleteComponent
          idRef={idRef}
          getOptionLabel={(option) => option.title || ''}
          value={localValue}
          isOptionEqualToValue={(option) =>
            localValue && localValue.uuid === option.uuid
          }
          data={data}
          themeClass="theme-solid"
          inputLabel={title}
          inputPlaceholder={placeholder}
          error={(errors[`${stateKey}`] && errors[`${stateKey}`].error) || undefined}
          isSubmitted={isSubmitted}
          isDisabled={isDisabled}
          isLoading={isLoading}
          helperText={
            (errors[`${stateKey}`] && errors[`${stateKey}`].message) || undefined
          }
          onChange={(e, newValue) => {
            setLocalValue(newValue);
            if (onValueChanged)
              onValueChanged({
                id: stateKey,
                value: newValue ? newValue.uuid : null,
              });
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    )
  );
};

CategoriesAutocompleteControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
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
  idRef: 'CategoriesAutocompleteControlRef',
};

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../../components';
import { NavigationLinkTypesEnum } from '../../../../../../../enums';

export const NavigationTypeAutocompleteControl = ({
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
  linkStateKey,
  linkValue,
  errors,
  isDisabled,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localValue, setLocalValue] = useState(null);
  const [data] = useState(() =>
    Object.values(NavigationLinkTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const getEditInit = useCallback(async () => {
    if ((editValue || editValue === 0) && data.length > 0) {
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
        isDisabled={isDisabled}
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
        helperText={
          (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
              .message)
          || undefined
        }
        onChange={(e, newValue) => {
          setLocalValue(newValue);
          if (onValueChanged && linkValue)
            onValueChanged({
              parentId,
              subParentId,
              index,
              id: linkStateKey,
              value: null,
            });
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

NavigationTypeAutocompleteControl.propTypes = {
  editValue: PropTypes.number,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  linkStateKey: PropTypes.string.isRequired,
  linkValue: PropTypes.string,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
NavigationTypeAutocompleteControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  linkValue: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  isDisabled: undefined,
  idRef: 'NavigationAutocompleteControlRef',
};

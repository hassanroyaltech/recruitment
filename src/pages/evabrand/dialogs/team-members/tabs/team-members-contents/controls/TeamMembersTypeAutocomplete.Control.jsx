import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../../components';
import { NavigationLinkTypesEnum } from '../../../../../../../enums';

export const TeamMembersTypeAutocompleteControl = ({
  editValue,
  onValueChanged,
  idRef,
  title,
  placeholder,
  isSubmitted,
  parentId,
  stateKey,
  linkStateKey,
  linkValue,
  errors,
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
    if ((editValue || editValue === 0) && !localValue && data.length > 0) {
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
    <div className="team-members-type-autocomplete-control-wrapper control-wrapper">
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
          if (onValueChanged && linkValue)
            onValueChanged({
              parentId,
              id: linkStateKey,
              value: '',
            });
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

TeamMembersTypeAutocompleteControl.propTypes = {
  editValue: PropTypes.number,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  linkStateKey: PropTypes.string.isRequired,
  linkValue: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TeamMembersTypeAutocompleteControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  linkValue: undefined,
  parentId: undefined,
  idRef: 'TeamMembersTypeAutocompleteControlRef',
};

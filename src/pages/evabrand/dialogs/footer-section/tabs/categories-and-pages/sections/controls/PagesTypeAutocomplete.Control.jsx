import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../../../components';
import { NavigationLinkTypesEnum } from '../../../../../../../../enums';

export const PagesTypeAutocompleteControl = ({
  pages,
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
  linkStateKey,
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
    if ((editValue || editValue === 0) && data.length > 0) {
      const currentItem = data.find((item) => item.key === editValue);
      if (currentItem) setLocalValue(currentItem);
      else if (onValueChanged) {
        const localPages = [...(pages || [])];
        if (!localPages[index]) localPages[index] = {};
        localPages[index][stateKey] = null;
        localPages[index][linkStateKey] = null;
        onValueChanged({
          parentId,
          subParentId,
          index: categoryIndex,
          id: subSubParentId,
          value: localPages,
        });
      }
    }
  }, [
    categoryIndex,
    data,
    editValue,
    index,
    linkStateKey,
    onValueChanged,
    pages,
    parentId,
    stateKey,
    subParentId,
    subSubParentId,
  ]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="pages-type-autocomplete-control-wrapper control-wrapper">
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
          localPages[index][linkStateKey] = null;
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

PagesTypeAutocompleteControl.propTypes = {
  pages: PropTypes.instanceOf(Array),
  editValue: PropTypes.number,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  subSubParentId: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  linkStateKey: PropTypes.string.isRequired,
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
PagesTypeAutocompleteControl.defaultProps = {
  pages: [],
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'PagesTypeAutocompleteControlRef',
};

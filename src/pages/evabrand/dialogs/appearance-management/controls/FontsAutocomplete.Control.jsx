import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../components';
import { EvaBrandFontsEnum } from '../../../../../enums';

export const FontsAutocompleteControl = ({
  editValue,
  onValueChanged,
  idRef,
  inputLabel,
  placeholder,
  // isSubmitted,
  stateKey,
  // errors,
  isSubmitted,
  language,
  parentTranslationPath,
  translationPath,
  isRequired,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localValue, setLocalValue] = useState(null);
  const [data] = useState(() =>
    Object.values(EvaBrandFontsEnum)
      .filter((item) =>
        item.supportedLanguages.includes((language && language.code) || 'en'),
      )
      .map((item) => ({
        ...item,
        value: t(`${translationPath}${item.value}`),
      })),
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle autocomplete selected value on edit init
   */
  const getEditInit = useCallback(async () => {
    if (editValue && !localValue && data.length > 0) {
      const currentItem = data.find((item) => item.key === editValue);
      if (currentItem) setLocalValue(currentItem);
      else if (onValueChanged)
        onValueChanged({
          id: stateKey,
          value: null,
        });
    }
  }, [data, editValue, localValue, onValueChanged, stateKey]);
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="fonts-autocomplete-control-wrapper control-wrapper">
      <AutocompleteComponent
        idRef={idRef}
        getOptionLabel={(option) => option.value || ''}
        renderOption={(renderProps, option) => (
          <li {...renderProps}>
            <span style={{ fontFamily: option.key }}>{option.value}</span>
          </li>
        )}
        value={localValue}
        isOptionEqualToValue={(option) =>
          localValue && localValue.key === option.key
        }
        data={data}
        themeClass="theme-solid"
        inputLabel={inputLabel}
        inputPlaceholder={placeholder}
        error={isRequired && !localValue}
        isSubmitted={isSubmitted}
        helperText={t(`${translationPath}font-is-required`)}
        onChange={(e, newValue) => {
          setLocalValue(newValue);
          if (onValueChanged)
            onValueChanged({
              id: stateKey,
              value: newValue ? newValue.key : null,
            });
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isRequired={isRequired}
      />
    </div>
  );
};

FontsAutocompleteControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  // isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  idRef: PropTypes.string,
  // errors: PropTypes.instanceOf(Object).isRequired,
  inputLabel: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool,
  language: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
FontsAutocompleteControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  idRef: 'FontsAutocompleteControlRef',
  isRequired: false,
};

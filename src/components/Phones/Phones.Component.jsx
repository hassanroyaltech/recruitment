import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import ar from 'react-phone-input-2/lang/ar.json';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import './Phones.Style.scss';
import { GlobalInputDelay } from '../../helpers';

export const PhonesComponent = memo(
  ({
    isValid,
    country,
    onInputChanged,
    onInputBlur,
    onDelayedChanged,
    idRef,
    isRequired,
    isDisabled,
    value,
    wrapperClasses,
    inputClasses,
    labelClasses,
    errorClasses,
    phoneInputClasses,
    inputPlaceholder,
    labelValue,
    specialLabel,
    error,
    helperText,
    isSubmitted,
    isLoading,
    afterIconClasses,
    loadingIconClasses,
    themeClass,
    loadingIcon,
    searchPlaceholder,
    parentTranslationPath,
    sharedParentTranslationPath,
    translationPath,
    tabIndex,
    enableSearch,
    enableAreaCodes,
    excludeCountries,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);
    const getPhoneLocalization = () => {
      if (i18next.language === 'en') return undefined;
      if (i18next.language === 'ar') return ar;
      return undefined;
    };
    const [localValue, setLocalValue] = useState(
      value || value === 0 ? `${value}` : '',
    );
    const timerRef = useRef(null);

    // this to update localValue on parent changed
    useEffect(() => {
      if (!timerRef.current) setLocalValue(value || value === 0 ? `${value}` : '');
    }, [value]);

    // to prevent memory leak if component destroyed before time finish
    useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      [],
    );
    return (
      <div
        className={`phones-wrapper ${themeClass}${
          (wrapperClasses && ` ${wrapperClasses}`) || ''
        }`}
      >
        {labelValue && (
          <label
            htmlFor={idRef}
            className={`label-wrapper ${(labelClasses && ` ${labelClasses}`) || ''}${
              isDisabled ? ' disabled' : ''
            }`}
          >
            {(parentTranslationPath && t(`${translationPath}${labelValue}`))
              || labelValue}
          </label>
        )}
        <div
          className={`phone-input-wrapper${
            (phoneInputClasses && ` ${phoneInputClasses}`) || ''
          }${
            (!(isValid || !(error && (isSubmitted || isBlurOrChanged)))
              && ' invalid-number')
            || ''
          }`}
        >
          <PhoneInput
            excludeCountries={excludeCountries}
            isValid={isValid || !(error && (isSubmitted || isBlurOrChanged))}
            country={country}
            inputProps={{
              required: isRequired,
              id: idRef,
              tabIndex,
            }}
            specialLabel={
              (specialLabel
                && ((parentTranslationPath
                  && (isRequired
                    ? `${t(`${translationPath}${specialLabel}`)}*`
                    : t(`${translationPath}${specialLabel}`)))
                  || (isRequired ? `${specialLabel}*` : specialLabel)))
              || undefined
            }
            containerClass={`${
              (helperText
                && error
                && (isSubmitted || isBlurOrChanged)
                && ' phone-error')
              || ''
            }`}
            disabled={isDisabled}
            value={localValue}
            inputClass={`inputs${(inputClasses && ` ${inputClasses}`) || ''}`}
            onBlur={(event, newCountry) => {
              if (!isBlurOrChanged) setIsBlurOrChanged(true);
              if (onDelayedChanged)
                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                  timerRef.current = null;
                  onDelayedChanged(
                    `${localValue}`.replaceAll(' ', ''),
                    newCountry,
                    event,
                  );
                }
              if (onInputBlur)
                onInputBlur(`${localValue}`.replaceAll(' ', ''), newCountry, event);
            }}
            onChange={(newPhoneValue, newCountry, event) => {
              if (event.type !== 'change')
                if (document.querySelector(`#${idRef}`))
                  document.querySelector(`#${idRef}`).focus();
              if (!isBlurOrChanged) setIsBlurOrChanged(true);
              let localNewValue = newPhoneValue;
              const localNewCountry = newCountry;
              const localNewEvent = event;
              if (localNewValue && !localNewValue.startsWith(newCountry.dialCode))
                localNewValue = newCountry.dialCode + localNewValue;
              setLocalValue(localNewValue);
              if (onDelayedChanged) {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                  timerRef.current = null;
                  onDelayedChanged(localNewValue, localNewCountry, localNewEvent);
                }, GlobalInputDelay);
              }
              if (!onInputChanged) return;
              if (newPhoneValue && !newPhoneValue.startsWith(newCountry.dialCode)) {
                onInputChanged(
                  newCountry.dialCode + newPhoneValue,
                  newCountry,
                  event,
                );
                return;
              }
              onInputChanged(newPhoneValue, newCountry, event);
            }}
            enableAreaCodes={enableAreaCodes}
            enableSearch={enableSearch}
            searchPlaceholder={t(
              `${sharedParentTranslationPath}:${searchPlaceholder}`,
            )}
            localization={getPhoneLocalization}
            placeholder={
              (inputPlaceholder
                && ((parentTranslationPath
                  && t(`${translationPath}${inputPlaceholder}`))
                  || inputPlaceholder))
              || undefined
            }
          />
          {isLoading && (
            <span
              className={`${loadingIcon}${
                (loadingIconClasses && ` ${loadingIconClasses}`) || ''
              }`}
            />
          )}
          {afterIconClasses && <span className={`mx-2 ${afterIconClasses}`} />}
        </div>
        {helperText && error && (isSubmitted || isBlurOrChanged) && (
          <div
            className={`phone-error-wrapper${
              (errorClasses && ` ${errorClasses}`) || ''
            }`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  },
);
PhonesComponent.displayName = 'PhonesComponent';
PhonesComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.any]),
  onInputChanged: PropTypes.func,
  onInputBlur: PropTypes.func,
  onDelayedChanged: PropTypes.func,
  isValid: PropTypes.func,
  idRef: PropTypes.string.isRequired,
  wrapperClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  errorClasses: PropTypes.string,
  phoneInputClasses: PropTypes.string,
  themeClass: PropTypes.oneOf(['theme-outline']),
  translationPath: PropTypes.string,
  labelValue: PropTypes.string,
  specialLabel: PropTypes.string,
  country: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  afterIconClasses: PropTypes.string,
  loadingIconClasses: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  sharedParentTranslationPath: PropTypes.string,
  loadingIcon: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  enableAreaCodes: PropTypes.bool,
  enableSearch: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  tabIndex: PropTypes.number,
  excludeCountries: PropTypes.arrayOf(PropTypes.string),
};
PhonesComponent.defaultProps = {
  value: undefined,
  onInputChanged: undefined,
  onDelayedChanged: undefined,
  onInputBlur: undefined,
  isValid: undefined,
  inputPlaceholder: undefined,
  afterIconClasses: undefined,
  loadingIconClasses: undefined,
  country: 'jo',
  isRequired: false,
  isDisabled: false,
  translationPath: '',
  labelValue: undefined,
  specialLabel: undefined,
  wrapperClasses: '',
  inputClasses: '',
  labelClasses: undefined,
  errorClasses: undefined,
  phoneInputClasses: undefined,
  themeClass: 'theme-outline',
  helperText: undefined,
  loadingIcon: 'fas fa-spinner fa-spin',
  searchPlaceholder: 'search',
  parentTranslationPath: undefined,
  sharedParentTranslationPath: 'Shared',
  error: false,
  isLoading: false,
  isSubmitted: false,
  tabIndex: undefined,
  enableSearch: true,
  enableAreaCodes: undefined,
  excludeCountries: ['il'],
};

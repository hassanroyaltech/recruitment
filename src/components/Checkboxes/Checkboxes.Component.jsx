import React, { memo, useCallback, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import './Checkboxes.Style.scss';

export const CheckboxesComponent = memo(
  ({
    data,
    labelValue,
    ariaLabel,
    translationPath,
    parentTranslationPath,
    translationPathForData,
    onSelectedCheckboxChanged,
    onSelectedCheckboxClicked,
    singleChecked,
    singleIndeterminate,
    key,
    isDisabledInput,
    isDisabled,
    labelInput,
    label,
    wrapperClasses,
    checkboxClasses,
    labelClasses,
    themeClass,
    isRequired,
    idRef,
    checked,
    indeterminate,
    getLabel,
    isRow,
    tabIndex,
    disableRipple,
    formControlLabelClasses,
    checkboxGroupClasses,
    isLoading,
    helperText,
    error,
    isSubmitted,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);
    const onChangeHandler = useCallback(
      (item, index) => (event, checkedValue) => {
        if (onSelectedCheckboxChanged)
          onSelectedCheckboxChanged(item, index, checkedValue, event);
      },
      [onSelectedCheckboxChanged],
    );
    return (
      <FormControl
        required={isRequired}
        className={`checkbox-groups-wrapper ${wrapperClasses} ${themeClass || ''}`}
        component="fieldset"
      >
        {labelValue && (
          <div className="labels-wrapper">
            {labelValue && (
              <label
                htmlFor={idRef}
                className={`label-wrapper ${labelClasses}${
                  isDisabled ? ' disabled' : ''
                }`}
              >
                <span>{t(`${translationPath}${labelValue}`)}</span>
                {isRequired && <span className="px-1">*</span>}
              </label>
            )}
          </div>
        )}
        {!data && !isLoading ? (
          <FormControlLabel
            disabled={isDisabled}
            className={`form-control-label ${formControlLabelClasses}`}
            tabIndex={tabIndex}
            control={
              <Checkbox
                className={`checkbox-wrapper ${checkboxClasses}`}
                icon={<span className="i-unchecked" />}
                checkedIcon={<span className="fas fa-check" />}
                indeterminateIcon={<span className="fas fa-minus" />}
                checked={singleChecked}
                disableRipple={disableRipple}
                indeterminate={singleIndeterminate}
                onClick={onSelectedCheckboxClicked}
                onChange={onSelectedCheckboxChanged}
              />
            }
            label={
              label
              && ((typeof label === 'string'
                && parentTranslationPath
                && t(`${translationPath}${label}`))
                || label
                || undefined)
            }
            id={idRef}
          />
        ) : (
          isLoading && <i className="fas fa-circle-notch fa-spin" />
        )}
        {data && !isLoading && (
          <FormGroup
            aria-label={
              ariaLabel
                ? t(`${translationPathForData}${ariaLabel}`)
                : 'Checkbox Group'
            }
            row={isRow}
            className={`checkbox-group-wrapper ${checkboxGroupClasses}`}
            id={idRef}
            onBlur={() => {
              if (!isBlurOrChanged) setIsBlurOrChanged(true);
            }}
          >
            {data.map((item, index) => (
              <FormControlLabel
                key={`${key}${index + 1}`}
                disabled={isDisabledInput ? item[isDisabledInput] : isDisabled}
                className={`form-control-label ${formControlLabelClasses}`}
                onChange={onChangeHandler(item, index)}
                control={
                  <Checkbox
                    className={`checkbox-wrapper ${checkboxClasses}`}
                    icon={<span className="i-unchecked" />}
                    checkedIcon={<span className="fas fa-check" />}
                    indeterminateIcon={<span className="fas fa-minus" />}
                    checked={checked && checked(item, index)}
                    indeterminate={indeterminate && indeterminate(item, index)}
                    onChange={onChangeHandler(item, index)}
                  />
                }
                label={
                  label
                  || (getLabel && getLabel(item, index))
                  || (labelInput
                    ? ((translationPathForData || translationPathForData === '')
                        && t(`${translationPathForData}${item[labelInput]}`))
                      || item[labelInput]
                    : item)
                }
              />
            ))}
          </FormGroup>
        )}
        {helperText && error && (isSubmitted || isBlurOrChanged) && (
          <div className="error-wrapper">
            <span>{helperText}</span>
          </div>
        )}
      </FormControl>
    );
  },
);

CheckboxesComponent.displayName = 'CheckboxesComponent';

CheckboxesComponent.propTypes = {
  data: PropTypes.instanceOf(Array),
  idRef: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  labelValue: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathForData: PropTypes.string,
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onSelectedCheckboxChanged: PropTypes.func,
  onSelectedCheckboxClicked: PropTypes.func,
  getLabel: PropTypes.func,
  singleChecked: PropTypes.bool,
  singleIndeterminate: PropTypes.bool,
  checked: PropTypes.func,
  indeterminate: PropTypes.func,
  key: PropTypes.string,
  isDisabledInput: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isRow: PropTypes.bool,
  // valueInput: PropTypes.string,
  labelInput: PropTypes.string,
  label: PropTypes.string,
  wrapperClasses: PropTypes.string,
  checkboxClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  formControlLabelClasses: PropTypes.string,
  checkboxGroupClasses: PropTypes.string,
  themeClass: PropTypes.oneOf([
    'theme-default',
    'theme-secondary',
    'theme-secondary-light',
  ]),
  tabIndex: PropTypes.number,
  disableRipple: PropTypes.bool,
  isLoading: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};
CheckboxesComponent.defaultProps = {
  data: undefined,
  labelValue: '',
  label: '',
  ariaLabel: undefined,
  singleChecked: undefined,
  isRow: false,
  isLoading: false,
  translationPath: '',
  parentTranslationPath: undefined,
  translationPathForData: undefined,
  // value: null,
  onSelectedCheckboxClicked: undefined,
  onSelectedCheckboxChanged: () => {},
  getLabel: undefined,
  checked: undefined,
  indeterminate: undefined,
  key: 'checkboxGroups',
  isDisabledInput: undefined,
  isDisabled: false,
  isRequired: false,
  // valueInput: null,
  labelInput: null,
  wrapperClasses: '',
  checkboxClasses: '',
  labelClasses: '',
  formControlLabelClasses: '',
  checkboxGroupClasses: '',
  themeClass: 'theme-default',
  tabIndex: undefined,
  disableRipple: undefined,
  singleIndeterminate: false,
  helperText: undefined,
  error: false,
  isSubmitted: false,
};

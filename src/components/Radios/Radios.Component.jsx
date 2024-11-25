import React, { memo } from 'react';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Radios.Style.scss';

const RadiosComponent = memo(
  ({
    idRef,
    data,
    name,
    ariaLabel,
    translationPath,
    parentTranslationPath,
    translationPathForData,
    value,
    onSelectedRadioChanged,
    key,
    isDisabledInput,
    isDisabled,
    valueInput,
    labelInput,
    wrapperClasses,
    radioClasses,
    radioControlClasses,
    labelValue,
    labelClasses,
    themeClass,
    singleLabelComponent,
    singleLabelValue,
    onSelectedRadioClicked,
    icon,
    checkedIcon,
    getLabel,
    helperText,
    error,
    isSubmitted,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    return (
      (!data || data.length > 0) && (
        <FormControl
          className={`radio-control-wrapper ${wrapperClasses} ${themeClass}`}
          component="fieldset"
        >
          {labelValue && (
            <label
              htmlFor={idRef}
              className={`label-wrapper ${labelClasses}${
                isDisabled ? ' disabled' : ''
              }`}
            >
              {t(`${translationPath}${labelValue}`)}
            </label>
          )}
          {!data && (
            <FormControlLabel
              disabled={isDisabled}
              id={idRef}
              className={`radio-control-label-wrapper ${radioControlClasses}`}
              control={
                <Radio
                  className={`radio-wrapper ${radioClasses}`}
                  checkedIcon={<span className={`${checkedIcon} radio-icon`} />}
                  icon={<span className={`${icon} radio-icon`} />}
                  checked={value}
                  onChange={onSelectedRadioChanged}
                  onClick={onSelectedRadioClicked}
                />
              }
              label={
                singleLabelComponent
                || (singleLabelValue
                  && (((translationPathForData || translationPathForData === '')
                    && t(`${translationPathForData}${singleLabelValue}`))
                    || singleLabelValue))
              }
            />
          )}
          {data && data.length > 0 && (
            <RadioGroup
              id={idRef}
              aria-label={
                ariaLabel
                  ? t(`${translationPathForData}${ariaLabel}`)
                  : 'Radio Group'
              }
              name={name}
              className="radio-group-wrapper"
              value={value}
              onChange={onSelectedRadioChanged}
            >
              {data.map((item, index) => (
                <FormControlLabel
                  key={`${key}${index + 1}`}
                  disabled={isDisabledInput ? item[isDisabledInput] : isDisabled}
                  value={valueInput ? item[valueInput] : item}
                  className={`radio-control-label-wrapper ${radioControlClasses}`}
                  control={
                    <Radio
                      className={`radio-wrapper ${radioClasses}`}
                      checkedIcon={<span className={`${checkedIcon} radio-icon`} />}
                      icon={<span className={`${icon} radio-icon`} />}
                    />
                  }
                  label={
                    (item.component && item.component(item, index))
                    || (getLabel && getLabel(item, index))
                    || (translationPathForData || translationPathForData === ''
                      ? (labelInput
                          && t(`${translationPathForData}${item[labelInput]}`))
                        || item
                      : item[labelInput])
                  }
                />
              ))}
            </RadioGroup>
          )}
          {helperText && error && isSubmitted && (
            <div className="error-wrapper mx-2">
              <span>{helperText}</span>
            </div>
          )}
        </FormControl>
      )
    );
  },
);

RadiosComponent.displayName = 'RadiosComponent';

RadiosComponent.propTypes = {
  data: PropTypes.instanceOf(Array),
  name: PropTypes.string,
  idRef: PropTypes.string,
  ariaLabel: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathForData: PropTypes.string,
  singleLabelValue: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onSelectedRadioChanged: PropTypes.func,
  onSelectedRadioClicked: PropTypes.func,
  singleLabelComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  key: PropTypes.string,
  isDisabledInput: PropTypes.string,
  isDisabled: PropTypes.bool,
  valueInput: PropTypes.string,
  labelInput: PropTypes.string,
  wrapperClasses: PropTypes.string,
  radioClasses: PropTypes.string,
  radioControlClasses: PropTypes.string,
  labelValue: PropTypes.string,
  labelClasses: PropTypes.string,
  icon: PropTypes.string,
  checkedIcon: PropTypes.string,
  getLabel: PropTypes.func,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  themeClass: PropTypes.oneOf([
    'theme-default',
    'theme-line',
    'theme-column',
    'theme-line-secondary',
  ]),
};
RadiosComponent.defaultProps = {
  data: undefined,
  idRef: 'radioGroupRef',
  name: undefined,
  labelValue: undefined,
  ariaLabel: null,
  translationPath: '',
  parentTranslationPath: '',
  translationPathForData: null,
  singleLabelValue: undefined,
  value: null,
  onSelectedRadioChanged: () => {},
  onSelectedRadioClicked: undefined,
  singleLabelComponent: undefined,
  key: 'radioGroups',
  isDisabledInput: null,
  isDisabled: false,
  valueInput: null,
  labelInput: null,
  wrapperClasses: '',
  radioClasses: '',
  labelClasses: '',
  radioControlClasses: '',
  themeClass: 'theme-line',
  icon: 'far fa-circle',
  checkedIcon: 'far fa-dot-circle',
  getLabel: undefined,
  helperText: undefined,
  error: false,
  isSubmitted: false,
};
export { RadiosComponent };

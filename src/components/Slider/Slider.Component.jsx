import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Slider from '@mui/material/Slider';
import './Slider.Style.scss';

export const SliderComponent = memo(
  ({
    idRef,
    value,
    defaultValue,
    onChange,
    onClick,
    marks,
    step,
    labelValue,
    isDisabled,
    wrapperClasses,
    labelClasses,
    valueLabelDisplay,
    min,
    max,
    isRow,
    onChangeCommitted,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [localDefaultValue] = useState(defaultValue);
    return (
      <div
        className={`slider-wrapper ${wrapperClasses}${(isRow && ' is-row') || ''}`}
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
        <Slider
          value={value}
          defaultValue={localDefaultValue}
          step={step}
          valueLabelDisplay={valueLabelDisplay}
          marks={marks}
          max={max}
          min={min}
          disabled={isDisabled}
          onClick={onClick}
          onChange={onChange}
          onChangeCommitted={onChangeCommitted}
        />
      </div>
    );
  },
);

SliderComponent.displayName = 'SliderComponent';

SliderComponent.propTypes = {
  idRef: PropTypes.string,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onChangeCommitted: PropTypes.func, // trigger on key up
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]),
    }),
  ),
  step: PropTypes.number,
  min: PropTypes.number, // default 0
  max: PropTypes.number, // default 100
  labelValue: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRow: PropTypes.bool,
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  valueLabelDisplay: PropTypes.oneOf(['on', 'auto', 'off']),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

SliderComponent.defaultProps = {
  value: undefined,
  defaultValue: undefined,
  idRef: 'SliderRef',
  onChange: undefined,
  onClick: undefined,
  onChangeCommitted: undefined,
  marks: [],
  step: undefined,
  min: undefined,
  max: undefined,
  labelValue: undefined,
  isDisabled: false,
  isRow: false,
  wrapperClasses: '',
  labelClasses: '',
  valueLabelDisplay: 'auto',
  parentTranslationPath: '',
  translationPath: '',
};

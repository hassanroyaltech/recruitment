import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { ButtonBase } from '@mui/material';
import { PopoverComponent } from '../Popover/Popover.Component';
import { Inputs } from '../Inputs/Inputs.Component';
import './ColorPicker.Style.scss';
import { RGBAToHexA } from '../../helpers';

export const ColorPickerComponent = memo(
  ({
    value,
    onChangeComplete,
    onChange,
    onInputChanged,
    isDisabled,
    isDisabledInput,
    idRef,
    label,
    themeClass,
    labelValue,
    inputPlaceholder,
    isSubmitted,
    helperText,
    error,
    tabIndex,
    inlineLabel,
    inlineLabelIcon,
    inlineLabelClasses,
    isRequired,
    isLoading,
    parentTranslationPath,
    translationPath,
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const colorPickerPopoverCloseHandler = useCallback(() => {
      setPopoverAttachedWith(null);
    }, []);
    const colorPickerToggleHandler = useCallback((event) => {
      setPopoverAttachedWith(event.target);
    }, []);
    useEffect(() => {
      if (!popoverAttachedWith && value !== localValue) setLocalValue(value);
    }, [localValue, popoverAttachedWith, value]);

    return (
      <div className="color-picker-wrapper">
        <Inputs
          idRef={idRef}
          value={localValue}
          labelValue={labelValue}
          label={label}
          tabIndex={tabIndex}
          themeClass={themeClass}
          inlineLabel={inlineLabel}
          inlineLabelIcon={inlineLabelIcon}
          inlineLabelClasses={inlineLabelClasses}
          inputPlaceholder={inputPlaceholder}
          endAdornment={
            <ButtonBase
              className="btns-icon theme-transparent color-picker-btn mx-2"
              style={{
                color: localValue,
              }}
              disabled={isDisabled}
              onClick={colorPickerToggleHandler}
            >
              <span className="fas fa-eye-dropper" />
            </ButtonBase>
          }
          error={error}
          helperText={helperText}
          isSubmitted={isSubmitted}
          isRequired={isRequired}
          isLoading={isLoading}
          isDisabled={isDisabled || isDisabledInput}
          onInputChanged={(event) => {
            const { target } = event;
            if (onInputChanged) {
              setLocalValue(target.value);
              onInputChanged(target.value);
            }
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <PopoverComponent
          idRef={`colorPickerPopoverRef${idRef}`}
          attachedWith={popoverAttachedWith}
          handleClose={colorPickerPopoverCloseHandler}
          component={
            <SketchPicker
              id={`colorPickerRef${idRef}`}
              color={localValue}
              onChange={(newValue) => {
                const localNewValue = {
                  ...newValue,
                  hexA: RGBAToHexA(newValue.rgb),
                };
                setLocalValue(localNewValue.hexA);

                if (onChange) onChange(localNewValue);
              }}
              onChangeComplete={
                (onChangeComplete
                  && ((newValue) => {
                    const localNewValue = {
                      ...newValue,
                      hexA: RGBAToHexA(newValue.rgb),
                    };
                    onChangeComplete(localNewValue);
                  }))
                || undefined
              }
            />
          }
        />
      </div>
    );
  },
);

ColorPickerComponent.displayName = 'ColorPickerComponent';

ColorPickerComponent.propTypes = {
  value: PropTypes.string,
  onChangeComplete: PropTypes.func,
  onChange: PropTypes.func,
  onInputChanged: PropTypes.func,
  idRef: PropTypes.string,
  themeClass: PropTypes.string,
  labelValue: PropTypes.string,
  label: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  isDisabledInput: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isRequired: PropTypes.bool,
  isLoading: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  tabIndex: PropTypes.number,
  inlineLabel: PropTypes.string,
  inlineLabelIcon: PropTypes.string,
  inlineLabelClasses: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
ColorPickerComponent.defaultProps = {
  value: undefined,
  onChangeComplete: undefined,
  onChange: undefined,
  onInputChanged: undefined,
  idRef: 'ColorPickerComponentRef',
  themeClass: undefined,
  labelValue: undefined,
  label: undefined,
  tabIndex: undefined,
  inputPlaceholder: undefined,
  isDisabled: false,
  isDisabledInput: false,
  isSubmitted: false,
  isRequired: false,
  isLoading: false,
  helperText: undefined,
  error: false,
  inlineLabel: undefined,
  inlineLabelIcon: undefined,
  inlineLabelClasses: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
};

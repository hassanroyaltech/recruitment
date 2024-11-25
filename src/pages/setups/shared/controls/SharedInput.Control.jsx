/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 */
import React, { memo, useEffect, useState, useTransition } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../components';
import { floatHandler } from '../../../../helpers';
import './SharedControls.Style.scss';

export const SharedInputControl = memo(
  ({
    editValue,
    onInputBlur,
    onValueChanged,
    onKeyDown,
    stateKey,
    parentId,
    subParentId,
    subSubParentId,
    subSubParentIndex,
    parentIndex,
    subParentIndex,
    multiline,
    rows,
    isDisabled,
    isLoading,
    isRequired,
    idRef,
    title,
    labelValue,
    placeholder,
    errors,
    errorPath,
    type,
    min,
    max,
    tabIndex,
    floatNumbers,
    isSubmitted,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    endAdornment,
    startAdornment,
    pattern,
    parentTranslationPath,
    translationPath,
    wrapperClasses,
    inputWrapperClasses,
    themeClass,
    isReadOnly,
    onInputClick,
    step,
    InputLabelProps,
    isNotCenter,
    inlineLabel,
    inlineLabelIcon,
    inlineLabelClasses,
    executeOnInputBlur,
    textFieldWrapperClasses,
    fieldClasses,
    innerInputWrapperClasses,
    autoComplete,
  }) => {
    const [localValue, setLocalValue] = useState(
      editValue || editValue === 0 ? editValue : '',
    );
    const [, startTransition] = useTransition();

    // this to update localValue on parent changed
    useEffect(() => {
      setLocalValue(editValue || editValue === 0 ? editValue : '');
    }, [editValue]);

    return (
      <div
        className={`shared-input-wrapper${
          (wrapperClasses && ` ${wrapperClasses}`) || ''
        }${(isFullWidth && ' is-full-width') || ''}${
          (isTwoThirdsWidth && ' is-two-thirds-width') || ''
        }${(isHalfWidth && ' is-half-width') || ''}${
          (isQuarterWidth && ' is-quarter-width') || ''
        } shared-control-wrapper`}
      >
        <Inputs
          autoComplete={autoComplete}
          idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
            subParentId || ''
          }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
            subParentIndex || 0
          }-${stateKey}`}
          value={localValue}
          themeClass={themeClass}
          isDisabled={isDisabled}
          wrapperClasses={inputWrapperClasses}
          label={title}
          pattern={pattern}
          labelValue={labelValue}
          inlineLabel={inlineLabel}
          inlineLabelIcon={inlineLabelIcon}
          inlineLabelClasses={inlineLabelClasses}
          // defaultValue={defaultValue}
          multiline={multiline}
          rows={rows}
          inputPlaceholder={
            placeholder || placeholder === '' ? placeholder : title || labelValue
          }
          type={type}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          error={
            (errorPath && errors[errorPath] && errors[errorPath].error) || undefined
          }
          helperText={
            (errorPath && errors[errorPath] && errors[errorPath].message)
            || undefined
          }
          max={max}
          min={min}
          startAdornment={startAdornment}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          endAdornment={endAdornment}
          tabIndex={tabIndex}
          onKeyDown={onKeyDown}
          onInputBlur={(event) => {
            let { value } = event.target;
            if (type === 'number') {
              if ((floatNumbers || floatNumbers === 0) && (value || value === 0))
                value = +floatHandler(value, floatNumbers);
              if ((min || min === 0) && (value || value === 0) && +value < min)
                value = min;
              if ((max || max === 0) && (value || value === 0) && +value > max)
                value = max;
            }
            if (value === editValue && !executeOnInputBlur) return;
            if (onInputBlur)
              onInputBlur({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                subSubParentId,
                subSubParentIndex,
                id: stateKey,
                value: value || value === 0 ? value : null,
              });
          }}
          onInputChanged={(event) => {
            let { value } = event.target;
            if (type === 'number') {
              if ((floatNumbers || floatNumbers === 0) && (value || value === 0))
                value = +floatHandler(value, floatNumbers);
              if ((min || min === 0) && (value || value === 0) && +value < min)
                value = min;
              if ((max || max === 0) && (value || value === 0) && +value > max)
                value = max;
              if (value) value = +value;
            }
            setLocalValue(value);
            if (onValueChanged)
              startTransition(() => {
                onValueChanged({
                  parentId,
                  parentIndex,
                  subParentId,
                  subParentIndex,
                  subSubParentId,
                  subSubParentIndex,
                  id: stateKey,
                  value: value || value === 0 ? value : null,
                });
              });
          }}
          isReadOnly={isReadOnly}
          onInputClick={onInputClick}
          step={step}
          InputLabelProps={InputLabelProps}
          isNotCenter={isNotCenter}
          textFieldWrapperClasses={textFieldWrapperClasses}
          fieldClasses={fieldClasses}
          innerInputWrapperClasses={innerInputWrapperClasses}
        />
      </div>
    );
  },
);

SharedInputControl.displayName = 'SharedInputControl';

SharedInputControl.propTypes = {
  editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onValueChanged: PropTypes.func,
  onKeyDown: PropTypes.func,
  onInputBlur: PropTypes.func,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  idRef: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isRequired: PropTypes.bool,
  title: PropTypes.string,
  labelValue: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  placeholder: PropTypes.string,
  errors: PropTypes.instanceOf(Object),
  errorPath: PropTypes.string,
  type: PropTypes.string,
  pattern: PropTypes.instanceOf(RegExp),
  min: PropTypes.number,
  max: PropTypes.number,
  tabIndex: PropTypes.number,
  floatNumbers: PropTypes.number,
  isSubmitted: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
  inputWrapperClasses: PropTypes.string,
  themeClass: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onInputClick: PropTypes.func,
  inlineLabel: PropTypes.string,
  inlineLabelIcon: PropTypes.string,
  inlineLabelClasses: PropTypes.string,
  step: PropTypes.number,
  InputLabelProps: PropTypes.shape({
    shrink: PropTypes.bool,
    required: PropTypes.bool,
  }),
  isNotCenter: PropTypes.bool,
  executeOnInputBlur: PropTypes.bool,
  textFieldWrapperClasses: PropTypes.string,
  fieldClasses: PropTypes.string,
  innerInputWrapperClasses: PropTypes.string,
  autoComplete: PropTypes.string,
};

SharedInputControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  onKeyDown: undefined,
  errors: {},
  errorPath: undefined,
  isSubmitted: undefined,
  isLoading: undefined,
  isDisabled: undefined,
  placeholder: undefined,
  labelValue: undefined,
  onInputBlur: undefined,
  tabIndex: undefined,
  title: undefined,
  parentIndex: undefined,
  subParentIndex: undefined,
  subParentId: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  parentId: undefined,
  type: undefined,
  min: undefined,
  max: undefined,
  floatNumbers: undefined,
  isRequired: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  isQuarterWidth: undefined,
  startAdornment: undefined,
  endAdornment: undefined,
  multiline: undefined,
  pattern: undefined,
  rows: undefined,
  translationPath: '',
  wrapperClasses: undefined,
  inputWrapperClasses: undefined,
  themeClass: 'theme-solid',
  idRef: 'SharedInputControlRef',
  isReadOnly: undefined,
  onInputClick: undefined,
  step: undefined,
  InputLabelProps: undefined,
  isNotCenter: undefined,
  inlineLabel: undefined,
  inlineLabelIcon: undefined,
  inlineLabelClasses: undefined,
  executeOnInputBlur: undefined,
  innerInputWrapperClasses: '',
  fieldClasses: undefined,
};

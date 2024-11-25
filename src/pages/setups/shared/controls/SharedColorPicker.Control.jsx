/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 */
import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ColorPickerComponent } from '../../../../components';
import './SharedControls.Style.scss';

export const SharedColorPickerControl = memo(
  ({
    editValue,
    onValueChanged,
    stateKey,
    parentId,
    subParentId,
    subSubParentId,
    subSubParentIndex,
    parentIndex,
    subParentIndex,
    isDisabled,
    isLoading,
    isRequired,
    idRef,
    title,
    labelValue,
    errors,
    errorPath,
    tabIndex,
    isSubmitted,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    parentTranslationPath,
    translationPath,
    wrapperClasses,
    themeClass,
    inlineLabel,
    inlineLabelIcon,
    inlineLabelClasses,
  }) => {
    const [localValue, setLocalValue] = useState(
      editValue || editValue === 0 ? editValue : '',
    );
    const timerRef = useRef(null);

    // this to update localValue on parent changed
    useEffect(() => {
      if (!timerRef.current)
        setLocalValue(editValue || editValue === 0 ? editValue : '');
    }, [editValue]);

    // to prevent memory leak if component destroyed before time finish
    useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      [],
    );

    return (
      <div
        className={`shared-color-picker-wrapper${
          (wrapperClasses && ` ${wrapperClasses}`) || ''
        }${(isFullWidth && ' is-full-width') || ''}${
          (isTwoThirdsWidth && ' is-two-thirds-width') || ''
        }${(isHalfWidth && ' is-half-width') || ''}${
          (isQuarterWidth && ' is-quarter-width') || ''
        } shared-control-wrapper`}
      >
        <ColorPickerComponent
          idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
            subParentId || ''
          }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
            subParentIndex || 0
          }-${stateKey}`}
          value={localValue}
          error={
            (errorPath && errors[errorPath] && errors[errorPath].error) || undefined
          }
          helperText={
            (errorPath && errors[errorPath] && errors[errorPath].message)
            || undefined
          }
          themeClass={themeClass}
          labelValue={labelValue}
          label={title}
          isRequired={isRequired}
          isLoading={isLoading}
          tabIndex={tabIndex}
          inlineLabel={inlineLabel}
          inlineLabelIcon={inlineLabelIcon}
          inlineLabelClasses={inlineLabelClasses}
          inputPlaceholder={title}
          isDisabledInput
          isDisabled={isDisabled}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChangeComplete={(newValue) => {
            if (onValueChanged)
              onValueChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                subSubParentId,
                subSubParentIndex,
                id: stateKey,
                value: (newValue && newValue.hexA) || null,
              });
          }}
        />
      </div>
    );
  },
);

SharedColorPickerControl.displayName = 'SharedColorPickerControl';

SharedColorPickerControl.propTypes = {
  editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onValueChanged: PropTypes.func,
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
  errors: PropTypes.instanceOf(Object),
  errorPath: PropTypes.string,
  tabIndex: PropTypes.number,
  isSubmitted: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
  themeClass: PropTypes.string,
  inlineLabel: PropTypes.string,
  inlineLabelIcon: PropTypes.string,
  inlineLabelClasses: PropTypes.string,
};

SharedColorPickerControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  errors: {},
  errorPath: undefined,
  isSubmitted: undefined,
  isLoading: undefined,
  isDisabled: undefined,
  labelValue: undefined,
  tabIndex: undefined,
  title: undefined,
  parentIndex: undefined,
  subParentIndex: undefined,
  subParentId: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  parentId: undefined,
  isRequired: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  isQuarterWidth: undefined,
  translationPath: '',
  wrapperClasses: undefined,
  themeClass: 'theme-solid',
  idRef: 'SharedColorPickerControlRef',
  inlineLabel: undefined,
  inlineLabelIcon: undefined,
  inlineLabelClasses: undefined,
};

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from 'components';
import { DynamicFormTypesEnum, ReviewTypesEnum } from 'enums';
import { floatHandler, GlobalInputDelay } from 'helpers';

export const DynamicFormInputControl = ({
  controlItem,
  editValue,
  reviewType,
  onEditValueChanged,
  idRef,
  errors,
  // maxByOtherField,
  // minByOtherField,
  isSubmitted,
  isRequired,
  errorPath,
}) => {
  const [localEditValue, setLocalValue] = useState(
    editValue || editValue === 0
      ? editValue
      : controlItem.type === DynamicFormTypesEnum.number.key
        ? null
        : '',
  );
  useEffect(() => {
    if (!timerRef.current && (editValue || editValue === 0) && !localEditValue)
      setLocalValue(editValue);
  }, [editValue, localEditValue]);

  const timerRef = useRef(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  console.log({
    isRequired
  })
  return (
    <div
      className={`form-control-item-wrapper dynamic-form-input${
        (controlItem.parent_key && ' is-half-width') || ''
      }`}
    >
      <Inputs
        idRef={`${idRef}${controlItem.name}`}
        value={localEditValue}
        labelValue={controlItem.title}
        inputPlaceholder={controlItem.title}
        error={
          (((`${localEditValue}` === `${editValue}` && !timerRef.current)
            || (!localEditValue && !timerRef.current))
            && ((controlItem.parent_key
              && errors[
                `${reviewType}.${controlItem.parent_key}.${controlItem.name}`
              ]
              && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
                .error)
              || (errors[`${reviewType}.${controlItem.name}`]
                && errors[`${reviewType}.${controlItem.name}`].error)
              || (errors && errors[errorPath] && errors[errorPath].error)))
          || undefined
        }
        isSubmitted={isSubmitted}
        isRequired={isRequired}
        multiline={controlItem.is_multiple || undefined}
        rows={(controlItem.is_multiple && 4) || undefined}
        helperText={
          (controlItem.parent_key
            && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
            && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
              .message)
          || (errors[`${reviewType}.${controlItem.name}`]
            && errors[`${reviewType}.${controlItem.name}`].message)
          || (errors && errors[errorPath] && errors[errorPath].message)
          || undefined
        }
        type={
          (controlItem.type === DynamicFormTypesEnum.number.key && 'number')
          || undefined
        }
        min={
          controlItem.type === DynamicFormTypesEnum.number.key
            ? controlItem?.length?.min || 0
            : undefined
        }
        max={
          (controlItem.type === DynamicFormTypesEnum.number.key
            && controlItem?.length?.max)
          || undefined
        }
        onInputBlur={(event) => {
          const {
            target: { value },
          } = event;
          // if (controlItem.type === DynamicFormTypesEnum.number.key) {
          //   if (maxByOtherField && value > maxByOtherField) value = maxByOtherField;
          //   if (minByOtherField && value < minByOtherField) value = minByOtherField;
          // }
          if (!timerRef.current) return;
          if (onEditValueChanged) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
            onEditValueChanged({
              parentId: reviewType,
              subParentId: controlItem.parent_key || controlItem.subParentId,
              parentIndex: controlItem.parentIndex,
              id: controlItem.name,
              value:
                controlItem.type === DynamicFormTypesEnum.number.key
                  ? Number(value)
                  : value,
            });
          }
        }}
        onInputChanged={(event) => {
          let { value } = event.target;
          if (controlItem.type === DynamicFormTypesEnum.number.key) {
            value = controlItem?.is_flot
              ? value || null
              : floatHandler(
                value,
                controlItem.max_float ? controlItem.max_float : 0,
              );
            if (value && value < 0) value = 0;
          }
          if (controlItem.type === DynamicFormTypesEnum.text.key && value)
            if (
              (controlItem.max || controlItem.max === 0)
              && value.length > controlItem.max
            )
              value = value.substring(0, controlItem.max);
          if (controlItem.name === 'postcode' && value) {
            if (isNaN(value)) return;
            value = floatHandler(
              value,
              controlItem.max_float ? controlItem.max_float : 0,
            );
            if (value > 9999999999) value = 9999999999;
          }
          if (value === localEditValue) return;
          setLocalValue(value);
          if (onEditValueChanged) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              onEditValueChanged({
                parentId: reviewType,
                subParentId: controlItem.parent_key || controlItem.subParentId,
                parentIndex: controlItem.parentIndex,
                id: controlItem.name,
                value:
                  controlItem.type === DynamicFormTypesEnum.number.key
                    ? Number(value)
                    : value,
              });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

DynamicFormInputControl.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  controlItem: PropTypes.instanceOf(Object).isRequired,
  editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  // maxByOtherField: PropTypes.number,
  // minByOtherField: PropTypes.number,
  reviewType: PropTypes.oneOf(Object.values(ReviewTypesEnum).map((item) => item.key))
    .isRequired,
  onEditValueChanged: PropTypes.func.isRequired,
  idRef: PropTypes.string,
  errorPath: PropTypes.string,
};
DynamicFormInputControl.defaultProps = {
  idRef: 'DynamicFormInputControl',
  editValue: null,
  // maxByOtherField: undefined,
  // minByOtherField: undefined,
};

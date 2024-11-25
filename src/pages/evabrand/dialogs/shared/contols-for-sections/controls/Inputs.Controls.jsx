import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../components';
import { GlobalInputDelay } from '../../../../../../helpers';
// this component is to prevent repeating the code
// and also to make sure that the inputs shared between
// all fields are ready to call with less amount of coding
export const InputsControls = ({
  editValue,
  onValueChanged,
  isSubmitted,
  stateKey,
  parentId,
  subParentId,
  idRef,
  errors,
  isHalfWidth,
  title,
  placeholder,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(editValue);
  const timerRef = useRef(null);
  useEffect(() => {
    if (localValue !== editValue && !timerRef.current) setLocalValue(editValue);
  }, [editValue, localValue]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <div
      className={`input-controls-wrapper controls-wrapper${
        (isHalfWidth && ' is-half-width') || ''
      }`}
    >
      <Inputs
        idRef={`${idRef}${stateKey}`}
        value={localValue}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={placeholder || title}
        error={
          (errors[
            (parentId
              && ((subParentId && `${parentId}.${subParentId}.${stateKey}`)
                || `${parentId}.${stateKey}`))
              || stateKey
          ]
            && errors[
              (parentId
                && ((subParentId && `${parentId}.${subParentId}.${stateKey}`)
                  || `${parentId}.${stateKey}`))
                || stateKey
            ].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[
            (parentId
              && ((subParentId && `${parentId}.${subParentId}.${stateKey}`)
                || `${parentId}.${stateKey}`))
              || stateKey
          ]
            && errors[
              (parentId
                && ((subParentId && `${parentId}.${subParentId}.${stateKey}`)
                  || `${parentId}.${stateKey}`))
                || stateKey
            ].message)
          || undefined
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onInputBlur={(event) => {
          const { value } = event.target;
          if (onValueChanged)
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
              onValueChanged({
                parentId,
                subParentId,
                id: stateKey,
                value: value || null,
              });
            }
        }}
        onInputChanged={(event) => {
          const { value } = event.target;
          setLocalValue(value);
          if (onValueChanged) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              onValueChanged({
                parentId,
                subParentId,
                id: stateKey,
                value: value || null,
              });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

InputsControls.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  isHalfWidth: PropTypes.bool,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
InputsControls.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  placeholder: undefined,
  parentId: undefined,
  subParentId: undefined,
  idRef: 'InputsControlsRef',
  isHalfWidth: false,
};

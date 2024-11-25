import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../components';
import { GlobalInputDelay } from '../../../../../../../helpers';

export const CategoriesInputControl = ({
  editValue,
  onValueChanged,
  title,
  placeholder,
  isSubmitted,
  parentId,
  subParentId,
  index,
  stateKey,
  errors,
  idRef,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState('');
  const timerRef = useRef(null);
  useEffect(() => {
    if (!timerRef.current && editValue !== localValue) setLocalValue(editValue);
  }, [editValue, localValue]);
  return (
    <div className="categories-input-control control-wrapper">
      <Inputs
        idRef={`${idRef}${index + 1}`}
        value={localValue || ''}
        parentTranslationPath={parentTranslationPath}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={placeholder}
        translationPath={translationPath}
        error={
          (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
              .error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
              .message)
          || undefined
        }
        onInputBlur={(event) => {
          const {
            target: { value },
          } = event;
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            if (onValueChanged)
              onValueChanged({
                parentId,
                subParentId,
                index,
                id: stateKey,
                value,
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
                index,
                id: stateKey,
                value,
              });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

CategoriesInputControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
CategoriesInputControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'CategoriesInputControlRef',
};

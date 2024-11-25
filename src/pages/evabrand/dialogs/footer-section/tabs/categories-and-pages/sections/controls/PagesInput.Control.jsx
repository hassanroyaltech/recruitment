import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../../components';
import { GlobalInputDelay } from '../../../../../../../../helpers';

export const PagesInputControl = ({
  pages,
  editValue,
  onValueChanged,
  title,
  placeholder,
  isSubmitted,
  parentId,
  subParentId,
  subSubParentId,
  categoryIndex,
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
    <div className="pages-input-control control-wrapper">
      <Inputs
        idRef={`${idRef}${categoryIndex + 1}-${index + 1}`}
        value={localValue || ''}
        parentTranslationPath={parentTranslationPath}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={placeholder}
        translationPath={translationPath}
        error={
          (errors[
            parentId
              && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
          ]
            && errors[
              parentId
                && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
            ].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[
            parentId
              && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
          ]
            && errors[
              parentId
                && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
            ].message)
          || undefined
        }
        onInputBlur={(event) => {
          const {
            target: { value },
          } = event;
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            const localPages = [...(pages || [])];
            if (!localPages[index]) localPages[index] = {};
            localPages[index][stateKey] = value;
            onValueChanged({
              parentId,
              subParentId,
              index: categoryIndex,
              id: subSubParentId,
              value: localPages,
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
              const localPages = [...(pages || [])];
              if (!localPages[index]) localPages[index] = {};
              localPages[index][stateKey] = value;
              onValueChanged({
                parentId,
                subParentId,
                index: categoryIndex,
                id: subSubParentId,
                value: localPages,
              });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

PagesInputControl.propTypes = {
  pages: PropTypes.instanceOf(Array),
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  subSubParentId: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
PagesInputControl.defaultProps = {
  pages: [],
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'PagesInputControlRef',
};

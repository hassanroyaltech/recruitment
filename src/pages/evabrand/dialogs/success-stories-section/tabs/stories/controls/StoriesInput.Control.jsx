import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../components';
import { GlobalInputDelay } from '../../../../../../../helpers';

export const StoriesInputControl = ({
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
  isMediaInput,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(editValue);
  const timerRef = useRef(null);
  useEffect(() => {
    if (!timerRef.current && editValue !== localValue) setLocalValue(editValue);
  }, [editValue, localValue]);
  return (
    <div
      className={`stories-input-control control-wrapper${
        (isMediaInput && ' w-100') || ''
      }`}
    >
      <Inputs
        idRef={`${idRef}${index + 1}`}
        value={localValue || ''}
        parentTranslationPath={parentTranslationPath}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={placeholder}
        translationPath={translationPath}
        error={
          (errors[
            parentId
              && `${parentId}.${subParentId}[${index}].${stateKey}${
                (isMediaInput && '.url') || ''
              }`
          ]
            && errors[
              parentId
                && `${parentId}.${subParentId}[${index}].${stateKey}${
                  (isMediaInput && '.url') || ''
                }`
            ].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[
            parentId
              && `${parentId}.${subParentId}[${index}].${stateKey}${
                (isMediaInput && '.url') || ''
              }`
          ]
            && errors[
              parentId
                && `${parentId}.${subParentId}[${index}].${stateKey}${
                  (isMediaInput && '.url') || ''
                }`
            ].message)
          || undefined
        }
        onInputBlur={(event) => {
          const {
            target: { value },
          } = event;
          const localMedia = {
            uuid: null,
            url: value || null,
            type: null,
          };
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            if (onValueChanged)
              onValueChanged({
                parentId,
                subParentId,
                index,
                id: stateKey,
                value: (isMediaInput && localMedia) || value,
              });
          }
        }}
        onInputChanged={(event) => {
          const { value } = event.target;
          setLocalValue(value);
          const localMedia = {
            uuid: null,
            url: value || null,
            type: null,
          };
          if (onValueChanged) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              onValueChanged({
                parentId,
                subParentId,
                index,
                id: stateKey,
                value: (isMediaInput && localMedia) || value,
              });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

StoriesInputControl.propTypes = {
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
  isMediaInput: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
StoriesInputControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  isMediaInput: undefined,
  idRef: 'PartnersInputControlRef',
};

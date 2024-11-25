import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../components';
import { GlobalInputDelay } from '../../../../../../../helpers';

export const MediasInputControl = ({
  editValue,
  onValueChanged,
  idRef,
  title,
  placeholder,
  isSubmitted,
  parentId,
  subParentId,
  index,
  stateKey,
  errors,
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
    <div className="input-controls-wrapper control-wrapper">
      <Inputs
        idRef={`${idRef}-${index}${stateKey}`}
        value={localValue}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={placeholder}
        error={
          (errors[
            (subParentId
              && `${parentId}.${subParentId}[${index}].${stateKey}.url`)
              || `${parentId}.${stateKey}`
          ]
            && errors[
              (subParentId
                && `${parentId}.${subParentId}[${index}].${stateKey}.url`)
                || `${parentId}.${stateKey}`
            ].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[
            (subParentId
              && `${parentId}.${subParentId}[${index}].${stateKey}.url`)
              || `${parentId}.${stateKey}`
          ]
            && errors[
              (subParentId
                && `${parentId}.${subParentId}[${index}].${stateKey}.url`)
                || `${parentId}.${stateKey}`
            ].message)
          || undefined
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onInputBlur={(event) => {
          const { value } = event.target;
          const localMedia = {
            uuid: null,
            url: value || null,
            type: null,
          };
          if (onValueChanged)
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
              onValueChanged({
                parentId,
                subParentId,
                index,
                id: stateKey,
                value: localMedia,
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
                value: localMedia,
              });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

MediasInputControl.propTypes = {
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
MediasInputControl.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'MediasInputControlRef',
};

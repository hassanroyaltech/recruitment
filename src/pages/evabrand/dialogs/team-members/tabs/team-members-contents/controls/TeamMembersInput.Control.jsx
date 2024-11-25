import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../components';
import { GlobalInputDelay } from '../../../../../../../helpers';

export const TeamMembersInputControl = ({
  editValue,
  onValueChanged,
  title,
  placeholder,
  isSubmitted,
  parentId,
  stateKey,
  errors,
  idRef,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState(editValue);
  const timerRef = useRef(null);
  useEffect(() => {
    if (!timerRef.current && editValue !== localValue) setLocalValue(editValue);
  }, [editValue, localValue]);
  return (
    <div className="team-members-input-control control-wrapper">
      <Inputs
        idRef={idRef}
        value={localValue}
        parentTranslationPath={parentTranslationPath}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={placeholder}
        translationPath={translationPath}
        error={
          (errors[parentId && `${parentId}.${stateKey}`]
            && errors[parentId && `${parentId}.${stateKey}`].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[parentId && `${parentId}.${stateKey}`]
            && errors[parentId && `${parentId}.${stateKey}`].message)
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

TeamMembersInputControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TeamMembersInputControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  idRef: 'TeamMembersInputControlRef',
};

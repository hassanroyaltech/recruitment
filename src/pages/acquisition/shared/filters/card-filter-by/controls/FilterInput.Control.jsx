import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../components';
import { GlobalInputDelay } from '../../../../../../helpers';

export const FilterInputControl = ({
  onValueChanged,
  stateKey,
  isDisabled,
  idRef,
  title,
  placeholder,
  parentTranslationPath,
  translationPath,
}) => {
  const [localValue, setLocalValue] = useState('');
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <div className="mb-2">
      <Inputs
        idRef={`${idRef}${stateKey}`}
        value={localValue}
        themeClass="theme-solid"
        isDisabled={isDisabled}
        label={title}
        inputPlaceholder={placeholder || title}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onInputBlur={(event) => {
          const { value } = event.target;
          if (onValueChanged)
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
              onValueChanged({
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

FilterInputControl.propTypes = {
  onValueChanged: PropTypes.func,
  stateKey: PropTypes.string.isRequired,
  idRef: PropTypes.string,
  isDisabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

FilterInputControl.defaultProps = {
  onValueChanged: undefined,
  isDisabled: undefined,
  placeholder: undefined,
  idRef: 'FilterInputControlRef',
};

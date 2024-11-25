import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalInputDelay } from '../../../../../../helpers';
import { Inputs } from '../../../../../../components/Inputs/Inputs.Component';

export const SocialMediaInputControl = ({
  editValue,
  onValueChanged,
  isSubmitted,
  stateKey,
  parentId,
  subParentId,
  socialMediaKey,
  subParentItem,
  index,
  idRef,
  errors,
  title,
  inputPlaceholder,
  parentTranslationPath,
  translationPath,
  socialMediaIcon,
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
    <div className="social-media-input-control-wrapper controls-wrapper">
      <Inputs
        idRef={`${idRef}${(parentId && index + 1) || ''}${stateKey}`}
        value={localValue}
        themeClass="theme-solid"
        label={title}
        inputPlaceholder={inputPlaceholder}
        error={
          (errors[
            (parentId
              && `${parentId}.${subParentId}[${index}].${socialMediaKey}.${stateKey}`)
              || `${socialMediaKey}.${stateKey}`
          ]
            && errors[
              (parentId
                && `${parentId}.${subParentId}[${index}].${socialMediaKey}.${stateKey}`)
                || `${socialMediaKey}.${stateKey}`
            ].error)
          || undefined
        }
        isSubmitted={isSubmitted}
        helperText={
          (errors[
            (parentId
              && `${parentId}.${subParentId}[${index}].${socialMediaKey}.${stateKey}`)
              || `${socialMediaKey}.${stateKey}`
          ]
            && errors[
              (parentId
                && `${parentId}.${subParentId}[${index}].${socialMediaKey}.${stateKey}`)
                || `${socialMediaKey}.${stateKey}`
            ].message)
          || undefined
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        startAdornment={
          <div className="start-adornment-wrapper">
            <span className={`${socialMediaIcon} fz-22px`} />
          </div>
        }
        onInputBlur={(event) => {
          const { value } = event.target;
          const localSubParentItem = (parentId && {
            ...subParentItem,
            [socialMediaKey]: { ...subParentItem[socialMediaKey] },
          }) || { ...subParentItem[socialMediaKey] };
          if (parentId) localSubParentItem[socialMediaKey][stateKey] = value;
          else localSubParentItem[stateKey] = value;
          if (onValueChanged)
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
              if (parentId)
                onValueChanged({
                  parentId,
                  subParentId,
                  index,
                  value: localSubParentItem,
                });
              else
                onValueChanged({
                  id: socialMediaKey,
                  value: localSubParentItem,
                });
            }
        }}
        onInputChanged={(event) => {
          const { value } = event.target;
          setLocalValue(value);
          const localSubParentItem = (parentId && {
            ...subParentItem,
            [socialMediaKey]: { ...subParentItem[socialMediaKey] },
          }) || { ...subParentItem[socialMediaKey] };
          if (parentId) localSubParentItem[socialMediaKey][stateKey] = value;
          else localSubParentItem[stateKey] = value;
          if (onValueChanged) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              if (parentId)
                onValueChanged({
                  parentId,
                  subParentId,
                  index,
                  value: localSubParentItem,
                });
              else
                onValueChanged({
                  id: socialMediaKey,
                  value: localSubParentItem,
                });
            }, GlobalInputDelay);
          }
        }}
      />
    </div>
  );
};

SocialMediaInputControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  socialMediaKey: PropTypes.string.isRequired,
  subParentItem: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  socialMediaIcon: PropTypes.string.isRequired,
};
SocialMediaInputControl.defaultProps = {
  editValue: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'SocialMediaInputControlRef',
};

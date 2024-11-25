import React from 'react';
import PropTypes from 'prop-types';
import { ColorPickerComponent } from '../../../../../../components';

export const ColorControls = ({
  editValue,
  onValueChanged,
  isSubmitted,
  stateKey,
  parentId,
  idRef,
  errors,
  isHalfWidth,
  title,
  parentTranslationPath,
  translationPath,
}) => (
  <div
    className={`color-controls controls-wrapper${
      (isHalfWidth && ' is-half-width') || ''
    }`}
  >
    <ColorPickerComponent
      value={editValue}
      error={
        (errors[(parentId && `${parentId}.${stateKey}`) || stateKey]
          && errors[(parentId && `${parentId}.${stateKey}`) || stateKey].error)
        || undefined
      }
      idRef={idRef}
      themeClass="theme-solid"
      label={title}
      inputPlaceholder={title}
      isDisabledInput
      isSubmitted={isSubmitted}
      helperText={
        (errors[(parentId && `${parentId}.${stateKey}`) || stateKey]
          && errors[(parentId && `${parentId}.${stateKey}`) || stateKey].message)
        || undefined
      }
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChangeComplete={(newValue) => {
        if (onValueChanged)
          onValueChanged({
            parentId,
            id: stateKey,
            value: (newValue && newValue.hexA) || '',
          });
      }}
    />
  </div>
);

ColorControls.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  isHalfWidth: PropTypes.bool,
  title: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ColorControls.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  idRef: 'ColorControlsRef',
  isHalfWidth: false,
};

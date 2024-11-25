import React from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../../../components';

export const TextEditorControls = ({
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
    className={`text-editor-controls controls-wrapper${
      (isHalfWidth && ' is-half-width') || ''
    }`}
  >
    <TextEditorComponent
      editorValue={editValue}
      idRef={idRef}
      labelValue={title}
      isSubmitted={isSubmitted}
      helperText={
        (errors[(parentId && `${parentId}.${stateKey}`) || stateKey]
          && errors[(parentId && `${parentId}.${stateKey}`) || stateKey].message)
        || undefined
      }
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      height={155}
      menubar={false}
      onEditorDelayedChange={(content) => {
        if (onValueChanged)
          onValueChanged({
            parentId,
            id: stateKey,
            value: content || '',
          });
      }}
    />
  </div>
);

TextEditorControls.propTypes = {
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
TextEditorControls.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  idRef: 'TextEditorControlsRef',
  isHalfWidth: false,
};

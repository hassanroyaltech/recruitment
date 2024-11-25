import React from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../../../../components';

export const ImagesTextEditorControl = ({
  editValue,
  onValueChanged,
  idRef,
  title,
  isSubmitted,
  parentId,
  subParentId,
  index,
  stateKey,
  errors,
  parentTranslationPath,
  translationPath,
}) => (
  <div className="images-text-editor-control-wrapper control-wrapper">
    <TextEditorComponent
      editorValue={editValue}
      idRef={(subParentId && `${idRef}${index + 1}`) || idRef}
      labelValue={title}
      isSubmitted={isSubmitted}
      helperText={
        (errors[
          (subParentId && `${parentId}.${subParentId}[${index}].${stateKey}`)
            || `${parentId}.${stateKey}`
        ]
          && errors[
            (subParentId && `${parentId}.${subParentId}[${index}].${stateKey}`)
              || `${parentId}.${stateKey}`
          ].message)
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
            subParentId,
            index,
            id: stateKey,
            value: content || '',
          });
      }}
    />
  </div>
);

ImagesTextEditorControl.propTypes = {
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
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesTextEditorControl.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'ImagesTextEditorControl',
};

import React from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../../../../components';

export const CategoriesTextEditorControl = ({
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
  <div className="categories-text-editor-control-wrapper control-wrapper">
    <TextEditorComponent
      editorValue={editValue}
      idRef={`${idRef}${index + 1}`}
      labelValue={title}
      isSubmitted={isSubmitted}
      helperText={
        (errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
          && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            .message)
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

CategoriesTextEditorControl.propTypes = {
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
CategoriesTextEditorControl.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'CategoriesTextEditorControlRef',
};

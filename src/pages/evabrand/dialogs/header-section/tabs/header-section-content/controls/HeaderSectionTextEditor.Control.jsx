import React from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../../../../components';

export const HeaderSectionTextEditorControl = ({
  editValue,
  onValueChanged,
  idRef,
  title,
  isSubmitted,
  parentId,
  stateKey,
  errors,
  parentTranslationPath,
  translationPath,
}) => (
  <div className="header-section-text-editor-control-wrapper control-wrapper">
    <TextEditorComponent
      editorValue={editValue}
      idRef={`${idRef}`}
      labelValue={title}
      isSubmitted={isSubmitted}
      helperText={
        (errors[`${parentId}.${stateKey}`]
          && errors[`${parentId}.${stateKey}`].message)
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

HeaderSectionTextEditorControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
HeaderSectionTextEditorControl.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  idRef: 'HeaderSectionTextEditorRef',
};

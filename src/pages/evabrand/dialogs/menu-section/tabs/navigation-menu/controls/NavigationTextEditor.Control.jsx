import React from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../../../../components';

export const NavigationTextEditorControl = ({
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
  subParentIndex,
  wrapperClasses,
}) => (
  <div
    className={`navigation-text-editor-control-wrapper control-wrapper ${
      wrapperClasses ? wrapperClasses : ''
    }`}
  >
    <TextEditorComponent
      editorValue={editValue}
      idRef={`${idRef}${index + 1}`}
      labelValue={title}
      isSubmitted={isSubmitted}
      helperText={
        (errors[
          parentId && `${parentId}.${subParentId}[${subParentIndex}].${stateKey}`
        ]
          && errors[
            parentId && `${parentId}.${subParentId}[${subParentIndex}].${stateKey}`
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
            subParentIndex,
          });
      }}
    />
  </div>
);

NavigationTextEditorControl.propTypes = {
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
  subParentIndex: PropTypes.number,
  wrapperClasses: PropTypes.string,
};
NavigationTextEditorControl.defaultProps = {
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'NavigationTextEditorControlRef',
};

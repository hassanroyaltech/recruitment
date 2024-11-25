import React from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../../../../../components';

export const PagesTextEditorControl = ({
  pages,
  editValue,
  onValueChanged,
  idRef,
  title,
  isSubmitted,
  parentId,
  subParentId,
  subSubParentId,
  categoryIndex,
  index,
  stateKey,
  errors,
  parentTranslationPath,
  translationPath,
}) => (
  <div className="pages-text-editor-control-wrapper control-wrapper">
    <TextEditorComponent
      editorValue={editValue}
      idRef={`${idRef}${categoryIndex + 1}-${index + 1}`}
      labelValue={title}
      isSubmitted={isSubmitted}
      helperText={
        (errors[
          parentId
            && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
        ]
          && errors[
            parentId
              && `${parentId}.${subParentId}[${categoryIndex}].${subSubParentId}[${index}].${stateKey}`
          ].message)
        || undefined
      }
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      height={155}
      menubar={false}
      onEditorDelayedChange={(content) => {
        const localPages = [...(pages || [])];
        if (!localPages[index]) localPages[index] = {};
        localPages[index][stateKey] = content || '';
        if (onValueChanged)
          onValueChanged({
            parentId,
            subParentId,
            index: categoryIndex,
            id: subSubParentId,
            value: localPages,
          });
      }}
    />
  </div>
);

PagesTextEditorControl.propTypes = {
  pages: PropTypes.instanceOf(Array),
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  subSubParentId: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
PagesTextEditorControl.defaultProps = {
  pages: [],
  editValue: '',
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'PagesTextEditorControlRef',
};

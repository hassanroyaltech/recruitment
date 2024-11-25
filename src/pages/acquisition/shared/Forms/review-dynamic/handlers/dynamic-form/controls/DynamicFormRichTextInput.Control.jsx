import React from 'react';
import PropTypes from 'prop-types';

import { ReviewTypesEnum } from 'enums';

import { SharedTextEditorControl } from '../../../../../../../setups/shared';

export const DynamicFormRichTextInputControl = ({
  controlItem,
  editValue,
  onEditValueChanged,
  idRef,
  errors,
  isSubmitted,
  isRequired,
  errorPath,
}) => (
  <SharedTextEditorControl
    isFullWidth
    idRef={`text-editor-${idRef || ''}${controlItem.title}`}
    labelValue={controlItem.title}
    editValue={editValue || ''}
    isSubmitted={isSubmitted}
    isRequired={isRequired}
    errorPath={errorPath}
    errors={errors}
    height={150}
    onValueChanged={onEditValueChanged}
  />
);

DynamicFormRichTextInputControl.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  controlItem: PropTypes.instanceOf(Object).isRequired,
  editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  reviewType: PropTypes.oneOf(Object.values(ReviewTypesEnum).map((item) => item.key))
    .isRequired,
  onEditValueChanged: PropTypes.func.isRequired,
  idRef: PropTypes.string,
  errorPath: PropTypes.string,
};
DynamicFormRichTextInputControl.defaultProps = {
  idRef: 'DynamicFormRichTextInputControl',
  editValue: null,
};

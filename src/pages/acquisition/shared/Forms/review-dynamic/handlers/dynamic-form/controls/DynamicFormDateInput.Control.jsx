import React from 'react';
import PropTypes from 'prop-types';

import { ReviewTypesEnum } from 'enums';
import { GlobalDateFormat } from 'helpers';
import DatePickerComponent from '../../../../../../../../components/Datepicker/DatePicker.Component';

export const DynamicFormDateInputControl = ({
  controlItem,
  editValue,
  reviewType,
  onEditValueChanged,
  idRef,
  errors,
  isSubmitted,
  isRequired,
  errorPath,
}) => (
  <DatePickerComponent
    isFullWidth
    idRef={`${idRef}${controlItem.name}`}
    labelValue={controlItem.title}
    inputPlaceholder={controlItem.title}
    value={editValue || ''}
    errors={errors}
    isSubmitted={isSubmitted}
    isRequired={isRequired}
    displayFormat={GlobalDateFormat}
    // disableMaskedInput
    errorPath={errorPath}
    stateKey={controlItem.name}
    subParentId={controlItem.subParentId}
    parentId={reviewType}
    parentIndex={controlItem.parentIndex}
    onDelayedChange={onEditValueChanged}
  />
);

DynamicFormDateInputControl.propTypes = {
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
DynamicFormDateInputControl.defaultProps = {
  idRef: 'DynamicFormDateInputControl',
  editValue: null,
};

import React from 'react';
import PropTypes from 'prop-types';
import { ReviewTypesEnum } from 'enums';
import { useTranslation } from 'react-i18next';
import { UploaderComponent } from '../../../../../../../../components';
import { UploaderPageEnum } from '../../../../../../../../enums/Pages/UploaderPage.Enum';

export const DynamicFormUploaderControl = ({
  controlItem,
  editValue,
  reviewType,
  onEditValueChanged,
  idRef,
  errors,
  isSubmitted,
  isRequired,
  errorPath,
}) => {
  const { t } = useTranslation('Shared');
  return (
    <div className="form-control-item-wrapper dynamic-form-input">
      <UploaderComponent
        idRef={`${idRef}${controlItem.name}`}
        uploaderPage={UploaderPageEnum.DynamicForm}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.DynamicForm.maxFileNumber
        } ${t('Shared:images-bracket')}`}
        helperText={
          (controlItem.parent_key
            && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
            && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
              .message)
          || (errors[`${reviewType}.${controlItem.name}`]
            && errors[`${reviewType}.${controlItem.name}`].message)
          || (errors && errors[errorPath] && errors[errorPath].message)
          || undefined
        }
        isSubmitted={isSubmitted}
        isRequired={isRequired}
        uploadedFiles={
          (editValue && [
            {
              uuid: editValue,
              fileName: controlItem.title,
            },
          ])
          || []
        }
        labelValue={controlItem.title}
        uploadedFileChanged={(newFiles) => {
          onEditValueChanged({
            parentId: reviewType,
            subParentId: controlItem.parent_key || controlItem.subParentId,
            parentIndex: controlItem.parentIndex,
            id: controlItem.name,
            value: (newFiles && newFiles.length > 0 && newFiles[0].uuid) || null,
          });
        }}
      />
    </div>
  );
};

DynamicFormUploaderControl.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  controlItem: PropTypes.instanceOf(Object).isRequired,
  editValue: PropTypes.oneOfType([PropTypes.string]),
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  reviewType: PropTypes.oneOf(Object.values(ReviewTypesEnum).map((item) => item.key))
    .isRequired,
  onEditValueChanged: PropTypes.func.isRequired,
  idRef: PropTypes.string,
  errorPath: PropTypes.string,
};
DynamicFormUploaderControl.defaultProps = {
  idRef: 'DynamicFormUploaderControl',
  editValue: null,
};

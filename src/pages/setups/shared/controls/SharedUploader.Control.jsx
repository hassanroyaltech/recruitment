/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../components';

export const SharedUploaderControl = memo(
  ({
    editValue,
    onValueChanged,
    idRef,
    errors,
    isSubmitted,
    stateKey,
    parentId,
    parentIndex,
    subParentId,
    subParentIndex,
    subSubParentId,
    subSubParentIndex,
    uploaderPage,
    dropHereText,
    fileTypeText,
    errorPath,
    labelValue,
    parentTranslationPath,
    translationPath,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    labelClasses,
    for_account,
    multiple,
    uploaderBtnText,
    customSingleAPIUploader,
    customAPIBody,
    customAPIParams,
    customAPIHeaders,
    customAPIUploader,
    sharedClassesWrapper,
    isDisabled,
    company_uuid,
    isRequired,
    onIsUploadingChanged,
  }) => {
    const { t } = useTranslation('Shared');
    return (
      <div
        className={`shared-uploader-wrapper${
          (sharedClassesWrapper && ` ${sharedClassesWrapper}`) || ''
        }${(isFullWidth && ' is-full-width') || ''}${
          (isTwoThirdsWidth && ' is-two-thirds-width') || ''
        }${(isHalfWidth && ' is-half-width') || ''}${
          (isQuarterWidth && ' is-quarter-width') || ''
        } shared-control-wrapper`}
      >
        <UploaderComponent
          for_account={for_account}
          idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
            subParentId || ''
          }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
            subParentIndex || 0
          }-${stateKey}`}
          uploaderPage={uploaderPage}
          customSingleAPIUploader={customSingleAPIUploader}
          customAPIUploader={customAPIUploader}
          customAPIBody={customAPIBody}
          customAPIParams={customAPIParams}
          customAPIHeaders={customAPIHeaders}
          dropHereText={
            dropHereText
            || `${t('drop-here-max')} ${uploaderPage.maxFileNumber} ${t(
              `${fileTypeText}-bracket`,
            )}`
          }
          helperText={
            (errorPath
              && errors[errorPath]
              && errors[errorPath].error
              && errors[errorPath].message)
            || undefined
          }
          isSubmitted={isSubmitted}
          isDisabled={isDisabled}
          isRequired={isRequired}
          uploadedFiles={editValue || []}
          labelValue={labelValue}
          labelClasses={labelClasses}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          uploadedFileChanged={(newFiles) => {
            onValueChanged({
              parentId,
              parentIndex,
              subParentId,
              subParentIndex,
              subSubParentId,
              subSubParentIndex,
              id: stateKey,
              value: newFiles,
            });
          }}
          multiple={multiple}
          uploaderBtnText={uploaderBtnText}
          company_uuid={company_uuid}
          onIsUploadingChanged={onIsUploadingChanged}
        />
      </div>
    );
  },
);

SharedUploaderControl.displayName = 'SharedUploaderControl';

SharedUploaderControl.propTypes = {
  onValueChanged: PropTypes.func.isRequired,
  stateKey: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Object),
  editValue: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      url: PropTypes.string,
      fileName: PropTypes.string,
    }),
  ),
  isSubmitted: PropTypes.bool,
  for_account: PropTypes.bool,
  parentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentId: PropTypes.string,
  subParentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  uploaderPage: PropTypes.oneOf(Object.values(UploaderPageEnum).map((item) => item)),
  dropHereText: PropTypes.string,
  fileTypeText: PropTypes.string,
  errorPath: PropTypes.string,
  labelValue: PropTypes.string,
  labelClasses: PropTypes.string,
  idRef: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  multiple: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  uploaderBtnText: PropTypes.string,
  sharedClassesWrapper: PropTypes.string,
  customSingleAPIUploader: PropTypes.func,
  customAPIBody: PropTypes.instanceOf(Object),
  customAPIParams: PropTypes.instanceOf(Object),
  customAPIHeaders: PropTypes.instanceOf(Object),
  customAPIUploader: PropTypes.func,
  onIsUploadingChanged: PropTypes.func,
  company_uuid: PropTypes.string,
};
SharedUploaderControl.defaultProps = {
  idRef: 'SharedUploaderControl',
  isSubmitted: undefined,
  for_account: false,
  errors: {},
  editValue: null,
  parentId: undefined,
  parentIndex: undefined,
  subParentId: undefined,
  subParentIndex: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  uploaderPage: UploaderPageEnum.DynamicForm,
  fileTypeText: 'image',
  dropHereText: undefined,
  errorPath: undefined,
  labelValue: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  isQuarterWidth: undefined,
  labelClasses: undefined,
  multiple: undefined,
  uploaderBtnText: undefined,
  sharedClassesWrapper: undefined,
  customSingleAPIUploader: undefined,
  customAPIBody: undefined,
  customAPIParams: undefined,
  customAPIHeaders: undefined,
  customAPIUploader: undefined,
  isDisabled: undefined,
  isRequired: undefined,
  company_uuid: undefined,
};

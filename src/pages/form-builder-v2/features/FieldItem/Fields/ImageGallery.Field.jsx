import * as React from 'react';
import { useCallback } from 'react';
import { UploaderPageEnum } from '../../../../../enums';

import { SharedUploaderControl } from '../../../../setups/shared';
import { ImageForPDF } from '../../../components/image-pdf-component/Image.For.PDF.Component';

const parentTranslationPath = 'FormBuilderPage';
const ImageGalleryField = React.memo(
  ({
    placeholder,
    handleSetValue,
    isSubmitted,
    preview,
    role,
    files,
    attachmentButtonLabel,
    pdfRef,
    getIsValueDisplay,
    disabled,
    fillBy,
    setIsGlobalLoading,
    type,
  }) => {
    const onUploadChanged = useCallback(
      (newValue) => {
        const localItems = [...newValue.value];
        handleSetValue(localItems);
      },
      [handleSetValue],
    );
    return (
      <div className="meet-team-field-parent onboarding-gallery">
        {!pdfRef
          && (!disabled
            || (getIsValueDisplay
              && !getIsValueDisplay({ fillBy, type, isFromField: true }))) && (
          <SharedUploaderControl
            isFullWidth
            sharedClassesWrapper="my-2"
            uploaderPage={UploaderPageEnum.OnboardingMultipleImages}
            translationPath=""
            fileTypeText="image"
            stateKey="image_uuid"
            // company_uuid={company_uuid}
            errorPath="video_uuid"
            isDisabled={disabled || preview.isActive}
            isSubmitted={isSubmitted}
            editValue={files}
            labelClasses="theme-primary"
            onValueChanged={onUploadChanged}
            parentTranslationPath={parentTranslationPath}
            uploaderBtnText={attachmentButtonLabel}
          />
        )}

        <div className="d-flex">
          {((getIsValueDisplay
            && getIsValueDisplay({ fillBy, type, isFromField: true }))
            || pdfRef)
          && files?.length > 0 ? (
              <div className="multiple-media-cont">
                {files.map((file, index) => (
                  <div
                    key={`${file.uuid}image${index}`}
                    className="onboarding-gallery-item"
                  >
                    {pdfRef ? (
                      <ImageForPDF
                        alt={file.name}
                        url={file.url}
                        setIsGlobalLoading={setIsGlobalLoading}
                        imgClasses="w-100 h-100 onboarding-img"
                      />
                    ) : (
                      <img
                        alt={file.name}
                        src={file.url}
                        loading="lazy"
                        className="w-100 h-100 onboarding-img"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : null}
        </div>
      </div>
    );
  },
);
ImageGalleryField.displayName = 'ImageGalleryField';
export default ImageGalleryField;

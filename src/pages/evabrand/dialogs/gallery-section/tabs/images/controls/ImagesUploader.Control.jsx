import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../../../../components';

export const ImagesUploaderControl = ({
  imageItem,
  onValueChanged,
  idRef,
  labelValue,
  isSubmitted,
  parentId,
  subParentId,
  index,
  urlStateKey,
  uuidStateKey,
  stateKey,
  errors,
  isSlider,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="images-uploader-control-wrapper control-wrapper">
      <UploaderComponent
        idRef={`${idRef}${index + 1}`}
        uploaderPage={UploaderPageEnum.EvaBrandImagesTab}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.EvaBrandImagesTab.maxFileNumber
        } ${t('Shared:image-bracket')}`}
        uploadedFiles={
          (imageItem
            && (imageItem[uuidStateKey] || imageItem[urlStateKey]) && [
            {
              uuid: imageItem[uuidStateKey],
              url: imageItem[urlStateKey],
              type: 'image',
              fileName: t(
                `${translationPath}${(isSlider && 'slider') || 'gallery'}-image`,
              ),
            },
          ])
          || []
        }
        label={labelValue}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isSubmitted={isSubmitted}
        helperText={
          (errors[`${parentId}.${subParentId}[${index}].${stateKey}`]
            && errors[`${parentId}.${subParentId}[${index}].${stateKey}`].message)
          || undefined
        }
        uploadedFileChanged={(newFiles) => {
          const localImages = { ...imageItem };
          localImages[uuidStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].uuid) || null;
          localImages[urlStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].url) || null;
          if (onValueChanged)
            onValueChanged({
              parentId,
              index,
              subParentId,
              id: stateKey,
              value: localImages,
            });
        }}
      />
    </div>
  );
};

ImagesUploaderControl.propTypes = {
  imageItem: PropTypes.instanceOf(Object),
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  urlStateKey: PropTypes.string.isRequired,
  uuidStateKey: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  labelValue: PropTypes.string.isRequired,
  isSlider: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesUploaderControl.defaultProps = {
  imageItem: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  onValueChanged: undefined,
  idRef: 'ImagesUploaderControlRef',
};

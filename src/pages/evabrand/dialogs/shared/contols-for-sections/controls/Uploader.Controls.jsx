import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../../../components';
import { GetMediaType } from '../../../../helpers';

export const UploaderControls = ({
  mediaItem,
  uploaderPage,
  onValueChanged,
  idRef,
  labelValue,
  isSubmitted,
  parentId,
  subParentId,
  urlStateKey,
  uuidStateKey,
  typeStateKey,
  errors,
  isHalfWidth,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div
      className={`uploader-controls controls-wrapper${
        (isHalfWidth && ' is-half-width') || ''
      }`}
    >
      <UploaderComponent
        idRef={idRef}
        uploaderPage={uploaderPage}
        dropHereText={`${t('Shared:drop-here-max')} ${
          uploaderPage.maxFileNumber
        } ${t(
          `Shared:${
            (uploaderPage.accept && uploaderPage.accept === 'image/*' && 'image')
            || 'media'
          }-bracket`,
        )}`}
        uploadedFiles={
          (mediaItem
            && (mediaItem[uuidStateKey] || mediaItem[urlStateKey]) && [
            {
              uuid: mediaItem[uuidStateKey],
              url: mediaItem[urlStateKey],
              type: GetMediaType(mediaItem[typeStateKey])?.key,
              fileName: t(
                `background-${
                  GetMediaType(mediaItem[typeStateKey])?.value || 'image'
                }`,
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
          (errors[`${parentId}.${subParentId}`]
            && errors[`${parentId}.${subParentId}`].message)
          || undefined
        }
        uploadedFileChanged={(newFiles) => {
          const localMedia = { ...(mediaItem || {}) };
          localMedia[uuidStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].uuid) || null;
          localMedia[urlStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].url) || null;
          if (onValueChanged)
            onValueChanged({
              parentId,
              id: subParentId,
              value: localMedia,
            });
        }}
      />
    </div>
  );
};

UploaderControls.propTypes = {
  mediaItem: PropTypes.instanceOf(Object),
  uploaderPage: PropTypes.oneOf(Object.values(UploaderPageEnum).map((item) => item)),
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  urlStateKey: PropTypes.string.isRequired,
  uuidStateKey: PropTypes.string.isRequired,
  typeStateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  idRef: PropTypes.string,
  isHalfWidth: PropTypes.bool,
  errors: PropTypes.instanceOf(Object).isRequired,
  labelValue: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
UploaderControls.defaultProps = {
  mediaItem: undefined,
  uploaderPage: UploaderPageEnum.EvaBrandSharedUploader,
  parentId: undefined,
  subParentId: undefined,
  onValueChanged: undefined,
  isHalfWidth: false,
  idRef: 'UploaderControlsRef',
};

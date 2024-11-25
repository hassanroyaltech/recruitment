import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderComponent } from '../../../../../../../components';
import { UploaderPageEnum } from '../../../../../../../enums/Pages/UploaderPage.Enum';
import { GetMediaType } from '../../../../../helpers';

export const MediasUploaderControl = ({
  mediaItem,
  onValueChanged,
  idRef,
  labelValue,
  isSubmitted,
  parentId,
  subParentId,
  index,
  stateKey,
  urlStateKey,
  uuidStateKey,
  typeStateKey,
  errors,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="medias-uploader-control-wrapper control-wrapper">
      <UploaderComponent
        idRef={`${idRef}${index + 1}`}
        uploaderPage={UploaderPageEnum.MediasTap}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.MediasTap.maxFileNumber
        } ${t('Shared:media-bracket')}`}
        uploadedFiles={
          (mediaItem
            && (mediaItem[uuidStateKey] || mediaItem[urlStateKey]) && [
            {
              uuid: mediaItem[uuidStateKey],
              url: mediaItem[urlStateKey],
              type: GetMediaType(mediaItem[typeStateKey])?.key,
              fileName: t(GetMediaType(mediaItem[typeStateKey])?.value) || 'image',
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
          const localMedia = { ...(mediaItem || {}) };
          localMedia[uuidStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].uuid) || null;
          localMedia[urlStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].url) || null;
          if (onValueChanged)
            onValueChanged({
              parentId,
              index,
              subParentId,
              id: stateKey,
              value: localMedia,
            });
        }}
      />
    </div>
  );
};

MediasUploaderControl.propTypes = {
  mediaItem: PropTypes.instanceOf(Object),
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  urlStateKey: PropTypes.string.isRequired,
  uuidStateKey: PropTypes.string.isRequired,
  typeStateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  subParentId: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  labelValue: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
MediasUploaderControl.defaultProps = {
  mediaItem: undefined,
  onValueChanged: undefined,
  idRef: 'MediasUploaderControlRef',
};

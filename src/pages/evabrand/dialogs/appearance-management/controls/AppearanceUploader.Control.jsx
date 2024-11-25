import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../../components';

export const AppearanceUploaderControl = ({
  mediaItem,
  onValueChanged,
  idRef,
  labelValue,
  isSubmitted,
  parentId,
  urlStateKey,
  uuidStateKey,
  // errors,
  // errorPath,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="appearance-uploader-control-wrapper control-wrapper">
      <UploaderComponent
        idRef={idRef}
        uploaderPage={UploaderPageEnum.AppearanceManagementDialog}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.AppearanceManagementDialog.maxFileNumber
        } ${t('Shared:images-bracket')}`}
        uploadedFiles={
          (mediaItem
            && (mediaItem[uuidStateKey] || mediaItem[urlStateKey]) && [
            {
              uuid: mediaItem[uuidStateKey],
              url: mediaItem[urlStateKey],
              type: 'image',
              fileName: t(`${translationPath}${labelValue}`),
            },
          ])
          || []
        }
        label={labelValue}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isSubmitted={isSubmitted}
        // helperText={(errors[errorPath] && errors[errorPath].message) || undefined}
        uploadedFileChanged={(newFiles) => {
          const localMedia = { ...(mediaItem || {}) };
          localMedia[uuidStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].uuid) || null;
          localMedia[urlStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0].url) || null;
          if (onValueChanged)
            onValueChanged({
              id: parentId,
              value: localMedia,
            });
        }}
      />
    </div>
  );
};

AppearanceUploaderControl.propTypes = {
  mediaItem: PropTypes.instanceOf(Object),
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  urlStateKey: PropTypes.string.isRequired,
  uuidStateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  idRef: PropTypes.string,
  // errors: PropTypes.instanceOf(Object).isRequired,
  labelValue: PropTypes.string.isRequired,
  // errorPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
AppearanceUploaderControl.defaultProps = {
  mediaItem: undefined,
  parentId: undefined,
  onValueChanged: undefined,
  idRef: 'AppearanceUploaderControlRef',
};

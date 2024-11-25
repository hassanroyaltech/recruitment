/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../../components';

export const SEOManagementUploaderControls = ({
  mediaItem,
  onValueChanged,
  idRef,
  labelValue,
  urlStateKey,
  uuidStateKey,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="seo-management-uploader-controls controls-wrapper">
      <UploaderComponent
        idRef={idRef}
        uploaderPage={UploaderPageEnum.EvaBrandSEOManagement}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.EvaBrandSEOManagement.maxFileNumber
        } ${t('Shared:image-bracket')}`}
        uploadedFiles={
          (mediaItem
            && (mediaItem[uuidStateKey] || mediaItem[urlStateKey]) && [
            {
              uuid: mediaItem[uuidStateKey],
              url: mediaItem[urlStateKey],
              type: 'image',
              fileName: t(`${translationPath}seo-image`),
            },
          ])
          || []
        }
        label={labelValue}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        uploadedFileChanged={(newFiles) => {
          const localState = { ...(mediaItem || {}) };
          localState[uuidStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0][uuidStateKey]) || null;
          localState[urlStateKey]
            = (newFiles && newFiles.length > 0 && newFiles[0][urlStateKey]) || null;
          if (onValueChanged) onValueChanged(localState);
        }}
      />
    </div>
  );
};

SEOManagementUploaderControls.propTypes = {
  mediaItem: PropTypes.instanceOf(Object),
  onValueChanged: PropTypes.func,
  urlStateKey: PropTypes.string.isRequired,
  uuidStateKey: PropTypes.string.isRequired,
  idRef: PropTypes.string,
  labelValue: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
SEOManagementUploaderControls.defaultProps = {
  mediaItem: undefined,
  onValueChanged: undefined,
  idRef: 'SEOManagementUploaderControlsRef',
};

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../../../../components';

export const PartnersUploaderControl = ({
  mediaItem,
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
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="partners-uploader-control-wrapper control-wrapper">
      <UploaderComponent
        idRef={`${idRef}${index + 1}`}
        uploaderPage={UploaderPageEnum.EvaBrandPartnersTab}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.EvaBrandPartnersTab.maxFileNumber
        } ${t('Shared:image-bracket')}`}
        uploadedFiles={
          (mediaItem
            && (mediaItem[uuidStateKey] || mediaItem[urlStateKey]) && [
            {
              uuid: mediaItem[uuidStateKey],
              url: mediaItem[urlStateKey],
              type: 'image',
              fileName: t(`${translationPath}partner-image`),
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
          const localMedia = { ...mediaItem };
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

PartnersUploaderControl.propTypes = {
  mediaItem: PropTypes.instanceOf(Object),
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
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
PartnersUploaderControl.defaultProps = {
  mediaItem: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  onValueChanged: undefined,
  idRef: 'PartnersUploaderControlRef',
};

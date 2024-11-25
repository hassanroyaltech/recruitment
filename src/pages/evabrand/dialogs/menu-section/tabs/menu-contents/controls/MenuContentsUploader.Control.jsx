import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderPageEnum } from '../../../../../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../../../../../../components';

export const MenuContentsUploaderControl = ({
  mediaItem,
  onValueChanged,
  idRef,
  labelValue,
  isSubmitted,
  parentId,
  subParentId,
  urlStateKey,
  uuidStateKey,
  errors,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="menu-contents-uploader-control-wrapper control-wrapper">
      <UploaderComponent
        idRef={idRef}
        uploaderPage={UploaderPageEnum.MenuSectionContentsTap}
        dropHereText={`${t('Shared:drop-here-max')} ${
          UploaderPageEnum.MenuSectionContentsTap.maxFileNumber
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
        helperText={
          (errors[`${parentId}.${subParentId}.${urlStateKey}`]
            && errors[`${parentId}.${subParentId}.${urlStateKey}`].message)
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

MenuContentsUploaderControl.propTypes = {
  mediaItem: PropTypes.instanceOf(Object),
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  urlStateKey: PropTypes.string.isRequired,
  uuidStateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
  labelValue: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
MenuContentsUploaderControl.defaultProps = {
  mediaItem: undefined,
  parentId: undefined,
  subParentId: undefined,
  onValueChanged: undefined,
  idRef: 'MenuContentsUploaderControlRef',
};

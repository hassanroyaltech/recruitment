import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import './TagsTheme.Style.scss';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

export const TagsThemeComponent = memo(
  ({
    allFiles,
    idRef,
    fileItemDeleteDisabledHandler,
    onDownloadHandler,
    isDisabledDelete,
    fileDeleted,
    uploadRef,
    isSubmitted,
    helperText,
    accept,
    multiple,
    parentTranslationPath,
    translationPathShared,
    translationPath,
    isDisabled,
    uploaderBtnText,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);

    /**
     * Method to send download to parent with the activate index
     * @param file
     * */
    const onDownloadClicked = useCallback(
      (file) => (event) => {
        if (!file || file.status === 'uploading' || file.status === 'failed') return;
        if (onDownloadHandler) onDownloadHandler(file, event);
      },
      [onDownloadHandler],
    );

    return (
      <div className="tags-theme-component-wrapper">
        <div className="tags-content-wrapper">
          {(allFiles
            && allFiles.length > 0
            && allFiles.map((item, index) => (
              <Chip
                className={`uploader-chip${(index === 0 && ' mx-0') || ''}${
                  (item && item.status === 'failed' && ' is-failed') || ''
                }`}
                label={item.name || item.fileName}
                key={`${idRef}chip${index + 1}`}
                disabled={
                  (fileItemDeleteDisabledHandler
                    && fileItemDeleteDisabledHandler(item, index))
                  || isDisabledDelete
                }
                onDelete={
                  (item
                    && item.status !== 'uploading'
                    && fileDeleted(item, index))
                  || undefined
                }
                onClick={onDownloadClicked(item)}
                clickable={
                  item && item.status !== 'uploading' && item.status !== 'failed'
                }
                avatar={
                  (item && item.status === 'uploading' && (
                    <CircularProgress size="small" />
                  ))
                  || undefined
                }
              />
            )))
            || undefined}
        </div>
        <ButtonBase
          className="btns theme-transparent mx-0 px-0"
          onClick={() => uploadRef.current.click()}
          disabled={isDisabled}
        >
          <span className="fas fa-plus" />
          <span className="mx-1 text-nowrap">
            {(uploaderBtnText && t(`${translationPath}${uploaderBtnText}`))
              || (accept
                && accept.includes('image')
                && !accept.includes(',')
                && accept !== '*'
                && t(
                  `${translationPathShared}${
                    (multiple && 'upload-images') || 'upload-image'
                  }`,
                ))
              || t(
                `${translationPathShared}${
                  (multiple && 'upload-files') || 'upload-file'
                }`,
              )}
          </span>
        </ButtonBase>
        {isSubmitted && helperText && (
          <div className="error-wrapper w-100">
            <span>{helperText}</span>
          </div>
        )}
      </div>
    );
  },
);

TagsThemeComponent.displayName = 'UploaderTagsThemeComponent';

TagsThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array),
  idRef: PropTypes.string.isRequired,
  onDownloadHandler: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  uploaderBtnText: PropTypes.string,
  fileDeleted: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
  translationPath: PropTypes.string,
};
TagsThemeComponent.defaultProps = {
  allFiles: [],
  parentTranslationPath: '',
  isDisabled: false,
  isDisabledDelete: false,
  uploaderBtnText: undefined,
  onDownloadHandler: undefined,
  helperText: undefined,
  isSubmitted: undefined,
  fileItemDeleteDisabledHandler: undefined,
  translationPath: undefined,
};

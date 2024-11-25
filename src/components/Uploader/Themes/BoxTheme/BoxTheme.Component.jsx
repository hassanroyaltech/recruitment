import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import VideoPlayer from 'react-video-js-player';
import { useTranslation } from 'react-i18next';
import { getMimeTypeHandler } from '../../../../utils';
import { LoadableImageComponant } from '../../../LoadableImage/LoadableImage.Componant';
import './BoxTheme.Style.scss';

export const BoxThemeComponent = memo(
  ({
    allFiles,
    defaultImage,
    uploadRef,
    isDragOver,
    accept,
    multiple,
    parentTranslationPath,
    translationPath,
    translationPathShared,
    uploaderBtnText,
    dropHereText,
    fileDeleted,
    onOpenGalleryHandler,
    fileItemDeleteDisabledHandler,
    onDownloadHandler,
    idRef,
    isDisabled,
    isDisabledDelete,
    isSubmitted,
    helperText,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    /**
     * Method to send open gallery handler to parent with the activate index
     * @param index
     * */
    const openGalleryClicked = useCallback(
      (index) => () => {
        if (onOpenGalleryHandler) onOpenGalleryHandler(index);
      },
      [onOpenGalleryHandler],
    );
    /**
     * Method to send download to parent with the activate index
     * @param file
     * */
    const onDownloadClicked = useCallback(
      (file) => (event) => {
        if (!file && (file.status === 'uploading' || file.status === 'failed'))
          return;
        if (onDownloadHandler) onDownloadHandler(file, event);
      },
      [onDownloadHandler],
    );

    return (
      <div
        className={`box-theme-component-wrapper${
          (isDragOver && ' drag-over') || ''
        }`}
      >
        <div className="custom-dropzone-wrapper">
          <div className="dropzone-items-wrapper">
            {(!allFiles || allFiles.length === 0) && (
              <div className="dropzone-item-wrapper">
                <span className="fas fa-cloud-upload-alt fa-3x" />
              </div>
            )}
            {allFiles
              && allFiles.map((file, index) => (
                <div key={`${idRef}${index + 1}`} className="dropzone-item-wrapper">
                  {file && file.status === 'failed' && (
                    <div
                      className="failed-wrapper"
                      title={t(`${translationPathShared}failed`)}
                    >
                      <span className="fas fa-times" />
                    </div>
                  )}
                  {file && file.status !== 'uploading' && (
                    <>
                      {((!getMimeTypeHandler(file).isVideo
                        || (file && file.status === 'failed')) && (
                        <LoadableImageComponant
                          src={
                            (getMimeTypeHandler(file).isFile
                              && getMimeTypeHandler(file).image)
                            || file.url
                            || defaultImage
                            || getMimeTypeHandler(file).image
                            || undefined
                          }
                          classes="box-theme-image"
                          alt={t(file.url || undefined)}
                        />
                      ))
                        || (getMimeTypeHandler(file).isVideo && (
                          <VideoPlayer
                            className="dz-preview-video video-player-wrapper"
                            controls
                            src={file.url}
                          />
                        ))}
                    </>
                  )}
                  {file && file.status === 'uploading' && (
                    <div className="as-overlay-spinner">
                      <span className="fas fa-spinner fa-spin" />
                    </div>
                  )}
                  {file
                    && file.status !== 'uploading'
                    && (onOpenGalleryHandler || onDownloadHandler) && (
                    <div className="over-item-actions-wrapper">
                      {onDownloadHandler && (
                        <ButtonBase
                          className="btns-icon theme-transparent download-btn"
                          onClick={onDownloadClicked(file)}
                        >
                          <span className="fas fa-download" />
                        </ButtonBase>
                      )}
                      {onOpenGalleryHandler && (
                        <ButtonBase
                          className="btns-icon theme-transparent open-gallery-btn"
                          onClick={openGalleryClicked(index)}
                        >
                          <span className="far fa-eye" />
                        </ButtonBase>
                      )}
                      {file && file.status !== 'uploading' && (
                        <ButtonBase
                          className="btns-icon btn-close theme-transparent c-warning"
                          onClick={fileDeleted(file, index)}
                          disabled={
                            (fileItemDeleteDisabledHandler
                                && fileItemDeleteDisabledHandler(file, index))
                              || isDisabledDelete
                          }
                        >
                          <span className="fas fa-times" />
                        </ButtonBase>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
          {(!allFiles || allFiles.length === 0) && (
            <div className="drop-here">
              {(dropHereText === 'drop-here-max-default'
                && t(`${translationPathShared}${dropHereText}`))
                || dropHereText}
            </div>
          )}
          {isSubmitted && helperText && (
            <div className="error-wrapper">
              <span>{helperText}</span>
            </div>
          )}
          <ButtonBase
            className="btns theme-solid mx-0"
            onClick={() => uploadRef.current.click()}
            disabled={isDisabled}
          >
            <span className="mx-3 text-nowrap">
              {(uploaderBtnText && t(`${translationPath}${uploaderBtnText}`))
                || (accept
                  && accept.includes('image')
                  && !accept.includes(',')
                  && accept !== '*'
                  && t(
                    `${translationPathShared}${
                      (multiple && 'browse-images') || 'browse-image'
                    }`,
                  ))
                || t(
                  `${translationPathShared}${
                    (multiple && 'browse-files') || 'browse-file'
                  }`,
                )}
            </span>
          </ButtonBase>
        </div>
      </div>
    );
  },
);

BoxThemeComponent.displayName = 'BoxThemeComponent';

BoxThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array),
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  dropHereText: PropTypes.string.isRequired,
  uploaderBtnText: PropTypes.string,
  multiple: PropTypes.bool.isRequired,
  onOpenGalleryHandler: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  onDownloadHandler: PropTypes.func,
  defaultImage: PropTypes.string,
  helperText: PropTypes.string,
  fileDeleted: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
};
BoxThemeComponent.defaultProps = {
  allFiles: [],
  parentTranslationPath: '',
  translationPath: undefined,
  isDisabled: false,
  isDisabledDelete: false,
  isSubmitted: false,
  onOpenGalleryHandler: undefined,
  fileItemDeleteDisabledHandler: undefined,
  onDownloadHandler: undefined,
  uploaderBtnText: undefined,
  helperText: undefined,
  defaultImage: undefined,
};

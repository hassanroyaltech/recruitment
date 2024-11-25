import React, { memo, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../Inputs/Inputs.Component';
import './InputTheme.Style.scss';

export const InputThemeComponent = memo(
  ({
    allFiles,
    uploadRef,
    isDragOver,
    accept,
    multiple,
    parentTranslationPath,
    translationPathShared,
    translationPath,
    inputPlaceholder,
    label,
    dropHereText,
    fileDeleted,
    // onOpenGalleryHandler,
    fileItemDeleteDisabledHandler,
    isDisabledDelete,
    onDownloadHandler,
    idRef,
    isDisabled,
    isSubmitted,
    helperText,
    uploaderBtnText,
    inputThemeClass,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const endAdornmentRef = useRef(null);
    const [endAdornmentWidth, setEndAdornmentWidth] = useState(120);
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
    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description method to rerender on bind end or start adornments to re-calc width
     */
    const onAdornmentsChanged = () => {
      if (endAdornmentWidth !== endAdornmentRef.current?.offsetWidth)
        setEndAdornmentWidth(endAdornmentRef.current?.offsetWidth || 120);
    };

    return (
      <div
        className={`input-theme-component-wrapper${
          (isDragOver && ' drag-over') || ''
        }`}
      >
        <Inputs
          idRef={`themeInputUploaderRef${idRef}`}
          label={label}
          inputPlaceholder={inputPlaceholder}
          error={helperText && helperText.length > 0}
          helperText={helperText}
          isSubmitted={isSubmitted}
          translationPath={
            translationPath
            || (translationPath !== '' && translationPathShared)
            || ''
          }
          value=""
          themeClass={inputThemeClass}
          parentTranslationPath={parentTranslationPath}
          startAdornment={
            (allFiles
              && allFiles.length > 0
              && allFiles.map((item, index) => (
                <Chip
                  className={`uploader-chip${
                    (item && item.status === 'failed' && ' is-failed') || ''
                  }`}
                  label={item && item.fileName}
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
            || undefined
          }
          onAdornmentsChanged={onAdornmentsChanged}
          endAdornment={
            <div className="end-adornment-wrapper" ref={endAdornmentRef}>
              <ButtonBase
                className="btns theme-solid mx-0 px-0"
                onClick={() => uploadRef.current.click()}
                disabled={isDisabled}
              >
                <span className="text-nowrap mx-3">
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
          }
        />
        <div className="custom-dropzone-wrapper">
          {(allFiles.length === 0 || isDragOver) && (
            <div
              className={`drop-here${(allFiles.length > 0 && ' as-overlay') || ''}`}
              style={{
                maxWidth: `calc(100% - ${endAdornmentWidth}px)`,
              }}
            >
              {t(`${translationPathShared}${dropHereText}`)}
            </div>
          )}
        </div>
      </div>
    );
  },
);

InputThemeComponent.displayName = 'InputThemeComponent';

InputThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array),
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  dropHereText: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  // onOpenGalleryHandler: PropTypes.func,
  onDownloadHandler: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  helperText: PropTypes.string,
  uploaderBtnText: PropTypes.string,
  fileDeleted: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
  translationPath: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  label: PropTypes.string,
  inputThemeClass: PropTypes.string,
};
InputThemeComponent.defaultProps = {
  allFiles: [],
  parentTranslationPath: '',
  isDisabled: false,
  isDisabledDelete: false,
  isSubmitted: false,
  // onOpenGalleryHandler: undefined,
  onDownloadHandler: undefined,
  fileItemDeleteDisabledHandler: undefined,
  helperText: undefined,
  uploaderBtnText: undefined,
  translationPath: undefined,
  inputPlaceholder: undefined,
  label: undefined,
  inputThemeClass: undefined,
};

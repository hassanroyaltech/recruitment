import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { getDownloadableLink } from '../../../../helpers';
import './CircleTheme.Style.scss';

export const CircleThemeComponent = ({
  allFiles,
  defaultImage,
  isDragOver,
  parentTranslationPath,
  translationPathShared,
  fileDeleted,
  uploadRef,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);

  return (
    <div
      className={`circle-theme-component-wrapper${
        (isDragOver && ' drag-over') || ''
      }`}
    >
      <div
        className="dropzone-wrapper"
        style={{
          backgroundImage: `url(${
            (allFiles.length > 0 && getDownloadableLink(allFiles[0].url))
            || defaultImage
            || undefined
          })`,
        }}
      >
        {(allFiles.length === 0 || isDragOver) && (
          <div
            className={`drop-here${(allFiles.length > 0 && ' as-overlay') || ''}`}
          >
            {t(`${translationPathShared}drop-here`)}
          </div>
        )}
      </div>
      {allFiles.length > 0 && (
        <ButtonBase
          className="btns-icon btn-close theme-solid bg-danger"
          onClick={fileDeleted(allFiles[0], 0)}
        >
          <span className="fas fa-times" />
        </ButtonBase>
      )}
      {allFiles.length === 0 && (
        <ButtonBase
          className="btns-icon theme-solid"
          onClick={() => uploadRef.current.click()}
        >
          <span className="fas fa-upload" />
        </ButtonBase>
      )}
    </div>
  );
};

CircleThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array).isRequired,
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  defaultImage: PropTypes.string,
  fileDeleted: PropTypes.func.isRequired,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
};
CircleThemeComponent.defaultProps = {
  parentTranslationPath: '',
  defaultImage: undefined,
};

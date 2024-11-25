import * as React from 'react';
import { styled } from '@mui/material';
import { fileFormats } from '../data/fileFormats';
import { useEffect, useRef } from 'react';
import { showError } from '../../../helpers';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    id,
    children,
    cb,
    multiple = true,
    matchFileType,
    fileQuantityLimit = '',
    fileSizeLimit = '',
    files,
    disabled,
  }) => {
    const { t } = useTranslation('Shared');
    const uploadRef = useRef();
    const filesRef = useRef(files || []);
    const typesArray = React.useMemo(() => {
      if (Array.isArray(matchFileType) && matchFileType.length) return matchFileType;

      return Object.values(fileFormats).map((t) => t.fileType);
    }, [matchFileType]);

    const handleFileInput = React.useCallback(
      (e) => {
        e.preventDefault();

        const localFiles = Array.from(
          (e.dataTransfer && Object.values(e.dataTransfer.files)) || e.target.files,
        );
        if (
          fileQuantityLimit
          && localFiles.length + filesRef.current.length > fileQuantityLimit
        ) {
          localFiles.length
            = fileQuantityLimit - filesRef.current.length > localFiles.length
              ? localFiles.length
              : fileQuantityLimit - filesRef.current.length;
          showError(t('max-allowed-files-limit-exceeded'));
        }
        return (
          localFiles.map(
            (file, index, items) =>
              file instanceof File
              && (!fileSizeLimit && fileSizeLimit !== 0
                ? true
                : file.size < fileSizeLimit * 1024)
              && (!fileQuantityLimit ? true : items.length <= fileQuantityLimit)
              && (typesArray.length === 0
                || typesArray.includes(file.type)
                || typesArray.includes(`.${file.name?.split('.').pop()}`))
              && cb(file),
          ) || []
        );
      },
      [fileSizeLimit, fileQuantityLimit, typesArray, cb],
    );

    useEffect(() => {
      filesRef.current = files;
      uploadRef.current.value = null;
    }, [files]);

    return (
      <Label
        id={`${id}-drop-zone`}
        onDragOver={(event) => event.preventDefault()}
        onDragEnd={(event) => event.preventDefault()}
        onDrop={handleFileInput}
        htmlFor={id}
        style={{
          pointerEvents: disabled ? 'none' : '',
          cursor: disabled ? 'none' : 'pointer',
        }}
      >
        {children}
        <input
          type="file"
          ref={uploadRef}
          accept={matchFileType}
          id={id}
          multiple={multiple}
          onChange={handleFileInput}
        />
      </Label>
    );
  },
);

const Label = styled('label')`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  input[type='file'] {
    display: none;
  }
`;

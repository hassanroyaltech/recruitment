import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { UploadIcon, FileBrandedIcon, MoreIcon } from '../../../../icons';
import FileUploader from '../../../../components/FileUploader';
import ListCard from '../../../../components/ListCard';
import FileMenu from './FileMenu';
import { UploadFile } from '../../../../../../services';
import { generateUUIDV4, showError } from '../../../../../../helpers';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UploaderTypesEnum } from '../../../../../../enums';
import { useSelector } from 'react-redux';

export default function AttachmentField({
  handleSetValue,
  initialValue,
  filesDetails,
  allowedFormats,
  fileSizeLimit,
  fileQuantityLimit,
  buttonLabel,
  disabled,
  preview,
  role,
  fillBy,
  isRequired,
  isSubmitted,
  pdfRef,
}) {
  const { t } = useTranslation('Shared');
  const [files, setFiles] = useState(filesDetails || []);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const candidateUserReducer = useSelector((state) => state?.candidateUserReducer);

  const uniqueId = useMemo(() => generateUUIDV4(), []);

  const getBackendType = useCallback(
    (file) => {
      if (allowedFormats && allowedFormats.length > 0) {
        if (
          file
          && allowedFormats.includes(file.type)
          && file.type.includes('image')
        )
          return UploaderTypesEnum.Image.key;
      } else if (file && file.type.includes('image'))
        return UploaderTypesEnum.Image.key;

      return UploaderTypesEnum.Docs.key;
    },
    [allowedFormats],
  );

  const handleFileUpload = useCallback(
    async (file) => {
      if (file) {
        const temporaryId = generateUUIDV4();
        setFiles((prevFiles) => [
          ...prevFiles,
          { file, uuid: temporaryId, url: null, type: null, status: 'uploading' },
        ]);
        const res = await UploadFile(
          {
            from_feature: 'media--formbuilder',
            for_account: false,
            file: file,
            type: getBackendType(file),
          },
          candidateUserReducer?.token
            ? {
              customHeaders: true,
              'Accept-Company': candidateUserReducer?.company?.uuid,
              'recipient-token': candidateUserReducer?.token,
              'Accept-Account': candidateUserReducer?.account?.uuid,
              Authorization: null,
            }
            : null,
        );
        if (res && res.status === 201)
          setFiles((prevFiles) => {
            const localFiles = [...prevFiles];
            const localFileIndex = localFiles.findIndex(
              (item) => item.uuid === temporaryId,
            );
            if (localFileIndex !== -1) {
              localFiles[localFileIndex] = {
                ...localFiles[localFileIndex],
                ...res.data.results.original,
              };
              return localFiles;
            }

            return prevFiles;
          });
        else {
          setFiles((prevFiles) => {
            const localFiles = [...prevFiles];
            const localFileIndex = localFiles.findIndex(
              (item) => item.uuid === temporaryId,
            );
            if (localFileIndex !== -1) {
              localFiles[localFileIndex] = {
                ...localFiles[localFileIndex],
                status: 'failed',
              };
              return localFiles;
            }

            return prevFiles;
          });
          showError(t('failed-to-upload-file'), res);
        }
      }
    },
    [getBackendType, t, candidateUserReducer],
  );
  // this is to update the parent on files changed
  useEffect(() => {
    handleSetValue(files);
  }, [files, handleSetValue]);

  useEffect(() => {
    if (
      (fileQuantityLimit || fileQuantityLimit === 0)
      && files.length >= fileQuantityLimit
    )
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [files, fileQuantityLimit]);

  return (
    <Box display="flex" flexDirection="column" flex="1">
      <Box
        sx={{
          my: 2,
          cursor: 'pointer',
        }}
      >
        {files?.length > 0 ? (
          files.map((item, index) => (
            <ListCard
              disabled={disabled}
              key={`uploaderPreviewListKeys${item.uuid}`}
              item={item}
              itemIndex={index}
              leftIcon={FileBrandedIcon}
              popoverIcon={MoreIcon}
              popoverBody={<FileMenu setFiles={setFiles} uuid={item.uuid} />}
            />
          ))
        ) : (
          <div>No files Uploaded yet</div>
        )}
      </Box>
      {(!disabled
        || (disabled
          && preview.isActive
          && (role === 'sender' || role === 'creator')
          && fillBy === preview.role))
        && !pdfRef && (
        <FileUploader
          id={uniqueId}
          cb={handleFileUpload}
          matchFileType={allowedFormats}
          fileSizeLimit={fileSizeLimit}
          fileQuantityLimit={fileQuantityLimit}
          files={files}
          disabled={disabled}
        >
          <Box
            sx={{
              px: 6,
              py: 4,
              flex: 1,
              borderRadius: 1.5,
              border: (theme) => `1px dashed ${theme.palette.dark.$16}`,
            }}
            className={
              (!isDisabled
                  && isRequired
                  && isSubmitted
                  && (!files || files.length === 0)
                  && 'is-required')
                || ''
            }
          >
            <Typography weight="medium" sx={{ mb: 2 }}>
              {'Upload file(s)'}
            </Typography>
            <Button
              variant="primary"
              size="m"
              sx={{
                pointerEvents: 'none',
                zIndex: 0,
                background: (theme) => theme.palette.primary.$80,
              }}
              startIcon={<UploadIcon />}
              disabled={isDisabled}
            >
              <Typography
                weight="medium"
                sx={{ mx: 2, color: (theme) => theme.palette.light.main }}
              >
                {buttonLabel}
              </Typography>
            </Button>
          </Box>
        </FileUploader>
      )}
    </Box>
  );
}

AttachmentField.displayName = 'AttachmentField';

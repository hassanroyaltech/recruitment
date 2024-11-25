import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploadFile } from '../../services';
import { GalleryComponent } from '../Gallery/Gallery.Component';
import { UploaderPageEnum } from '../../enums/Pages/UploaderPage.Enum';
import { UploaderThemesEnum } from '../../enums/Shared/UploaderThemes.Enum';

import './Uploader.Style.scss';
import { UploaderTypesEnum } from '../../enums/Shared/UploderTypes.Enum';
import { showError } from '../../helpers';
import { getMimeTypeHandler } from '../../utils';

export const UploaderComponent = memo(
  ({
    uploadedFiles,
    wrapperClasses,
    uploaderClasses,
    counterClasses,
    inputClasses,
    labelClasses,
    accept,
    multiple,
    translationPath,
    parentTranslationPath,
    translationPathShared,
    uploadedFileChanged,
    onIsUploadingChanged,
    fileItemDeleteDisabledHandler,
    isDisabledDelete,
    titleText,
    labelValue,
    isDisabled,
    idRef,
    isViewUploadedFilesCount,
    dropHereText,
    uploaderTheme,
    chipHandler,
    uploaderPage,
    defaultImage,
    isWithGalleryPreview,
    isRequired,
    isDownloadable,
    maxFileNumber,
    isSubmitted,
    helperText,
    uploaderBtnText,
    inputPlaceholder,
    label,
    inputThemeClass,
    type,
    for_account,
    isDynamicCheck,
    customAPIUploader, //  must return array of files
    customSingleAPIUploader,
    customAPIBody,
    customAPIParams,
    customAPIHeaders,
    company_uuid,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const uploadRef = useRef(null);
    const [allFiles, setAllFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isOpenGallery, setIsOpenGallery] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    // method to get type of uploaded file if not send by parent & if exist in supportedTypes
    const typeDeterminer = (fileType) =>
      Object.values(UploaderTypesEnum).find((element) =>
        fileType.includes(element.key),
      )?.key || null;

    // method to determine the type using the file extension
    const dynamicCheckHandler = useMemo(
      () => (file) => {
        if (!file || (!file.type && !getMimeTypeHandler(file))) return '';
        if (!file.type && getMimeTypeHandler(file)) {
          if (getMimeTypeHandler(file).image) return UploaderTypesEnum.Image.key;
          if (getMimeTypeHandler(file).isVideo) return UploaderTypesEnum.Video.key;
          return UploaderTypesEnum.Docs.key;
        }
        if (file.type.includes('image')) return UploaderTypesEnum.Image.key;
        if (file.type.includes('video')) return UploaderTypesEnum.Video.key;
        return UploaderTypesEnum.Docs.key;
      },
      [],
    );

    const uploadHandler = async (files) => {
      if (onIsUploadingChanged) onIsUploadingChanged(true);
      let numberOfFinished = 0;
      if (customAPIUploader) {
        if (uploadedFileChanged) uploadedFileChanged([...uploadedFiles, ...files]);
        const res = await customAPIUploader({
          files: files.map((file) => file.file),
          list: files,
          customAPIBody,
          customAPIParams,
          customAPIHeaders,
        });
        if (
          res
          && (res.status === 200 || res.status === 201 || res.status === 202)
        ) {
          const {
            data: { results },
          } = res;
          const localUploadedFiles = [...uploadedFiles, ...results];

          if (uploadedFileChanged) uploadedFileChanged(localUploadedFiles);
          setAllFiles(localUploadedFiles);
        } else {
          showError(t(`${translationPathShared}failed-to-upload-file`), res);
          const localFailedFiles = files.map((item) => ({
            ...item,
            status: 'failed',
          }));
          const localUploadedFiles = [...uploadedFiles, ...localFailedFiles];
          if (uploadedFileChanged) uploadedFileChanged(localUploadedFiles);
          setAllFiles(localUploadedFiles);
        }
      } else
        files.map(async (item, localIndex, filesItems) => {
          if (
            type
            || uploaderPage.type
            || ((isDynamicCheck || uploaderPage.isDynamicCheck)
              && dynamicCheckHandler(item))
            || typeDeterminer(item.type)
          ) {
            const res = await ((customSingleAPIUploader
              && customSingleAPIUploader({
                file: item.file,
                item: item,
                uploaderPage,
                dynamicCheckHandlerResult: dynamicCheckHandler(item),
                typeDeterminerResult: typeDeterminer(item.type),
              }))
              || UploadFile({
                from_feature: uploaderPage.fromFeature,
                for_account: uploaderPage.forAccount || for_account,
                file: item.file,
                type:
                  type
                  || uploaderPage.type
                  || ((isDynamicCheck || uploaderPage.isDynamicCheck)
                    && dynamicCheckHandler(item))
                  || typeDeterminer(item.type),
                company_uuid,
              }));
            numberOfFinished += 1;
            if (onIsUploadingChanged && filesItems.length === numberOfFinished)
              onIsUploadingChanged(false);
            if (
              res
              && (res.status === 200 || res.status === 201 || res.status === 202)
            ) {
              const response = res.data.results.original;
              const localUploadedFiles = ((multiple || uploaderPage.multiple)
                && uploadedFiles) || [{ ...response }];
              if (multiple || uploaderPage.multiple)
                localUploadedFiles.push(response);

              if (uploadedFileChanged) uploadedFileChanged(localUploadedFiles);
              setAllFiles((items) => {
                const localItems = [...items];
                const fileIndex = items.findIndex(
                  (element) => element.id === item.id,
                );
                if (fileIndex !== -1)
                  localItems[fileIndex] = {
                    ...localItems[fileIndex],
                    ...response,
                    status: 'success',
                  };

                return [...localItems];
              });
            } else {
              showError(
                (res
                  && res.data
                  && ((res.data.errors
                    && res.data.errors.file
                    && res.data.errors.file.length > 0
                    && res.data.errors.file[0])
                    || res.data.message))
                  || t(`${translationPathShared}failed-to-upload-file`),
              );
              setAllFiles((items) => {
                const localItems = [...items];
                const fileIndex = items.findIndex(
                  (element) => element.id === item.id,
                );
                if (fileIndex !== -1) localItems[fileIndex].status = 'failed';
                return localItems;
              });
            }
          } else
            setAllFiles((items) => {
              const localItems = [...items];
              const fileIndex = items.findIndex((element) => element.id === item.id);
              if (fileIndex !== -1) localItems[fileIndex].status = 'failed';
              return localItems;
            });
        });
    };
    const dropHandler = (event) => {
      event.preventDefault();
      if (
        isDisabled
        || (uploaderPage.maxFileNumber || maxFileNumber) === allFiles.length
      )
        return;
      setIsDragOver(false);
      let filesToUpload = Object.values(event.dataTransfer.files);
      if ((accept || uploaderPage.accept).includes('image'))
        filesToUpload = filesToUpload.filter((item) => item.type.includes('image'));

      if (filesToUpload.length === 0) return;
      if (
        filesToUpload.length + allFiles.length
        > (uploaderPage.maxFileNumber || maxFileNumber)
      )
        filesToUpload.length
          = (uploaderPage.maxFileNumber || maxFileNumber) - allFiles.length;
      let files = [];
      if (multiple || uploaderPage.multiple)
        filesToUpload.map((file) => {
          files.push({
            id: allFiles.length + files.length,
            uuid: null,
            fileName: file.name,
            size: file.size,
            type: file.type,
            file,
            status: 'uploading',
          });
          return undefined;
        });
      else
        files = [
          {
            id: allFiles.length,
            uuid: null,
            fileName: filesToUpload[0].name,
            size: filesToUpload[0].size,
            type: filesToUpload[0].type,
            file: filesToUpload[0],
            status: 'uploading',
          },
        ];

      setAllFiles(
        (items) =>
          ((multiple || uploaderPage.multiple) && items.concat(files)) || files,
      );
      uploadHandler(files);
    };
    const fileDeleted = useCallback(
      (item, index) => () => {
        const uploadedFilesIndex = uploadedFiles.findIndex(
          (element) => element.uuid === item.uuid,
        );
        if (uploadedFilesIndex !== -1) {
          const localFiles = [...uploadedFiles];
          localFiles.splice(uploadedFilesIndex, 1);
          if (uploadedFileChanged) uploadedFileChanged(localFiles);
        }
        setAllFiles((items) => {
          items.splice(index, 1);
          return [...items];
        });
      },
      [uploadedFileChanged, uploadedFiles],
    );
    const inputChanged = (event) => {
      if (!event.target.value) return;
      let files = [];
      const localFiles = Object.values(event.target.files);
      if (multiple || uploaderPage.multiple) {
        if (
          localFiles.length + allFiles.length
          > (uploaderPage.maxFileNumber || maxFileNumber)
        )
          localFiles.length
            = (uploaderPage.maxFileNumber || maxFileNumber) - allFiles.length;
        localFiles.map((file) => {
          files.push({
            id: allFiles.length + files.length,
            uuid: null,
            fileName: file.name,
            size: file.size,
            type: file.type,
            file,
            status: 'uploading',
          });
          // uploadHandler(file, filesLength + index);
          return undefined;
        });
      } else
        files = [
          {
            id: allFiles.length,
            uuid: null,
            fileName: event.target.files[0].name,
            size: event.target.files[0].size,
            type: event.target.files[0].type,
            file: event.target.files[0],
            status: 'uploading',
          },
        ];

      setAllFiles(
        (items) =>
          ((multiple || uploaderPage.multiple) && items.concat(files)) || files,
      );
      uploadHandler(files);
      // eslint-disable-next-line no-param-reassign
      event.target.value = null;
    };
    const onOpenGalleryHandler = useCallback((activeIndex) => {
      setActiveImageIndex(activeIndex);
      setIsOpenGallery(true);
    }, []);
    const onDownloadHandler = useCallback((file) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.download = file.uuid;
      link.href = file.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, []);
    const getUploaderComponent = () => {
      if (!uploaderPage) return null;
      const Component = uploaderTheme || uploaderPage.theme.component;
      const defaultProps = {
        allFiles,
        defaultImage: defaultImage || uploaderPage.defaultImage,
        isDragOver,
        parentTranslationPath,
        translationPathShared,
        translationPath,
        fileDeleted,
        fileItemDeleteDisabledHandler,
        uploadRef,
        idRef,
        dropHereText,
        counterClasses,
        titleText,
        uploaderBtnText: uploaderBtnText || uploaderPage.uploaderBtnText,
        isViewUploadedFilesCount:
          isViewUploadedFilesCount || uploaderPage.isViewUploadedFilesCount,
        multiple: multiple || uploaderPage.multiple,
        accept: accept || uploaderPage.accept,
        // type: type || uploaderPage.type,
        chipHandler,
        isSubmitted,
        helperText,
        isDisabled:
          isDisabled
          || (uploaderPage.maxFileNumber || maxFileNumber) === allFiles.length,
        isDisabledDelete: isDisabledDelete || uploaderPage.isDisabledDelete,
        inputPlaceholder: inputPlaceholder || uploaderPage.inputPlaceholder,
        inputThemeClass: inputThemeClass || uploaderPage.inputThemeClass,
        label: label || uploaderPage.label,
        onOpenGalleryHandler:
          ((isWithGalleryPreview || uploaderPage.isWithGalleryPreview)
            && onOpenGalleryHandler)
          || undefined,
        onDownloadHandler:
          ((isDownloadable || uploaderPage.isDownloadable) && onDownloadHandler)
          || undefined,
      };

      return (
        <Component {...defaultProps} {...(uploaderPage.pageCustomProps || {})} />
      );
    };
    useEffect(() => {
      if (uploadedFiles)
        setAllFiles((items) => {
          let localItems = [...items];
          const newIds = uploadedFiles.filter(
            (item) =>
              localItems.findIndex((element) => item.uuid === element.uuid) === -1,
          );
          const removedIds = localItems.filter(
            (item) =>
              uploadedFiles.findIndex((element) => item.uuid === element.uuid)
              === -1,
          );
          if (newIds.length === 0 && removedIds.length === 0) return items;
          if (removedIds.length > 0)
            removedIds.map((item) => {
              const itemIndex = localItems.findIndex(
                (element) => item.uuid === element.uuid,
              );
              if (itemIndex !== -1) localItems.splice(itemIndex, 1);
              return undefined;
            });
          if (newIds.length > 0) localItems = localItems.concat(newIds);
          return localItems;
        });
    }, [uploadedFiles]);
    // useEffect(() => {
    //   if (onIsUploadingChanged) onIsUploadingChanged(allFiles);
    // }, [allFiles, onIsUploadingChanged]);
    return (
      <div className={wrapperClasses}>
        {labelValue && (
          <label
            htmlFor={idRef}
            className={`label-wrapper ${labelClasses}${
              isDisabled ? ' disabled' : ''
            }`}
          >
            <span>
              {t(
                `${
                  translationPath
                  || (translationPath === '' && '')
                  || translationPathShared
                  || ''
                }${labelValue}`,
              )}
            </span>
            {isRequired && <span className="px-1">*</span>}
          </label>
        )}
        <input
          ref={uploadRef}
          type="file"
          className={inputClasses}
          multiple={multiple || uploaderPage.multiple}
          accept={accept || uploaderPage.accept}
          onChange={inputChanged}
          max={uploaderPage.maxFileNumber || maxFileNumber}
          disabled={
            isDisabled
            || (uploaderPage.maxFileNumber || maxFileNumber) === allFiles.length
          }
        />
        <div
          className={uploaderClasses}
          onDragOver={(event) => {
            event.preventDefault();
            if (
              isDisabled
              || (uploaderPage.maxFileNumber || maxFileNumber) === allFiles.length
            )
              return;
            if (!isDragOver) setIsDragOver(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={dropHandler}
        >
          {getUploaderComponent()}
        </div>
        {isOpenGallery && (
          <GalleryComponent
            data={allFiles || []}
            isOpen={isOpenGallery}
            activeImageIndex={activeImageIndex}
            imageInput="url"
            altInput="fileName"
            titleText="preview-images"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onOpenChanged={() => {
              setActiveImageIndex(null);
              setIsOpenGallery(false);
            }}
          />
        )}
      </div>
    );
  },
);

UploaderComponent.displayName = 'UploaderComponent';

UploaderComponent.propTypes = {
  for_account: PropTypes.bool,
  uploaderPage: PropTypes.oneOf(Object.values(UploaderPageEnum).map((item) => item))
    .isRequired,
  uploadedFiles: PropTypes.instanceOf(Array),
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  uploaderClasses: PropTypes.string,
  idRef: PropTypes.string,
  inputClasses: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  accept: PropTypes.oneOfType([
    PropTypes.oneOf(Object.values(UploaderPageEnum).map((item) => item.accept)),
    PropTypes.string,
  ]),
  counterClasses: PropTypes.string,
  titleText: PropTypes.string,
  uploaderTheme: PropTypes.oneOf(
    Object.values(UploaderThemesEnum).map((item) => item),
  ),
  type: PropTypes.oneOf(Object.values(UploaderTypesEnum).map((item) => item.key)),
  multiple: PropTypes.bool,
  isWithGalleryPreview: PropTypes.bool,
  defaultImage: PropTypes.string,
  chipHandler: PropTypes.func,
  uploadedFileChanged: PropTypes.func,
  onIsUploadingChanged: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isDownloadable: PropTypes.bool,
  isViewUploadedFilesCount: PropTypes.bool,
  dropHereText: PropTypes.string,
  helperText: PropTypes.string,
  uploaderBtnText: PropTypes.string,
  maxFileNumber: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  label: PropTypes.string,
  inputThemeClass: PropTypes.string,
  company_uuid: PropTypes.string,
  customAPIBody: PropTypes.instanceOf(Object),
  customAPIParams: PropTypes.instanceOf(Object),
  customAPIHeaders: PropTypes.instanceOf(Object),
  customAPIUploader: PropTypes.func,
  customSingleAPIUploader: PropTypes.func,
  isDynamicCheck: PropTypes.bool,
  isRequired: PropTypes.bool,
};
UploaderComponent.defaultProps = {
  for_account: false,
  uploadedFiles: [],
  wrapperClasses: 'uploader-wrapper',
  labelClasses: '',
  uploaderClasses: 'uploader-container',
  counterClasses: 'counter-text',
  inputClasses: 'file-input',
  idRef: 'uploaderChipRef',
  translationPath: undefined,
  parentTranslationPath: '',
  translationPathShared: 'Shared:',
  accept: undefined,
  type: undefined,
  titleText: undefined,
  chipHandler: undefined,
  labelValue: undefined,
  uploaderTheme: undefined,
  multiple: false,
  isRequired: undefined,
  onIsUploadingChanged: undefined,
  uploadedFileChanged: undefined,
  fileItemDeleteDisabledHandler: undefined,
  defaultImage: undefined,
  helperText: undefined,
  uploaderBtnText: undefined,
  isDisabled: false,
  isDisabledDelete: false,
  isWithGalleryPreview: false,
  isDownloadable: false,
  isViewUploadedFilesCount: false,
  isSubmitted: false,
  maxFileNumber: 5,
  dropHereText: 'drop-here-max-default',
  inputPlaceholder: undefined,
  label: undefined,
  inputThemeClass: undefined,
  isDynamicCheck: undefined,
  customAPIUploader: undefined,
  customSingleAPIUploader: undefined,
  customAPIBody: undefined,
  customAPIParams: undefined,
  customAPIHeaders: undefined,
  company_uuid: undefined,
};

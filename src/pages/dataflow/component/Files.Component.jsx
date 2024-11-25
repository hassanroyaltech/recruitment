// Import React Components
import React, { useState, useCallback, useRef } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { SystemActionsEnum, UploaderTypesEnum } from 'enums';
import { GetDataFlowDropdown, UploadFilesForDataFlow } from 'services';
import { showError, showSuccess } from 'helpers';
import { SharedAPIAutocompleteControl } from 'pages/setups/shared';
import './FilesComponent.Style.scss';

const FilesComponent = ({
  parentTranslationPath,
  state,
  errors,
  isSubmitted,
  onStateChanged,
  isLoading,
  parentId,
  required,
  parentIndex,
  categoryAPIType,
  withCategory,
  withoutAdd,
  label,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const fileInputRef = useRef([]);
  const [files, setFiles] = useState([
    {
      category: '',
      name: '',
    },
  ]);

  const UploadFileHandler = useCallback(
    async (file, index) => {
      const res = await UploadFilesForDataFlow({ files: file.target.files?.[0] });
      if (res.status === 200) {
        showSuccess('File uploaded successfully!');
        let localFiles = [...files];
        localFiles[index] = {
          ...localFiles[index],
          file: res.data?.date?.[0],
          name: file.target.files?.[0].name,
          media_uuid: res.data?.date?.[0]?.media_uuid,
        };
        setFiles(localFiles);
        onStateChanged({ id: 'files', parentId, value: localFiles, parentIndex });
      } else showError('Failed to upload file!');
    },
    [files, onStateChanged, parentId, parentIndex],
  );

  // const onAttachmentClicked = useCallback(
  //   (actionKey, media_uuid) => async () => {
  //     const mediaResponse = await GetMultipleMedias({
  //       uuids: [media_uuid],
  //     });
  //     if (
  //       mediaResponse
  //       && mediaResponse.status === 200
  //       && mediaResponse.data.results.data.length > 0
  //     ) {
  //       const localFile = mediaResponse.data.results.data[0].original;
  //       const link = document.createElement('a');
  //       link.setAttribute('target', '_blank');
  //       link.download = localFile.url;
  //       link.href = localFile.url;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     } else showError(t('Shared:failed-to-get-uploaded-file'), mediaResponse);
  //   },
  //   [t],
  // );

  return (
    <div className="mt-4 mb-2">
      {!withoutAdd && (
        <ButtonBase
          onClick={() => {
            const localFiles = [...(files || [])];
            localFiles.push({
              file: '',
              category: '',
            });
            setFiles(localFiles);
            onStateChanged({
              id: 'files',
              parentId: parentId,
              value: localFiles,
              parentIndex,
            });
          }}
          className="btns theme-solid"
        >
          <span className="mdi mdi-plus" />
          <span>{t('add-file')}</span>
        </ButtonBase>
      )}
      {files?.map((item, index) => (
        <div key={`${index + 1}-atachments`} className=" mt-4">
          {label && <div className="fw-bold my-2 mx-2">{label}</div>}
          <div className="d-flex-v-center">
            {withCategory && (
              <SharedAPIAutocompleteControl
                isEntireObject
                isHalfWidth
                errors={errors}
                title="category"
                searchKey="search"
                parentId={parentId}
                errorPath={`${parentId}${
                  parentIndex || parentIndex === 0 ? `[${parentIndex}]` : ''
                }.files[${index}].category`}
                placeholder="category"
                // isDisabled={isLoading}
                stateKey="category"
                isSubmitted={isSubmitted}
                onValueChanged={(e) => {
                  let localFiles = [...files];
                  localFiles[index] = {
                    ...localFiles[index],
                    category: e.value,
                  };
                  setFiles(localFiles);
                  onStateChanged({
                    id: 'files',
                    parentId: parentId,
                    value: localFiles,
                    parentIndex,
                  });
                }}
                getDataAPI={GetDataFlowDropdown}
                extraProps={{
                  // ...(state.local_files?.category && {
                  //   with_than: [state.local_files?.category],
                  // }),
                  type: categoryAPIType,
                }}
                editValue={item.category?.uuid || ''}
                parentTranslationPath={parentTranslationPath}
                getOptionLabel={(option) =>
                  option.name[i18next.language] || option.name.en
                }
                controlWrapperClasses="m-0"
              />
            )}
            <ButtonBase
              className="btns-icon theme-transparent mx-1 "
              onClick={(event) => {
                fileInputRef?.current?.[index]?.click();
              }}
            >
              <input
                style={{ display: 'none' }}
                type="file"
                label={t('upload-file')}
                accept={`${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Docs.accept}`}
                onChange={(event) => {
                  event.persist();
                  UploadFileHandler(event, index);
                }}
                multiple="multiple"
                max="5"
                ref={(el) => (fileInputRef.current[index] = el)}
              />
              <span className={SystemActionsEnum.attachment.icon} />
            </ButtonBase>
            {item.file && (
              <div
                className="d-flex-v-center"
                style={{
                  border: '1px solid',
                  borderStyle: 'dashed',
                  padding: '0.2rem',
                  borderColor: 'lightgray',
                  marginLeft: '0.5rem',
                }}
              >
                <div>
                  <a
                    // download
                    rel="noreferrer"
                    target="_blank"
                    className="attachment-file-icon mx-2"
                    href={item?.file?.media_uuid}
                  >
                    <span className={SystemActionsEnum.file.icon} />
                  </a>
                </div>
                <div className="mx-2">{item.name}</div>
                {/* {[SystemActionsEnum.download, SystemActionsEnum.view].map(
                  (action, actionIndex) => (
                    <div key={`${action.key}-${actionIndex}`}>
                      <ButtonBase
                        className="btns-icon theme-transparent mr-1-reversed c-primary"
                      >
                        {SystemActionsEnum.view.key === action.key && (
                          <ButtonBase
                            className="btns-icon theme-transparent"
                          // onClick={onAttachmentClicked(
                          //   SystemActionsEnum.view.key,
                          //   item?.file?.media_uuid,
                          // )}
                          >
                            <span
                              className={SystemActionsEnum.view.icon}
                            />
                          </ButtonBase>
                        )}
                        {SystemActionsEnum.download.key === action.key && (
                          <ButtonBase
                            className="btns-icon theme-transparent"
                          // onClick={onAttachmentClicked(
                          //   SystemActionsEnum.download.key,
                          //   item?.file?.media_uuid,
                          // )}
                          >
                            <span
                              className={SystemActionsEnum.download.icon}
                            />
                          </ButtonBase>
                        )}
                      </ButtonBase>
                    </div>
                  )
                )} */}
              </div>
            )}
            <ButtonBase
              onClick={() => {
                const localFiles = [...(files || [])];
                localFiles.splice(index, 1);
                setFiles(localFiles);
                onStateChanged({
                  id: 'files',
                  parentId,
                  value: localFiles,
                  parentIndex,
                });
              }}
              disabled={required && files.length === 1}
            >
              <span className="fas fa-times ml-3" />
            </ButtonBase>
            {errors?.[
              `${parentId}${
                parentIndex || parentIndex === 0 ? `[${parentIndex}]` : ''
              }.files[${index}].name`
            ]
              && isSubmitted && (
              <span className="c-danger mx-2">{t('file-field-is-required')}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilesComponent;

FilesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    // local_files: PropTypes.array,
  }),
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  parentId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  parentIndex: PropTypes.number,
  categoryAPIType: PropTypes.string,
  withCategory: PropTypes.bool,
  withoutAdd: PropTypes.bool,
  label: PropTypes.bool,
};

FilesComponent.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
  required: undefined,
  parentIndex: undefined,
  categoryAPIType: undefined,
  withCategory: undefined,
  withoutAdd: undefined,
  label: undefined,
};

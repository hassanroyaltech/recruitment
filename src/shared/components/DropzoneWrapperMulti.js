import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { commonAPI } from 'api/common';

const Container = styled.div`
  align-items: center;
  background-color: #fafafa;
  border-color: #eeeeee;
  border-radius: 2px;
  border-style: dashed;
  border-width: 2px;
  color: #bdbdbd;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  outline: none;
  padding: 20px;
  position: relative;
  transition: border 0.24s ease-in-out;
  &:hover {
    border-color: #d0d0d0;
  }
`;

const DropzoneWrapperMulti = ({
  feature,
  multiple,
  accept,
  onDoneUploading,
  maxSize,
  children,
  className,
  message,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const onDropAccepted = async (acceptedFiles) => {
    if (acceptedFiles.length <= 0) return;
    // Upload Logic
    setIsUploading(true);
    acceptedFiles.forEach((item) => {
      const fileData = new FormData();
      fileData.append('file', item);
      fileData.append('type', item.type.split('/')[0]);
      fileData.append('from_feature', feature);
      // return;
      commonAPI
        .createMedia(fileData)
        .then((res) => {
          setIsUploading(false);
          files.push(res.data.results.original);
          setFiles(files);
          onDoneUploading(files);
        })
        .catch(() => {
          setIsUploading(false);
        });
    });
  };

  return (
    <Dropzone
      multiple={multiple}
      onDropAccepted={onDropAccepted}
      accept={accept || 'image/*, video/*'}
      maxSize={maxSize || 10000000}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
      }) => (
        <div>
          <Container
            className={`hover-on-this ${className}`}
            {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
          >
            <input {...getInputProps()} />
            {isUploading && <i className="fas fa-circle-notch fa-spin fa-2x" />}
            {!isUploading && (
              <p className="mb-0 files-preview__message">
                {message
                  || "Drag 'n' drop some files here, or click to select files"}
              </p>
            )}
            {children}
          </Container>
        </div>
      )}
    </Dropzone>
  );
};

export default DropzoneWrapperMulti;

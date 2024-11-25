import React from 'react';
import Dropzone from 'react-dropzone';

const DropzoneWrapper = ({
  multiple,
  onUpload,
  accept,
  maxFileSize,
  maxFiles,
  children,
  className,
  disabled,
}) => (
  <Dropzone
    multiple={multiple}
    onDrop={(files) => files.length > 0 && onUpload(files)}
    accept={accept || 'image/*, application/pdf'}
    maxSize={maxFileSize}
    maxFiles={maxFiles}
    disabled={disabled}
  >
    {({ getRootProps, getInputProps }) => (
      <div className={className} {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
      </div>
    )}
  </Dropzone>
);

export default DropzoneWrapper;

import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';

const PreviewWrapper = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075);
  display: flex;
  padding: 0.25rem;
`;
const Img = styled.img`
  max-height: 400px;
  max-width: 100%;
  object-fit: cover;
`;

const Video = styled.video`
  max-width: 100%;
`;
const DeleteButton = styled(Button)`
  background: transparent;
  background-color: transparent;
  max-height: 400px;
  padding: 0;
  position: absolute;
  right: -40px;
  top: 10px;
  z-index: 1000;
  &:hover {
    background: transparent;
    background-color: transparent;
  }
`;

const FilesPreview = ({ index, file, isDeleting, deleteMedia, ...rest }) => (
  <React.Fragment>
    <PreviewWrapper>
      {file.type === 'image' && (
        <Img
          src={file.media ? file.media : file.url}
          loading="lazy"
          alt="preview-image"
          {...rest}
        />
      )}
      {file.type === 'video' && (
        <Video
          controls
          width="100%"
          height="auto"
          className="rounded border shadow-lg"
          onClick={(e) => e.stopPropagation()}
          {...rest}
        >
          <source src={file.media ? file.media : file.url} type="video/mp4" />
          Your browser does not support the video tag.
        </Video>
      )}
    </PreviewWrapper>
    {/* Delete Button */}
    <DeleteButton
      type="button"
      data-placement="center"
      title="Delete File"
      onClick={(e) => {
        e.stopPropagation();
        deleteMedia(file, index);
      }}
      className="btn shadow-none btn-icon-only rounded-circle to-show-this"
    >
      {isDeleting && <i className="fas fa-circle-notch fa-spin" />}
      {!isDeleting && (
        <span className="btn-inner--icon text-danger">
          <i className="fas fa-trash" />
        </span>
      )}
    </DeleteButton>
  </React.Fragment>
);
export default FilesPreview;

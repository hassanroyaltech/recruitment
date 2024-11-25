import React from 'react';
import { CardBody } from 'reactstrap';

export function DropzoneMultiple(props) {
  const fileInputRef = React.createRef();

  return (
    <CardBody>
      <div className="dropzone dropzone-multiple" id={props.id}>
        <div className="fallback">
          <div className="custom-file">
            <input
              className="custom-file-input"
              id="customFileUploadMultiple"
              multiple="multiple"
              type="file"
            />
            <label className="custom-file-label" htmlFor="customFileUploadMultiple">
              Choose file
            </label>
          </div>
        </div>
      </div>
      <input
        id={`${props.id}_input`}
        ref={fileInputRef}
        className="FileInput"
        type="hidden"
      />
      <div id={`${props.id}_div`} className="FileInput" />
    </CardBody>
  );
}

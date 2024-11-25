// React and reactstrap
import React from 'react';
import { Button, Card } from 'reactstrap';

// Import classnames
import classnames from 'classnames';

/**
 * Function that returns an UploadingItem
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const UploadingItem = (props) => {
  // Define props
  const { file, active, onClose } = props;

  // Define other constants
  const { uuid, data, progress } = file;

  // Define progress bar equation
  const percentage = Math.floor((progress * 100) / 100);

  /**
   * Return JSX
   */
  return (
    <Card
      className={classnames(
        'uploading-item d-flex flex-row align-items-center',
        active && 'active-item',
      )}
    >
      <div className="mr-3 item-logo">
        <i className="fas fa-file-pdf" style={{ color: '#d9300b' }} />
      </div>
      <div className="flex-grow-1 mr-4 d-flex flex-column align-items-start justify-content-center font-12">
        <div className="w-100 d-flex flex-row justify-content-between">
          <div className="text-gray mb-1 font-weight-bold">{data.name}</div>
          {percentage <= 100 && (
            <div className="text-gray text-light-gray">{percentage}%</div>
          )}
        </div>
        <div className="mt-2 w-100">
          {percentage <= 100 ? (
            <div className="uploading-progress-wrapper w-100">
              <div
                className="uploading-progress-content"
                style={{ width: `${percentage}%` }}
              />
            </div>
          ) : (
            <div className="mt--1 text-light-gray">{data.size} kb</div>
          )}
        </div>
        {file.errors
          && file.errors.map((item, index) => (
            <p key={`${index + 1}-error`} className="text-danger font-12">
              {item}
            </p>
          ))}
      </div>
      <div className="uploading-actions">
        {percentage < 100 && (
          <Button onClick={onClose}>
            <i className="fa fa-times" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UploadingItem;

// Import react
import React from 'react';

/**
 * This component displays the Uploading text with spinner inside a div.
 * It is used while files are currently 'Uploading' and have not reached
 * the 'Uploaded' status.
 */
export class Uploading extends React.Component {
  render() {
    return (
      <React.Fragment>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem' }} />
        <span className="h6 text-gray ml-2 mb-0">Uploading...</span>
      </React.Fragment>
    );
  }
}

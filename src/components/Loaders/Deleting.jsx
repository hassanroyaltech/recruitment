// Import react
import React from 'react';

/**
 * This component displays the Deleting text with spinner inside a div.
 * It is used while files are 'Deleting' and have not reached
 * the 'Deleted' status.
 */
export class Deleting extends React.Component {
  render() {
    return (
      <React.Fragment>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem' }} />
        <span className="h6 text-gray ml-2 mb-0">Deleting...</span>
      </React.Fragment>
    );
  }
}

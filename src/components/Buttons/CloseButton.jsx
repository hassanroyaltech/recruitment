/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
// Import react
import React from 'react';

/**
 * A close button for modals. Every modal needs to have a close capability
 * since this behavior is prevented using keyboard 'escape' and mouse click.
 *
 * This is a CloseButton component to be used for this purpose in all
 * modals (and other objects).
 */
export const CloseButton = (props) => (
  <button
    type="button"
    className="close"
    data-dismiss={props.objectToDismiss}
    aria-hidden="true"
    onClick={props.onClick}
  >
    <i className="fas fa-times" />
  </button>
);

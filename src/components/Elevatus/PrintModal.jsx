// React and reactstrap
import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

// Component to copy to clipboard
import CopyToClipboardInput from 'components/Elevatus/CopyToClipboardInput';

/**
 * A function that returns the modal to share a profile
 * @param isOpen
 * @param onClose
 * @param url
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PrintModal = ({ isOpen, onClose, url, title, discription }) => (
  /**
   * Return JSX
   */
  <Modal
    className="modal-dialog-centered share-candidate-modal"
    isOpen={isOpen}
    toggle={onClose}
  >
    <div className="modal-header border-0">
      <h3 className="h3 mb-0 ml-5 mt-3">{title}</h3>
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-hidden="true"
        onClick={onClose}
      >
        <i className="fas fa-times" />
      </button>
    </div>
    <ModalBody
      className="modal-body pt-0"
      style={{ overflow: 'auto', maxHeight: '100%' }}
    >
      <React.Fragment>
        <div className="px-5 pb-3">
          <div className="h6 font-weight-normal" style={{ color: '#899298' }}>
            {discription}
          </div>
          <div className="mt-4 mx--2" style={{ width: 500 }}>
            <CopyToClipboardInput link={url} />
          </div>
        </div>
      </React.Fragment>
    </ModalBody>
  </Modal>
);
export default PrintModal;

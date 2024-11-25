// Import react
import React from 'react';
import Loader from 'components/Elevatus/Loader';
import { DialogComponent } from '../Dialog/Dialog.Component';

/**
 * This component displays the Uploading text with spinner inside a div.
 * It is used while files are currently 'Uploading' and have not reached
 * the 'Uploaded' status.
 */
const StandardModalFrame = (props) => (
  <DialogComponent
    maxWidth={props.size || 'sm'}
    titleText={props.modalTitle}
    contentClasses="px-0"
    dialogContent={
      <div className="standard-dialog-wrapper">
        {props.isLoading && <Loader />}
        {!props.isLoading && (
          <>
            {props.modalBody}
            {props.children}
          </>
        )}
      </div>
    }
    wrapperClasses="setups-management-dialog-wrapper"
    isOpen={props.isOpen}
    onCloseClicked={props.closeOnClick}
  />
  // <Modal
  //   className={props.className || 'modal-dialog-centered'}
  //   size={props.size || 'md'}
  //   isOpen={props.isOpen}
  //   toggle={props.toggle}
  //   backdrop="static"
  //   keyboard={false}
  //   style={props.style}
  // >
  //   {props.isLoading && <Loader />}
  //   {!props.isLoading && (
  //     <div className={props.divHeightClass || ''}>
  //       {props.modalHeader ? (
  //         props.modalHeader
  //       ) : (
  //         <>
  //           <div className="modal-header w-100 border-0">
  //             <h3 className="h3 mb-0 ml-2-reversed">
  //               {props.modalTitle}
  //             </h3>
  //             <CloseButton
  //               objectToDismiss="modal"
  //               onClick={props.closeOnClick}
  //             />
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   )}
  // </Modal>
);
export { StandardModalFrame };

/**
 * ----------------------------------------------------------------------------------
 * @title StandardModal.jsx
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 *
 * This class standardizes all modals so that it would receive a series of props
 * and render the entire component accordingly.

 * This way, we won't need to have 35+ modals. Instead, we would a single modal
 * that accepts various manifests, and therefore state will be maintained through the
 * manifest.
 */

// Import react
import React from 'react';
import {
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { BoardsLoader } from 'shared/Loaders';
import { CloseButton } from '../Buttons/CloseButton';

/**
 * This component displays the Uploading text with spinner inside a div.
 * It is used while files are currently 'Uploading' and have not reached
 * the 'Uploaded' status.
 */
export class StandardModal extends React.Component {
  /**
   * Render the component
   *
   * We will first pass all the 'base' values into a Modal component. This will
   * enable basic capability, such as scss class names, size and the isOpen state.
   *
   * @returns {JSX.Element}
   */
  render() {
    return (
      <React.Fragment>
        {/* MODAL COMPONENT
         We pass the isOpen state
         Define classnames, size class and the style
         Disable exit on Escape and Mouseclick outside modal area
         */}
        <Modal
          isOpen={this.props.isOpen}
          className={this.props.className || 'modal-dialog-centered'}
          size={this.props.size || 'md'}
          style={this.props.style}
          backdrop="static"
          keyboard={false}
        >
          {/* MODAL HEADER COMPONENT */}
          <div className={this.props.divHeightClass || ''}>
            {this.props.header ? (
              this.props.header
            ) : (
              <React.Fragment>
                <div className="modal-header border-0">
                  {/* TITLE and LANGUAGE TAG */}
                  <div className="d-flex align-items-center">
                    <h3 className="h3 mb-0 mx-3 mt-3">{this.props.title}</h3>
                    {this.props.languageTag && (
                      <Badge className="badge-default mt-3 mx-2 font-12">
                        {this.props.languageTag}
                      </Badge>
                    )}
                  </div>
                  {/* CLOSE BUTTON */}
                  <CloseButton
                    objectToDismiss="modal"
                    onClick={this.props.onClose}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
          {/* MODAL BODY COMPONENT */}
          <ModalBody
            className="modal-body pt-0 mx-3 mb-3"
            style={{ overflow: 'auto', height: '60vh' }}
          >
            {/* SUBTITLE (placed inside the body for style purposes */}
            {this.props.subtitle && (
              <div>
                <h6 className="h6 mb-3 text-gray">{this.props.subtitle}</h6>
              </div>
            )}

            {/* The isLoading state is passed inside the body and after the
              subtitle, this allows us to set the state and re-render the contents
              of the modal without affecting the header and the frame. */}
            {/* {this.props.isLoading ? (<BoardsLoader />) : ( */}
            <React.Fragment>
              {/* // MODAL TABS (if exists) */}
              {this.props.tabs ? (
                <Nav tabs className="tabs-with-actions pt-3">
                  {this.props.tabs.map((key, index) => (
                    <NavItem key={index}>
                      <NavLink
                        className="py-2"
                        active={this.props.currentTab === `tab-${index + 1}`}
                        onClick={() => this.props.setCurrentTab(`tab-${index + 1}`)}
                      >
                        {this.props.tabs[index]}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              ) : null}
              {/* MODAL CHILDREN
                  - isLoading conditional
                  - Body content
                  - Children passed
                  - Buttons
               */}
              {this.props.isLoading ? (
                <React.Fragment>
                  <BoardsLoader />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.props.body}
                  {this.props.children}
                </React.Fragment>
              )}
            </React.Fragment>
          </ModalBody>

          {/* FOOTER for BUTTONS */}
          <ModalFooter className="border-0 d-flex justify-content-center">
            {this.props.buttons}
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

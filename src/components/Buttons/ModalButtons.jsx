/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title ModalButtons.jsx
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * This module contains a ModalButtons class to be used in all modals.
 *
 * The way this works is simple, it is a constructor of various buttons.
 * If we need a 'Cancel' button, then we simply pass the boolean property
 * 'cancelButton', and this will enable it. It will then expect a
 * 'cancelButtonHandler' to go with it.
 *
 * This is also true for the 'saveButton' and 'submitButton', which in addition to
 * their respective handlers, they expect an 'isSaving' and an 'isSubmitting' state
 * to preview a nice circle-notch spinner while loading.
 *
 * All buttons can also be disabled through the 'cancelButtonDisabled',
 * 'saveButtonDisabled' and 'submitButtonDisabled' state properties.
 *
 * It makes use of the 'StandardButton' component.
 */
import React from 'react';
import { StandardButton } from './StandardButton';

/**
 * The ModalButtons class component.
 * Used in all modals
 */
const ModalButtons = (props) => (
  <>
    {/* CANCEL BUTTON */}
    {props.cancelButton && (
      <StandardButton
        color="light"
        label="cancel"
        disabled={props.cancelButtonDisabled}
        onClick={props.cancelButtonHandler}
      />
    )}

    {/* SAVE BUTTON */}
    {props.saveButton && (
      <StandardButton
        label="save"
        disabled={props.saveButtonDisabled}
        onClick={props.saveButtonHandler}
        loading={props.isSaving}
      />
    )}

    {/* SUBMIT BUTTON */}
    {props.submitButton && (
      <StandardButton
        label="submit"
        disabled={props?.submitButtonDisabled}
        onClick={props.submitButtonHandler}
        loading={props.isSubmitting}
      />
    )}
  </>
);
export { ModalButtons };

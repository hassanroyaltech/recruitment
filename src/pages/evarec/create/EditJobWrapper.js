import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import CreateJob from './index';

/**
 * A wrapper function component for the CreateJob component
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditJobWrapper() {
  /**
   * Return JSX
   */
  return (
    <ToastProvider placement="top-center">
      <CreateJob edit modalTitle="Edit an existing application" />
    </ToastProvider>
  );
}

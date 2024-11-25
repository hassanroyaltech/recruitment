import { DialogComponent } from '../../../components';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GetAllDashboards } from '../../../services';

export const MoveToDashboardDialog = ({
  isOpen,
  setIsOpen,
  isLoading,
  widget_edit_data,
  moveWidgetToDashboardHandler,
  parentTranslationPath,
}) => {
  const [selectedDashboard, setSelectedDashboard] = useState('');

  return (
    <DialogComponent
      titleText="move-widget-to-dashboard"
      maxWidth="sm"
      dialogContent={
        <div className="d-flex-column my-4">
          <SharedAPIAutocompleteControl
            isFullWidth
            title="dashboard"
            placeholder="select-dashboard"
            stateKey="dashboard"
            onValueChanged={(newValue) => setSelectedDashboard(newValue.value)}
            getOptionLabel={(option) => option.title}
            getDataAPI={GetAllDashboards}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            editValue={selectedDashboard}
            extraProps={{
              use_for: 'dropdown',
            }}
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      isOldTheme
      onSaveClicked={(e) => {
        e.preventDefault();
        moveWidgetToDashboardHandler({
          widget_uuid: widget_edit_data.uuid,
          dashboard_uuid: selectedDashboard,
          closeDialogHandler: () => {
            setIsOpen(false);
            setSelectedDashboard('');
          },
          is_dynamic: !widget_edit_data.is_static,
        });
      }}
      onCloseClicked={() => setIsOpen(false)}
      onCancelClicked={() => setIsOpen(false)}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

MoveToDashboardDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  widget_edit_data: PropTypes.shape({
    uuid: PropTypes.string,
    is_static: PropTypes.bool,
  }).isRequired,
  moveWidgetToDashboardHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

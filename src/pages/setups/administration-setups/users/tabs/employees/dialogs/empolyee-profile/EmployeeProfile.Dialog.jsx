import React from 'react';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../../../../components';
import { EmployeeProfileComponent } from './EmployeeProfile.Dialog.Content';

export const EmployeeProfileDialog = ({
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => (
  <DialogComponent
    maxWidth="lg"
    titleText="employee-profile"
    dialogContent={
      <div className="setups-management-content-dialog-wrapper">
        <EmployeeProfileComponent activeItem={activeItem} />
      </div>
    }
    isOpen={isOpen}
    onCloseClicked={isOpenChanged}
    translationPath={translationPath}
    isEdit={(activeItem && true) || undefined}
    parentTranslationPath={parentTranslationPath}
    wrapperClasses="setups-management-dialog-wrapper"
    saveType=""
  />
);

EmployeeProfileDialog.propTypes = {
  isOpen: PropTypes.bool,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
};

EmployeeProfileDialog.defaultProps = {
  isOpen: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'EmployeeProfilePage.',
  parentTranslationPath: 'SetupsPage',
};

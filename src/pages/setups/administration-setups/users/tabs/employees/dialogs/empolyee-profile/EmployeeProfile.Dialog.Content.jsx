import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TabsComponent } from '../../../../../../../../components';
import { EmployeeProfileTabs } from '../../../../../../shared/tabs-data';

const translationPath = 'EmployeeProfilePage.';
const parentTranslationPath = 'SetupsPage';

export const EmployeeProfileComponent = ({ activeItem }) => {
  const [employeeProfileData] = useState(() => EmployeeProfileTabs);

  const managementDialogMessagesRef = useRef({
    updateSuccessMessage: 'update-success-message',
    createSuccessMessage: 'create-success-message',
    updateFailedMessage: 'update-failed-message',
    createFailedMessage: 'create-failed-message',
  });
  const deleteDialogMessagesRef = useRef({
    successMessage: 'deleted-successfully',
    descriptionMessage: 'delete-description',
    errorMessage: 'delete-failed',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
    employee_uuid: '',
  });
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change filter from child
   */
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };

  useEffect(() => {
    if (activeItem?.uuid)
      setFilter((items) => ({ ...items, employee_uuid: activeItem.uuid }));
  }, [activeItem]);

  return (
    <TabsComponent
      isPrimary
      isWithLine
      labelInput="label"
      idRef="employeeProfileTabsRef"
      currentTab={activeTab}
      data={employeeProfileData}
      onTabChanged={(event, currentTab) => {
        setActiveTab(currentTab);
      }}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      dynamicComponentProps={{
        filter,
        onFilterChanged,
        parentTranslationPath,
        translationPath,
        updateSuccessMessage:
          managementDialogMessagesRef.current.updateSuccessMessage,
        updateFailedMessage: managementDialogMessagesRef.current.updateFailedMessage,
        createSuccessMessage:
          managementDialogMessagesRef.current.createSuccessMessage,
        createFailedMessage: managementDialogMessagesRef.current.createFailedMessage,
        successMessage: deleteDialogMessagesRef.current.successMessage,
        descriptionMessage: deleteDialogMessagesRef.current.descriptionMessage,
        errorMessage: deleteDialogMessagesRef.current.errorMessage,
      }}
    />
  );
};

EmployeeProfileComponent.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
};

EmployeeProfileComponent.defaultProps = {
  activeItem: undefined,
};

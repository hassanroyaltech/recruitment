import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../components';
import { AssigneeTypesEnum, DynamicFormTypesEnum } from '../../../../../enums';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../setups/shared';
import {
  GetAllSetupsUsers,
  getSetupsUsersById,
  SearchDBUpdateAssignedUser,
} from '../../../../../services';
import { showError, showSuccess } from '../../../../../helpers';

export const AssignUserManagementDialog = ({
  isOpen,
  onSave,
  isOpenChanged,
  selectedApplicants,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const localSelectedCandidateUUIDsRef = useRef([...selectedCandidatesUUIDs]);
  const [isLoading, setIsLoading] = useState(false);
  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [assignee, setAssignee] = useState({
    assigned_user_type: null,
    assigned_user_uuid: null,
  });
  const updateAssigneeHandler = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      const response = await Promise.all(
        selectedApplicants.map((item) =>
          SearchDBUpdateAssignedUser({
            candidate_email: item.email,
            ...assignee,
          }),
        ),
      );
      setIsLoading(false);
      const failedToSaved
        = (response
          && response.filter(
            (item) =>
              item.status !== 200 && item.status !== 201 && item.status !== 202,
          ))
        || [];
      if (response && failedToSaved.length === 0) {
        showSuccess(t('Shared:updated-successfully'));
        onSave();
        isOpenChanged();
      } else {
        showError(t('Shared:failed-to-update'), response);
        isOpenChanged();
      }
    },
    [assignee, isOpenChanged, onSave, selectedApplicants, t],
  );
  return (
    <DialogComponent
      maxWidth="xs"
      isWithFullScreen
      titleText="assignee"
      dialogContent={
        <div className="assign-user-management-dialog-wrapper">
          <SharedAutocompleteControl
            isFullWidth
            searchKey="search"
            initValuesKey="key"
            // isDisabled={isLoading}
            initValues={assigneeTypes}
            stateKey="assigned_user_type"
            onValueChanged={({ value }) => {
              setAssignee((items) => ({
                ...items,
                assigned_user_type: value,
                assigned_user_uuid: null,
              }));
            }}
            title="assignee-type"
            editValue={assignee.assigned_user_type}
            placeholder="select-assignee-type"
            parentTranslationPath={parentTranslationPath}
          />
          {assignee.assigned_user_type && (
            <>
              {assignee.assigned_user_type === AssigneeTypesEnum.Employee.key && (
                <SharedAPIAutocompleteControl
                  title="assignee"
                  isFullWidth
                  placeholder={t('select-assignee')}
                  stateKey="assigned_user_uuid"
                  onValueChanged={({ value }) => {
                    setAssignee((items) => ({
                      ...items,
                      assigned_user_uuid: value,
                    }));
                  }}
                  isDisabled={isLoading}
                  idRef="assigned_user_uuid"
                  getOptionLabel={(option) =>
                    `${
                      option.first_name
                      && (option.first_name[i18next.language] || option.first_name.en)
                    }${
                      option.last_name
                      && ` ${option.last_name[i18next.language] || option.last_name.en}`
                    }${
                      (!option.has_access
                        && ` ${t('Shared:dont-have-permissions')}`)
                      || ''
                    }`
                  }
                  type={DynamicFormTypesEnum.select.key}
                  getDataAPI={GetAllSetupsUsers}
                  getItemByIdAPI={getSetupsUsersById}
                  parentTranslationPath={parentTranslationPath}
                  searchKey="search"
                  editValue={assignee.assigned_user_uuid}
                  extraProps={{
                    committeeType: 'all',
                  }}
                  getDisabledOptions={(option) => !option.has_access}
                />
              )}
              {assignee.assigned_user_type === AssigneeTypesEnum.User.key && (
                <SharedAPIAutocompleteControl
                  isFullWidth
                  title="assignee"
                  stateKey="assigned_user_uuid"
                  placeholder="select-assignee"
                  isDisabled={isLoading}
                  onValueChanged={({ value }) => {
                    setAssignee((items) => ({
                      ...items,
                      assigned_user_uuid: value,
                    }));
                  }}
                  searchKey="search"
                  getDataAPI={GetAllSetupsUsers}
                  // getItemByIdAPI={getSetupsUsersById}
                  parentTranslationPath={parentTranslationPath}
                  getOptionLabel={(option) =>
                    `${
                      option.first_name
                      && (option.first_name[i18next.language] || option.first_name.en)
                    }${
                      option.last_name
                      && ` ${option.last_name[i18next.language] || option.last_name.en}`
                    }`
                  }
                  editValue={assignee.assigned_user_uuid}
                  extraProps={{
                    ...(assignee.assigned_user_uuid && {
                      with_than: assignee.assigned_user_uuid,
                    }),
                  }}
                />
              )}
            </>
          )}
        </div>
      }
      wrapperClasses="assign-user-management-dialog-wrapper"
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={updateAssigneeHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

AssignUserManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedApplicants: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
AssignUserManagementDialog.defaultProps = {
  selectedApplicants: [],
  translationPath: '',
};

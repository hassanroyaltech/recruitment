import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import {
  CreateJobRequisitions,
  GetAllSetupsUsers,
  getSetupsUsersById,
} from '../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../enums';
import {
  SharedAPIAutocompleteControl,
  SetupsReducer,
  SetupsReset,
} from '../../../../setups/shared';

export const AssignToUsersDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [usersExtraProps] = useState({
  //   job_requisition_uuid: (activeItem && activeItem.uuid) || null,
  // });
  const stateInitRef = useRef({
    user_uuid: [],
    job_requisition_uuid: (activeItem && activeItem.uuid) || null,
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          user_uuid: yup
            .array()
            .nullable()
            .min(1, t('Shared:this-field-is-required'))
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  // /**
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to check if the string is html or not
  //  */
  // const getEditInit = useCallback(async () => {
  //   setIsLoading(true);
  //   const response = await getSetupsProjectsById({
  //     uuid: activeItem && activeItem.uuid,
  //   });
  //   setIsLoading(false);
  //   if (response && response.status === 200)
  //     setState({ id: 'edit', value: response.data.results });
  //   else {
  //     showError(t('Shared:failed-to-get-saved-data'), response);
  //     isOpenChanged();
  //   }
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeItem, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    const response = await CreateJobRequisitions(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(t(`${translationPath}assign-to-users-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}assign-to-users-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem && activeItem.assign_users && activeItem.assign_users.length > 0)
      setState({
        id: 'user_uuid',
        value: activeItem.assign_users,
      });
  }, [activeItem]);
  return (
    <DialogComponent
      maxWidth="xs"
      titleText="assign-to-users"
      contentClasses="px-0"
      dialogContent={
        <div className="assign-to-users-dialog-content-wrapper">
          <SharedAPIAutocompleteControl
            errors={errors}
            title="assign-to"
            placeholder="select-users"
            searchKey="search"
            stateKey="user_uuid"
            errorPath="user_uuid"
            isSubmitted={isSubmitted}
            editValue={state.user_uuid}
            onValueChanged={onStateChanged}
            idRef="usersAutocompleteRef"
            getOptionLabel={(option) =>
              `${
                option.first_name
                && (option.first_name[i18next.language] || option.first_name.en)
              }${
                option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`
              }${
                (!option.has_access
                  && state.user_uuid
                  && !state.user_uuid.includes(option.uuid)
                  && ` ${t('Shared:dont-have-permissions')}`)
                || ''
              }`
            }
            type={DynamicFormTypesEnum.array.key}
            getDataAPI={GetAllSetupsUsers}
            getItemByIdAPI={getSetupsUsersById}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              committeeType: 'all',
              ...(state.user_uuid && { with_than: state.user_uuid }),
            }}
            getDisabledOptions={(option) => !option.has_access}
            // return !getIsAllowedPermissionV2({
            //   permissions: option.user_access,
            //   permissionId: Permissions,
            //   isFullAccess: option.has_access,
            // });
          />
          {/* <SharedAPIAutocompleteControl
            errors={errors}
            title="assign-to"
            placeholder="select-users"
            stateKey="user_uuid"
            errorPath="user_uuid"
            isSubmitted={isSubmitted}
            editValue={state.user_uuid}
            onValueChanged={onStateChanged}
            idRef="usersAutocompleteRef"
            getOptionLabel={(option) => option.name[i18next.language] || option.name.en}
            type={DynamicFormTypesEnum.array.key}
            getDataAPI={GetAllJobRequisitionUsers}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              ...usersExtraProps,
              ...state.user_uuid?.length && { with_than: state.user_uuid },
            }}
          /> */}
        </div>
      }
      wrapperClasses="assign-to-users-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(activeItem && true) || undefined}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

AssignToUsersDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    assign_users: PropTypes.arrayOf(PropTypes.string),
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
AssignToUsersDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'AssignToUsersDialog.',
};

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PermissionsManagementComponent } from '../../../permissions/dialogs/permissions-management/PermissionsManagementComponent';
import {
  UpdateSetupsEmployees,
  GetAllSetupsPermissionsCategories,
} from '../../../../../../services';
import { SetupsReducer, SetupsReset } from '../../../../shared';
import { DialogComponent } from '../../../../../../components';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import './PermissionsManagement.Style.scss';

export const PermissionsManagementDialog = ({
  onSave,
  isOpen,
  singleKey,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsCategories, setPermissionsCategories] = useState([]);
  const schema = useRef(null);
  const stateInitRef = useRef({
    roles_permissions: [],
  });

  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsPermissionsCategories();
    if (response && response.status === 200) {
      const { results } = response.data;
      setPermissionsCategories(results);
      setIsLoading(false);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
      isOpenChanged();
    }
  }, [isOpenChanged, t]);

  /**
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to send a new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    let response;
    if (activeItem) response = await UpdateSetupsEmployees(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && `${singleKey}-updated-successfully`)
            || `${singleKey}-created-successfully`
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && `${singleKey}-update-failed`)
            || `${singleKey}-create-failed`
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  return (
    <DialogComponent
      maxWidth="lg"
      titleText={(activeItem && `edit-${singleKey}`) || `add-new-${singleKey}`}
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          {permissionsCategories && permissionsCategories.length > 0 && (
            <PermissionsManagementComponent
              state={state}
              data={permissionsCategories}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
            />
          )}
        </div>
      }
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
    />
  );
};

PermissionsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onSave: PropTypes.func,
  singleKey: PropTypes.string,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
PermissionsManagementDialog.defaultProps = {
  singleKey: '',
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'UsersInfoDialog.',
};

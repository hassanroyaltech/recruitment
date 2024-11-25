import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  CreateFormsType,
  DeleteFormType,
  GetBuilderFormTypes,
  UpdateFormsType,
} from '../../../../../services';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import {
  getErrorByName,
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import { SystemActionsEnum } from '../../../../../enums';
import { numericAndAlphabeticalAndSpecialExpression } from 'utils';
import { ManageFormBuilderTypesPermissions } from 'permissions';
import { useSelector } from 'react-redux';

export const FormsTypesManagementDialog = ({
  isOpen,
  isOpenChanged,
  onSave,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const stateInitRef = useRef({
    modeType: 1,
    uuid: null,
    name: null,
  });
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
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
          modeType: yup.number().nullable(),
          uuid: yup
            .string()
            .nullable()
            .when(
              'modeType',
              (value, field) =>
                (+value !== 1
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          code: yup
            .string()
            .nullable()
            .when(
              'modeType',
              (value, field) =>
                (+value === 1
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          name: yup.string().nullable().required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

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
    if (state.modeType === 3) {
      setIsOpenDeleteDialog(true);
      return;
    }
    setIsLoading(true);
    const response = await ((state.modeType === 1
      && CreateFormsType({ ...state }))
      || UpdateFormsType({ ...state }));
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
      showSuccess(
        t(
          `${translationPath}forms-type-${
            (state.modeType === 1 && 'created') || 'updated'
          }-successfully`,
        ),
      );
    } else
      showError(
        t(
          `${translationPath}forms-type-${
            (state.modeType === 1 && 'create') || 'update'
          }-failed`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <>
      <DialogComponent
        maxWidth="sm"
        titleText="forms-type-management"
        contentClasses="px-0"
        dialogContent={
          <div className="forms-type-management-content-dialog-wrapper">
            {state.modeType === 1 && (
              <div className="d-flex-v-center-h-end px-2 mb-3">
                <ButtonBase
                  className="btns-icon theme-transparent mx-2"
                  onClick={() => {
                    if (state.name) setState({ id: 'name', value: null });
                    if (isSubmitted) setIsSubmitted(false);
                    setState({ id: 'modeType', value: 3 });
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId:
                        ManageFormBuilderTypesPermissions.DeleteFormBuilderType.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
                <ButtonBase
                  className="btns-icon theme-transparent mx-2"
                  onClick={() => {
                    if (state.name) setState({ id: 'name', value: null });
                    setState({ id: 'modeType', value: 2 });
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId:
                        ManageFormBuilderTypesPermissions.UpdateFormBuilderType.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <span className={SystemActionsEnum.edit.icon} />
                </ButtonBase>
              </div>
            )}
            {state.modeType !== 1 && (
              <div className="d-flex-v-center-h-end px-2 mb-3">
                <ButtonBase
                  className="btns-icon theme-transparent mx-2"
                  onClick={() => {
                    if (state.name) setState({ id: 'name', value: null });
                    if (state.uuid) setState({ id: 'uuid', value: null });
                    setState({ id: 'modeType', value: 1 });
                  }}
                >
                  <span className="fas fa-times" />
                </ButtonBase>
              </div>
            )}
            {state.modeType !== 1 && (
              <SharedAPIAutocompleteControl
                stateKey="uuid"
                placeholder="select-form-type"
                title="form-type"
                isEntireObject
                editValue={state.uuid}
                onValueChanged={({ value }) => {
                  setState({ id: 'uuid', value: (value && value.uuid) || null });
                  setState({ id: 'code', value: (value && value.code) || null });
                  setState({ id: 'name', value: (value && value.name) || null });
                }}
                titleKey="name"
                errors={errors}
                isSubmitted={isSubmitted}
                errorPath="uuid"
                // searchKey="search"
                getDataAPI={GetBuilderFormTypes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                disableClearable
                getOptionLabel={(option) => `${option.name}` || 'N/A'}
              />
            )}
            {state.modeType !== 3 && (
              <>
                <SharedInputControl
                  parentTranslationPath={parentTranslationPath}
                  title="code"
                  editValue={state.code}
                  isDisabled={isLoading || state.modeType === 2}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath="code"
                  stateKey="code"
                  pattern={numericAndAlphabeticalAndSpecialExpression}
                  onValueChanged={onStateChanged}
                />
                <SharedInputControl
                  parentTranslationPath={parentTranslationPath}
                  title="name"
                  editValue={state.name}
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath="name"
                  stateKey="name"
                  onValueChanged={onStateChanged}
                  fullWidth
                  multiline
                  rows={5}
                />
              </>
            )}
          </div>
        }
        wrapperClasses="forms-type-management-dialog-wrapper"
        isSaving={isLoading}
        isOpen={isOpen}
        isEdit={state.modeType === 2}
        saveClasses={
          (state.modeType === 3 && 'btns theme-solid bg-warning') || undefined
        }
        saveText={(state.modeType === 3 && 'delete') || undefined}
        onSubmit={saveHandler}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={state}
          successMessage="form-type-deleted-successfully"
          onSave={onSave}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
          }}
          descriptionMessage="form-type-delete-description"
          deleteApi={DeleteFormType}
          apiProps={{
            uuid: state && [state.uuid],
          }}
          errorMessage="form-type-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </>
  );
};

FormsTypesManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
FormsTypesManagementDialog.defaultProps = {
  isOpenChanged: undefined,
};

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../pages/setups/shared';
import { DialogComponent } from '../../../../components';
import {
  GetAllSetupsProviders,
  GetAllSetupsUsers,
  UpdateCandidatesProfileSource,
} from '../../../../services';
import { ProfileSourcesTypesEnum } from '../../../../enums';
import i18next from 'i18next';

const parentTranslationPath = 'ProfileManagementComponent';
const translationPath = '';

export const ProfileSourceManagementDialog = ({
  company_uuid,
  candidate_uuid,
  source_uuid,
  source_type,
  isOpen,
  isOpenChanged,
  onSave,
  job_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [profileSourcesTypes] = useState(
    Object.values(ProfileSourcesTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const stateInitRef = useRef({
    candidate_uuid,
    source_uuid: null,
    source_type: null,
  });
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
  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          candidate_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          source_type: yup
            .number()
            .nullable()
            .oneOf(
              Object.values(ProfileSourcesTypesEnum).map((item) => item.key),
              t('Shared:this-field-is-required'),
            )
            .required(t('Shared:this-field-is-required')),
          source_uuid: yup
            .string()
            .nullable()
            .when(
              'source_type',
              (value, field) =>
                (value
                  && +value !== ProfileSourcesTypesEnum.Portal.key
                  && +value !== ProfileSourcesTypesEnum.Migrated.key
                  && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
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
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const response = await UpdateCandidatesProfileSource(state);
    setIsLoading(false);
    if (response && response.status === 202) {
      setIsSubmitted(false);
      onStateChanged({ id: 'edit', value: stateInitRef.current });
      showSuccess(t(`${translationPath}profile-source-updated-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}profile-source-update-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (isOpen)
      onStateChanged({
        id: 'edit',
        value: {
          ...stateInitRef.current,
          candidate_uuid,
          source_uuid,
          source_type,
        },
      });
  }, [isOpen, onStateChanged, candidate_uuid, source_type, source_uuid]);

  return (
    <DialogComponent
      maxWidth="xs"
      titleText="profile-source-management"
      contentClasses="px-0"
      dialogContent={
        <div className="profile-source-management-content-dialog-wrapper">
          <SharedAutocompleteControl
            isFullWidth
            errors={errors}
            title="source-type"
            isRequired
            stateKey="source_type"
            isDisabled={isLoading}
            isSubmitted={isSubmitted}
            placeholder="select-source-type"
            onValueChanged={(newValue) => {
              if (state.source_uuid)
                onStateChanged({ id: 'source_uuid', value: null });
              onStateChanged(newValue);
            }}
            initValues={profileSourcesTypes}
            editValue={state.source_type}
            parentTranslationPath={parentTranslationPath}
            errorPath="source_type"
          />
          {(state.source_type === ProfileSourcesTypesEnum.RecruiterUser.key
            || state.source_type === ProfileSourcesTypesEnum.RecruiterEmployee.key) && (
            <SharedAPIAutocompleteControl
              title={
                (state.source_type
                  === ProfileSourcesTypesEnum.RecruiterEmployee.key
                  && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                || ProfileSourcesTypesEnum.RecruiterUser.value
              }
              isFullWidth
              placeholder={`select-${
                (state.source_type
                  === ProfileSourcesTypesEnum.RecruiterEmployee.key
                  && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                || ProfileSourcesTypesEnum.RecruiterUser.value
              }`}
              stateKey="source_uuid"
              errors={errors}
              errorPath="source_uuid"
              isSubmitted={isSubmitted}
              isRequired
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${
                  option.first_name
                  && (option.first_name[i18next.language] || option.first_name.en)
                }${
                  option.last_name
                  && ` ${option.last_name[i18next.language] || option.last_name.en}`
                }` || 'N/A'
              }
              getDataAPI={GetAllSetupsUsers}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.source_uuid}
              getByIdCompanyUUID={company_uuid}
              extraProps={{
                company_uuid,
                committeeType:
                  (state.source_type
                    === ProfileSourcesTypesEnum.RecruiterEmployee.key
                    && 'all')
                  || undefined,
                ...(state.uuid
                  && state.source_uuid && {
                  with_than: [state.source_uuid],
                }),
              }}
            />
          )}
          {state.source_type === ProfileSourcesTypesEnum.Agency.key && (
            <SharedAPIAutocompleteControl
              title="agency"
              isFullWidth
              placeholder="select-agency"
              stateKey="source_uuid"
              errors={errors}
              errorPath="source_uuid"
              isSubmitted={isSubmitted}
              isRequired
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.source_uuid}
              getByIdCompanyUUID={company_uuid}
              uniqueKey="user_uuid"
              extraProps={{
                job_uuid,
                company_uuid,
                type: ProfileSourcesTypesEnum.Agency.userType,
                ...(state.uuid
                  && state.source_uuid && {
                  with_than: [state.source_uuid],
                }),
              }}
            />
          )}
          {state.source_type === ProfileSourcesTypesEnum.University.key && (
            <SharedAPIAutocompleteControl
              title="university"
              isFullWidth
              placeholder="select-university"
              stateKey="source_uuid"
              errors={errors}
              errorPath="source_uuid"
              isSubmitted={isSubmitted}
              isRequired
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              uniqueKey="user_uuid"
              editValue={state.source_uuid}
              getByIdCompanyUUID={company_uuid}
              extraProps={{
                job_uuid,
                company_uuid,
                type: ProfileSourcesTypesEnum.University.userType,
                ...(state.uuid
                  && state.source_uuid && {
                  with_than: [state.source_uuid],
                }),
              }}
            />
          )}
        </div>
      }
      wrapperClasses="profile-source-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ProfileSourceManagementDialog.propTypes = {
  candidate_uuid: PropTypes.string,
  company_uuid: PropTypes.string,
  source_uuid: PropTypes.string,
  source_type: PropTypes.oneOf(
    Object.values(ProfileSourcesTypesEnum).map((item) => item.key),
  ),
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  job_uuid: PropTypes.string,
};
ProfileSourceManagementDialog.defaultProps = {
  company_uuid: undefined,
  source_uuid: undefined,
  source_type: undefined,
  onSave: undefined,
  isOpenChanged: undefined,
  job_uuid: undefined,
};

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  GetAllSetupsProviders,
  AssignJobToProviders,
} from '../../../../../../../../services';
import {
  DynamicFormTypesEnum,
  ProfileSourcesTypesEnum,
} from '../../../../../../../../enums';
import { VitallyTrack } from '../../../../../../../../utils/Vitally';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'AssignJobDialog.';

export const AssignJobDialog = ({ job_uuid, isOpen, isOpenChanged }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);
  const [providerTypes] = useState(
    Object.values(ProfileSourcesTypesEnum)
      .filter(
        (item) =>
          item.key === ProfileSourcesTypesEnum.Agency.key
          || item.key === ProfileSourcesTypesEnum.University.key,
      )
      .map((item) => ({
        ...item,
        value: t(`${translationPath}${item.value}`),
      })),
  );
  const stateInitRef = useRef({
    provider_type: null,
    provider_uuids: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

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

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    let response;
    response = await AssignJobToProviders({
      ...state,
      job_uuid,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 202)) {
      if (state?.provider_type === ProfileSourcesTypesEnum.Agency.key) {
        VitallyTrack('EVA-Agency - Assign Job to Agency');
        window?.ChurnZero?.push([
          'trackEvent',
          `EVA-Agency - Assign Job to Agency`,
          `Assign Job to Agency`,
          1,
          {},
        ]);
      }
      isOpenChanged();
      showSuccess(t(`${translationPath}job-assigned-successfully`));
    } else showError(t(`${translationPath}job-assign-failed`), response);
  };

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    schema.current = yup.object().shape({
      provider_type: yup
        .string()
        .nullable()
        .required(t(`${translationPath}this-field-is-required`)),
      provider_uuids: yup
        .array()
        .nullable()
        .min(
          1,
          `${t(`${translationPath}please-select-at-least`)} ${1} ${t(
            `${translationPath}provider`,
          )}`,
        ),
      message: yup
        .string()
        .nullable()
        .required(t(`${translationPath}this-field-is-required`)),
    });
  }, [job_uuid, t]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="assign-job-to-provider"
      contentClasses="px-0"
      dialogContent={
        <div>
          <SharedAutocompleteControl
            isFullWidth
            errors={errors}
            title="provider-type"
            stateKey="provider_type"
            isDisabled={isLoading}
            isSubmitted={isSubmitted}
            placeholder="select-provider-type"
            onValueChanged={(newValue) => {
              if (state.provider_uuids)
                onStateChanged({ id: 'provider_uuids', value: null });
              onStateChanged(newValue);
            }}
            initValues={providerTypes}
            editValue={state.provider_type}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            errorPath="provider_type"
          />
          {state.provider_type === ProfileSourcesTypesEnum.Agency.key && (
            <SharedAPIAutocompleteControl
              title="agency"
              isFullWidth
              placeholder="select-agency"
              stateKey="provider_uuids"
              errors={errors}
              errorPath="provider_uuids"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.provider_uuids}
              // uniqueKey="user_uuid"
              extraProps={{
                type: ProfileSourcesTypesEnum.Agency.userType,
                ...(state.uuid
                  && state.provider_uuids && {
                  with_than: [state.provider_uuids],
                }),
              }}
              type={DynamicFormTypesEnum.array.key}
              translationPath={translationPath}
            />
          )}
          {state.provider_type === ProfileSourcesTypesEnum.University.key && (
            <SharedAPIAutocompleteControl
              title="university"
              isFullWidth
              placeholder="select-university"
              stateKey="provider_uuids"
              errors={errors}
              errorPath="provider_uuids"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              // uniqueKey="user_uuid"
              editValue={state.provider_uuids}
              extraProps={{
                type: ProfileSourcesTypesEnum.University.userType,
                ...(state.uuid
                  && state.provider_uuids && {
                  with_than: [state.provider_uuids],
                }),
              }}
              type={DynamicFormTypesEnum.array.key}
              translationPath={translationPath}
            />
          )}
          <SharedInputControl
            errors={errors}
            isFullWidth
            title="message"
            isSubmitted={isSubmitted}
            stateKey="message"
            errorPath="message"
            onValueChanged={onStateChanged}
            editValue={state.message}
            rows={5}
            multiline
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      }
      wrapperClasses="setups-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      saveText="assign"
    />
  );
};

AssignJobDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  job_uuid: PropTypes.string,
  isOpenChanged: PropTypes.func,
};
AssignJobDialog.defaultProps = {
  job_uuid: undefined,
  isOpenChanged: undefined,
};

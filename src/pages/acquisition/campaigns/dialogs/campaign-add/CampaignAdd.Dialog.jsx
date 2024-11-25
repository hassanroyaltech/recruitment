import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogComponent } from 'components';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { CreateCampaignV2 } from '../../../../../services';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { JobsAutocompleteControl } from './controls';
import { Inputs } from '../../../../../components';

export const CampaignAddDialog = ({
  isOpen,
  onSave,
  job_uuid,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const [state, setState] = useReducer(reducer, {
    job_uuid,
    title: '',
  });
  const schema = useRef(
    yup.object().shape({
      job_uuid: yup
        .string()
        .nullable()
        .required(t(`${translationPath}campaign-job-is-required`)),
      title: yup
        .string()
        .nullable()
        .max(255, `${t(`${translationPath}the-title-can-not-be-more-than`)} ${255}`)
        .required(t(`${translationPath}campaign-title-is-required`)),
    }),
  );
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(schema, state);
    setErrors(result);
  }, [state]);
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    // showError(t('Shared:please-fix-all-errors'));

    setIsLoading(true);
    const response = await CreateCampaignV2(state);
    if (response && response.status === 201) {
      window?.ChurnZero?.push([
        'trackEvent',
        `Acquisition - Create Campaign`,
        `Create Campaign`,
        1,
        {},
      ]);
      showSuccess(t(`${translationPath}campaign-created-successfully`));
      if (onSave) onSave(response.data.results);
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        (response && response.data && response.data.message)
          || t(`${translationPath}campaign-create-failed`),
      );

    setIsLoading(false);
  };

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      titleText="new-campaign"
      maxWidth="xs"
      saveText="create"
      dialogContent={
        <div className="campaign-add-dialog-wrapper px-2">
          <div className="mb-3">
            <JobsAutocompleteControl
              idRef="jobsRef"
              errors={errors}
              stateKey="job_uuid"
              job_uuid={job_uuid}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onSelectedValueChanged={onStateChanged}
            />
          </div>
          <Inputs
            labelValue="campaign-name"
            idRef="campaignNameRef"
            inputPlaceholder="campaign-name"
            value={state.title}
            helperText={(errors.title && errors.title.message) || undefined}
            error={(errors.title && errors.title.error) || undefined}
            isSubmitted={isSubmitted}
            onInputChanged={(event) => {
              const { value } = event.target;
              onStateChanged({ id: 'title', value });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

CampaignAddDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  job_uuid: PropTypes.string,
  onSave: PropTypes.func,
};
CampaignAddDialog.defaultProps = {
  isOpenChanged: undefined,
  job_uuid: undefined,
  onSave: undefined,
  translationPath: 'CampaignAddDialog.',
};

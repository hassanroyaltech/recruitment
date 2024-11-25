import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import { DialogComponent } from '../../../../../components';
import {
  AddJobToPipeline,
  ConnectCandidateWithProfile,
  GetAllActiveJobs,
  GetAllSetupsBranches,
} from '../../../../../services';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../setups/shared';
import { PipelineStagesEnum } from '../../../../../enums';

export const AddToPipelineDialog = ({
  candidate_companies,
  use_for,
  profile_uuid,
  pre_candidate_approval_uuid,
  pre_candidate_uuid,
  category_code,
  isOpen,
  isOpenChanged,
  onSave,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const stateInitRef = useRef({
    company_uuid: null,
    job_uuid: null,
    stage_uuid: null,
    profile_uuid: profile_uuid || null,
    use_for,
    category_code,
    pre_candidate_approval_uuid,
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
          company_uuid: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || profile_uuid,
            ),
          job_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          stage_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [profile_uuid, state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current company profile uuid from candidate
   * companies (if exist)
   */
  const getCurrentCompanyProfile = useCallback(
    (company_uuid = state.company_uuid) =>
      !profile_uuid
      && candidate_companies
      && candidate_companies.find((item) => item.company_uuid === company_uuid)
        ?.profile_candidate_uuid,
    [candidate_companies, profile_uuid, state.company_uuid],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const localState = { ...state };
    if (!profile_uuid && !getCurrentCompanyProfile()) {
      const profileResponse = await ConnectCandidateWithProfile({
        company_uuid: state.company_uuid,
        pre_candidate_uuid,
      });
      if (
        profileResponse
        && (profileResponse.status === 200
          || profileResponse.status === 201
          || profileResponse.status === 202)
      )
        localState.profile_uuid = profileResponse.data.results.profile_uuid;
      else {
        setIsLoading(false);
        showError(t(`${translationPath}candidate-add-failed`), profileResponse);
        return;
      }
    } else if (!profile_uuid) localState.profile_uuid = getCurrentCompanyProfile();
    const response = await AddJobToPipeline({
      ...localState,
      profile_uuid: [localState?.profile_uuid],
      branch_uuid: state.company_uuid,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (use_for === 'pre_screening_service')
        window?.ChurnZero?.push([
          'trackEvent',
          `Initial Approval - Move Candidate to Job`,
          `Move Candidate to Job`,
          1,
          {},
        ]);
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
      showSuccess(t(`${translationPath}candidate-added-successfully`));
    } else showError(t(`${translationPath}candidate-add-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      maxWidth="xs"
      titleText="add-to-pipeline"
      isWithFullScreen
      dialogContent={
        <div className="add-to-pipeline-dialog-wrapper">
          {!profile_uuid && (
            <SharedAPIAutocompleteControl
              isFullWidth
              labelValue="branch"
              errors={errors}
              isSubmitted={isSubmitted}
              stateKey="company_uuid"
              errorPath="company_uuid"
              searchKey="search"
              placeholder="select-branch"
              onValueChanged={(newValue) => {
                if (state.job_uuid) setState({ id: 'job_uuid', value: null });
                if (state.stage_uuid) setState({ id: 'stage_uuid', value: null });
                setActiveJob((item) => (item ? null : item));
                setState(newValue);
              }}
              editValue={state.company_uuid}
              translationPath={translationPath}
              getDataAPI={GetAllSetupsBranches}
              extraProps={{
                ...(state.company_uuid && { with_than: [state.company_uuid] }),
              }}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
            />
          )}
          {(profile_uuid || state.company_uuid) && (
            <SharedAPIAutocompleteControl
              placeholder="select-job"
              labelValue="job"
              getOptionLabel={(option) => option.title}
              searchKey="search"
              getDataAPI={GetAllActiveJobs}
              dataKey="jobs"
              isFullWidth
              isEntireObject
              isRequired
              errors={errors}
              stateKey="job_uuid"
              errorPath="job_uuid"
              onValueChanged={({ value }) => {
                if (state.stage_uuid) setState({ id: 'stage_uuid', value: null });
                setState({ id: 'job_uuid', value: value && value.uuid });
                setActiveJob(value);
              }}
              extraProps={{
                use_for: 'dropdown',
                company_uuid: !profile_uuid && state.company_uuid,
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {state.job_uuid && (
            <SharedAutocompleteControl
              placeholder="select-pipeline"
              labelValue="pipeline"
              stateKey="stage_uuid"
              getOptionLabel={(option) => option.title}
              isRequired
              isFullWidth
              errors={errors}
              initValues={activeJob && activeJob.pipelines}
              isSubmitted={isSubmitted}
              errorPath="stage_uuid"
              initValuesKey="uuid"
              isEntireObject
              initValuesTitle="title"
              onValueChanged={({ value }) => {
                if (value) {
                  const applyStage = value.stages.find(
                    (item) => item.type === PipelineStagesEnum.APPLIED.key,
                  );
                  if (applyStage) {
                    onStateChanged({ id: 'stage_uuid', value: applyStage.uuid });
                    return;
                  }
                }
                onStateChanged({ id: 'stage_uuid', value: null });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
      }
      isOpen={isOpen}
      onSubmit={saveHandler}
      isSaving={isLoading}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

AddToPipelineDialog.propTypes = {
  candidate_companies: PropTypes.arrayOf(
    PropTypes.shape({
      company_uuid: PropTypes.string,
      profile_candidate_uuid: PropTypes.string,
      user_uuid: PropTypes.string,
    }),
  ),
  use_for: PropTypes.string,
  profile_uuid: PropTypes.string,
  pre_candidate_uuid: PropTypes.string,
  category_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pre_candidate_approval_uuid: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
AddToPipelineDialog.defaultProps = {
  candidate_companies: [],
  use_for: undefined,
  profile_uuid: undefined,
  category_code: undefined,
  pre_candidate_uuid: undefined,
  pre_candidate_approval_uuid: undefined,
  translationPath: undefined,
};

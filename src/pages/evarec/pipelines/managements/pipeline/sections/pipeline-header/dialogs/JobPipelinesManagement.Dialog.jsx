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
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  CreateEvaRecJobPipeline,
  DeleteEvaRecJobPipeline,
  GetAllEvaRecJobPipelinesByUUID,
  GetAllEvaRecPipelines,
} from '../../../../../../../../services';
import { ButtonBase } from '@mui/material';
import { SystemActionsEnum } from '../../../../../../../../enums';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'JobPipelinesManagementDialog.';

export const JobPipelinesManagementDialog = ({
  jobUUID,
  isOpen,
  activeJob,
  isOpenChanged,
  onSave,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const stateInitRef = useRef({
    activeMode: SystemActionsEnum.add.key,
    job_uuid: jobUUID,
    pipeline_uuid: null,
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

  const onActiveModeChanged = (newMode) => () => {
    setState({ id: 'activeMode', value: newMode });
    if (state.pipeline_uuid) setState({ id: 'pipeline_uuid', value: null });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          pipeline_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
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
    if (state.activeMode === SystemActionsEnum.delete.key) {
      setIsOpenDeleteDialog(true);
      return;
    }
    setIsLoading(true);
    const response = await CreateEvaRecJobPipeline(state);
    setIsLoading(false);
    if (response && response.status === 201) {
      setIsSubmitted(false);
      onStateChanged({ id: 'pipeline_uuid', value: null });
      showSuccess(t(`${translationPath}pipeline-created-successfully`));
      if (onSave) onSave(response.data.results);
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}pipeline-create-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (jobUUID && isOpen) onStateChanged({ id: 'job_uuid', value: jobUUID });
  }, [isOpen, jobUUID, onStateChanged]);

  return (
    <>
      <DialogComponent
        maxWidth="xs"
        titleText={
          (state.activeMode === SystemActionsEnum.add.key && 'add-new-pipeline')
          || 'delete-a-pipeline'
        }
        contentClasses="px-0"
        dialogContent={
          <div className="job-pipelines-management-content-dialog-wrapper">
            <div className="d-flex-v-center-h-end px-2 mb-3">
              {state.activeMode !== SystemActionsEnum.delete.key && (
                <ButtonBase
                  className="btns-icon theme-transparent c-warning"
                  onClick={onActiveModeChanged(SystemActionsEnum.delete.key)}
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              )}
              {state.activeMode !== SystemActionsEnum.add.key && (
                <ButtonBase
                  className="btns-icon theme-transparent"
                  onClick={onActiveModeChanged(SystemActionsEnum.add.key)}
                >
                  <span className={SystemActionsEnum.add.icon} />
                </ButtonBase>
              )}
            </div>
            {state.activeMode === SystemActionsEnum.add.key && (
              <SharedAPIAutocompleteControl
                fullWidth
                title="pipeline-template"
                placeholder="select-pipeline-template"
                stateKey="pipeline_uuid"
                errorPath="pipeline_uuid"
                onValueChanged={onStateChanged}
                getOptionLabel={(option) => option.title}
                getDataAPI={GetAllEvaRecPipelines}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                searchKey="search"
                isSubmitted={isSubmitted}
                errors={errors}
              />
            )}
            {state.activeMode === SystemActionsEnum.delete.key && (
              <SharedAPIAutocompleteControl
                fullWidth
                title="pipeline"
                placeholder="select-pipeline"
                stateKey="pipeline_uuid"
                errorPath="pipeline_uuid"
                onValueChanged={onStateChanged}
                getOptionLabel={(option) => option.title}
                getDataAPI={GetAllEvaRecJobPipelinesByUUID}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                getDisabledOptions={(option) => !option.can_delete}
                isSubmitted={isSubmitted}
                extraProps={{
                  job_uuid: state.job_uuid,
                }}
                errors={errors}
              />
            )}
          </div>
        }
        wrapperClasses="job-pipelines-management-dialog-wrapper"
        isSaving={isLoading}
        isOpen={isOpen}
        saveClasses={
          (state.activeMode === SystemActionsEnum.delete.key
            && 'btns theme-solid bg-warning')
          || undefined
        }
        saveText={
          (state.activeMode === SystemActionsEnum.delete.key && 'delete')
          || undefined
        }
        onSubmit={saveHandler}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={state}
          successMessage="job-pipeline-deleted-successfully"
          onSave={() => {
            setIsSubmitted(false);
            onStateChanged({ id: 'pipeline_uuid', value: null });
            const localActiveJob = { ...activeJob };
            localActiveJob.pipelines = localActiveJob.pipelines.filter(
              (item) => item.uuid !== state.pipeline_uuid,
            );
            if (onSave) onSave(localActiveJob);
            if (isOpenChanged) isOpenChanged();
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
          }}
          descriptionMessage="job-pipeline-delete-description"
          deleteApi={DeleteEvaRecJobPipeline}
          apiProps={{
            uuid: state.pipeline_uuid,
          }}
          errorMessage="job-pipeline-delete-failed"
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

JobPipelinesManagementDialog.propTypes = {
  jobUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  activeJob: PropTypes.instanceOf(Object),
  isOpenChanged: PropTypes.func,
};
JobPipelinesManagementDialog.defaultProps = {
  jobUUID: undefined,
  onSave: undefined,
  activeJob: undefined,
  isOpenChanged: undefined,
};

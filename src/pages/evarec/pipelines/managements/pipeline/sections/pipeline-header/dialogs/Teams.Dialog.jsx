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
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  GetEvaRecPipelineTeams,
  AddEvaRecPipelineTeam,
  // GetAllSetupsTeams,
  GetAllEvaRecPipelineTeams,
  GetInitialJobTeam,
} from '../../../../../../../../services';
import {
  DynamicFormTypesEnum,
  JobInviteRecruiterTypesEnum,
} from '../../../../../../../../enums';
import InviteTeamsComponent from '../../../../../../create/components/invite-teams/InviteTeams.Component';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'TeamsManagementDialog.';

export const TeamsDialog = ({ jobUUID, onSave, isOpen, isOpenChanged }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);
  const stateInitRef = useRef({
    teams_invited: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const [invitedTeams, setInvitedTeams] = useState({
    job_poster: [],
    job_recruiter: [],
  });

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
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  const getJobResponsibleTeam = useCallback(
    async (jobUUID) => {
      const response = await GetInitialJobTeam({ job_uuid: jobUUID });

      if (response && response.status === 200) {
        const results = response.data?.results;
        setInvitedTeams((prevState) => ({
          ...prevState,
          job_poster:
            (results?.job_poster && [
              {
                ...results?.job_poster,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
          job_recruiter:
            (results?.job_recruiter && [
              {
                ...results?.job_recruiter,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
        }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );

  const getEvaRecPipelineTeamsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetEvaRecPipelineTeams({ job_uuid: jobUUID, is_team: 1 });
    if (response && response.status === 200) {
      const teamsIds = response.data?.results?.map((item) => item.uuid);
      onStateChanged({ id: 'teams_invited', value: teamsIds });
      setIsLoading(false);
    } else {
      onStateChanged({ id: 'teams_invited', value: [] });
      showError(t('Shared:failed-to-get-saved-data'), response); // test
      setIsLoading(false);
    }
  }, [t, jobUUID]);

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
    const localJobTeams = {
      job_recruiter: invitedTeams.job_recruiter?.[0]?.value,
      job_poster: invitedTeams.job_poster?.[0]?.value,
    };
    let response;
    if (jobUUID)
      response = await AddEvaRecPipelineTeam({
        ...state,
        ...localJobTeams,
        job_uuid: jobUUID,
      });
    else response = await AddEvaRecPipelineTeam(state);
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      setIsSubmitted(false);
      showSuccess(t(`${translationPath}teams-added-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}teams-add-failed`), response);
  };

  // this to call error updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (jobUUID && isOpen) void getEvaRecPipelineTeamsHandler();
  }, [getEvaRecPipelineTeamsHandler, isOpen, jobUUID]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      teams_invited: yup.array().nullable().required(t('this-field-is-required')),
    });
  }, [jobUUID, t]);

  useEffect(() => {
    if (jobUUID && isOpen) void getJobResponsibleTeam(jobUUID);
  }, [getJobResponsibleTeam, jobUUID, isOpen]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="team-members"
      contentClasses="px-0"
      dialogContent={
        <div className="shared-control-wrapper">
          <div className="mb-3">
            {t(`${translationPath}team-members-description`)}
          </div>
          <SharedAPIAutocompleteControl
            isFullWidth
            errors={errors}
            title={t('team-members')}
            placeholder={t('select-team-members')}
            isSubmitted={isSubmitted}
            stateKey="teams_invited"
            errorPath="teams_invited"
            onValueChanged={(newValue) =>
              onStateChanged({
                id: 'teams_invited',
                value: newValue?.value || [],
              })
            }
            editValue={state.teams_invited}
            translationPath={translationPath}
            // searchKey="search"
            getDataAPI={GetAllEvaRecPipelineTeams}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
            // getOptionLabel={(option) =>
            //   `${
            //     option.first_name
            //     && (option.first_name[i18next.language] || option.first_name.en)
            //   }${
            //     option.last_name
            //     && ` ${option.last_name[i18next.language] || option.last_name.en}`
            //   }`
            // }
            uniqueKey="value"
            getOptionLabel={(option) => option.label || 'N/A'}
            // extraProps={{
            //   ...(state.teams_invited?.length && {
            //     with_than: state.teams_invited,
            //   }), // there is an issue with this API
            // }}
            isDisabled={isLoading}
          />
          {jobUUID && (
            <InviteTeamsComponent
              form={invitedTeams}
              setForm={setInvitedTeams}
              translationPath=""
              parentTranslationPath="CreateJob"
              jobRequisitionUUID={jobUUID}
            />
          )}
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={Boolean(jobUUID)}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

TeamsDialog.propTypes = {
  jobUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  onSave: PropTypes.func,
};
TeamsDialog.defaultProps = {
  isOpenChanged: undefined,
  jobUUID: undefined,
  onSave: undefined,
};

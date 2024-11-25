/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title InviteTeam.jsx
 * ----------------------------------------------------------------------------------
 * This module exports the component InviteTeam which is used as the third step in
 * the EvassessStepper, where we are able to invite team members to be included in
 * the assessments.
 * ----------------------------------------------------------------------------------
 */
import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Card } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import ChipsInput from '../../../components/Elevatus/ChipsInput';
import Loader from '../../../components/Elevatus/Loader';
import { evassessAPI } from '../../../api/evassess';
import { showError, getIsAllowedPermissionV2 } from 'helpers';
import { useSelector } from 'react-redux';
import { ManageAssessmentsPermissions } from 'permissions';

/**
 * InviteTeam class component
 */
const translationPath = 'InviteTeamComponent.';
const InviteTeam = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  // Encapsulated state in constructor because ESLINT does not like it otherwise.
  const [state, setState] = useState({
    loading: true,
    options: props?.teams?.map((team) => (team.uuid ? team.uuid : team)),
    dropdownoptions: [],
  });
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const getTeamSearch = useCallback(async () => {
    await evassessAPI
      .TeamSearch({ all: true })
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          dropdownoptions: response.data.results,
          loading: false,
        }));
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t]);
  useEffect(() => {
    getTeamSearch();
  }, [getTeamSearch]);

  // Handler to add a team member from dropdown
  // This crashes when the input field is a searchable.
  // Need someone to clarify why it crashes.
  // Works fine when the input field is a selector
  const handleAddTeamMember = (e) => {
    const { value } = e.currentTarget;

    if (state.options?.includes(value) === false) {
      setState((prevState) => ({
        ...prevState,
        options: [...prevState.options, value],
      }));
      setTimeout(() => {
        props.teams.push(value);
        props.setTeams(props.teams);
      }, 3000);
    }
  };

  // Handler to remove a team member that has been selected
  const handleRemove = (index) => {
    // eslint-disable-next-line camelcase
    const opt_data = state.options;
    opt_data.splice(index, 1);
    setState((prevState) => ({ ...prevState, options: opt_data }));
    props.setTeams(opt_data);
  };
  console.log({ props });
  // Return JSX
  return (
    <Card className="step-card" style={{ minHeight: '50vh' }}>
      <div>
        <h6 className="h6 text-bold-500">{t(`${translationPath}team-members`)}</h6>
      </div>
      <div className="h6 font-weight-normal text-gray">
        {t(`${translationPath}invite-team-description`)}
      </div>
      <div className="mt-4">
        <div>
          {state.loading ? (
            <div className="mb-2 p-3">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </div>
          ) : (
            <div style={{ minHeight: '25vh' }}>
              <ChipsInput
                onSelect={handleAddTeamMember}
                onDelete={handleRemove}
                chips={
                  state.options
                    ? state.options
                      .filter((opt) =>
                        state.dropdownoptions?.find((d) => d.value === opt),
                      )
                      .map(
                        (opt) =>
                          state.dropdownoptions?.find((d) => d.value === opt)
                            ?.label,
                      )
                    : []
                }
                InputComp={(items) => (
                  <TextField
                    select
                    label={t(`${translationPath}select-a-teammate`)}
                    variant="outlined"
                    className="form-control-alternative w-100"
                    name="invite-team"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: ManageAssessmentsPermissions.MangeTeams.key,
                        permissions,
                      })
                    }
                    SelectProps={{
                      native: true,
                      displayEmpty: true,
                    }}
                    {...items}
                  >
                    <option value="" aria-label="default option" />
                    {state.dropdownoptions
                      ? state.dropdownoptions.map((opt, index) => (
                        <option
                          key={`dropdownoptionsKey${index + 1}`}
                          data-label={opt.label}
                          value={opt.value}
                        >
                          {opt.label}
                        </option>
                      ))
                      : []}
                  </TextField>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
export default InviteTeam;

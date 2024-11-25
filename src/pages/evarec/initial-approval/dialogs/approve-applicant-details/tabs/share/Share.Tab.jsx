import React, { useCallback, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { evarecAPI } from '../../../../../../../api/evarec';
import urls from '../../../../../../../api/urls';
import { showError } from '../../../../../../../helpers';
import { GetAllEvaRecPipelineTeams } from '../../../../../../../services';

export const ShareTab = ({
  type,
  job_candidate_uuid,
  job_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const defaultState = {
    recruiters_emails: [],
    job_candidates: [],
    job_uuid: '',
    message: '',
  };
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const [state, setState] = useReducer(reducer, defaultState);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const { addToast } = useToasts(); // Toasts
  const { id } = useParams();

  useEffect(() => {
    setState({ id: 'job_candidates', value: [job_candidate_uuid] });
    setState({ id: 'job_uuid', value: id || job_uuid });
  }, [id, job_candidate_uuid, job_uuid]);

  const getInvitedMembers = useCallback(async () => {
    const url
      = type === 'ats'
        ? urls.evarec.ats.GET_INVITED_TEAM
        : `${urls.evassess.InvitedRecruiters}`;
    evarecAPI
      .getInvitedTeamsOnJob(url, id || job_uuid, null, null, type)
      .then((response) => {
        if (response.data.statusCode === 200) {
          const members = response.data.results.map((team) => ({
            label: team?.name ? team?.name : team,
            value: team?.uuid,
          }));
          setEmails(members);
        }
      })
      .catch((response) => {
        showError(t('Shared:failed-to-get-saved-data', response));
      });
  }, [t, id, job_uuid, type]);

  const getData = useCallback(async () => {
    setLoading(true);
    const response = await GetAllEvaRecPipelineTeams({});
    setLoading(false);
    if (response && response.status === 200) setTeamMembers(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);
  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getInvitedMembers();
  }, [getInvitedMembers]);

  /**
   * Share handler
   * @returns {Promise<void>}
   */
  const onShareHandler = async () => {
    setLoading(true);
    evarecAPI
      .shareATSProfile(state)
      .then(() => {
        setLoading(false);
        setState({ id: 'message', value: '' });
        addToast(t(`${translationPath}candidate-profile-shared-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        showError(t(`${translationPath}candidate-profile-share-failed`), error);
      });
  };
  return (
    <div className="candidate-share-component-wrapper">
      <div className="candidate-share-content">
        <div className="candidate-share-title">
          {t(`${translationPath}share-candidate`)}
        </div>
        <div className="candidate-share-body">
          <div className="team-member-wrapper">
            <div className="team-member-title">
              {t(`${translationPath}team-members`)}
            </div>
            <div className="team-member-content">
              <div className="team-member-field">
                <Autocomplete
                  multiple
                  options={teamMembers}
                  getOptionDisabled={(option) => option.isDisabled}
                  value={emails}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.label}
                  onChange={(e, newValue) => {
                    setState({
                      id: 'recruiters_emails',
                      value: newValue.map((item) => item.value),
                    });
                    setEmails(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      variant="outlined"
                      label={t(`${translationPath}add-team-members`)}
                    />
                  )}
                />
              </div>
              {/* <div className="team-member-button">
                <Button>
                  <i className="fas fa-plus" />
                </Button>
              </div> */}
            </div>
          </div>
          <div className="message-wrapper">
            <div className="message-title">{t(`${translationPath}message`)}</div>
            <div className="message-field">
              <TextField
                fullWidth
                multiline
                variant="outlined"
                value={state.message}
                label={t(`${translationPath}type-your-message-here`)}
                onChange={(e) => {
                  const {
                    target: { value },
                  } = e;
                  setState({ id: 'message', value });
                }}
              />
            </div>
          </div>
          <div
            className={`send-button-wrapper ${
              loading || !state.message || state.recruiters_emails.length === 0
                ? 'is-disabled'
                : ''
            }`}
          >
            <Button
              onClick={onShareHandler}
              disabled={
                loading || !state.message || state.recruiters_emails.length === 0
              }
            >
              {t(`${translationPath}send`)}
              {loading && (
                <span className="pl-2 text-white text-sm">
                  <i className="fas fa-circle-notch fa-spin" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ShareTab.propTypes = {
  type: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
ShareTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};

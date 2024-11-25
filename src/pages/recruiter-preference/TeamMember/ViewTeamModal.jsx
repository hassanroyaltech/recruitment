import React, { useState, useEffect, useCallback } from 'react';
import RecuiterPreference from 'utils/RecuiterPreference';
import axios from 'api/middleware';
import { useToasts } from 'react-toast-notifications';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import Loader from '../components/Loader';
import { StyledModal } from '../PreferenceStyles';
import EditTeamTable from './EditTeamTable';

const translationPath = 'TeamMember.';
const parentTranslationPath = 'RecruiterPreferences';

const ViewTeamModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); //
  const [team, setTeam] = useState();
  const [isWorking, setIsWorking] = useState(false);

  const getTeam = useCallback(async () => {
    const results = await axios
      .request({
        method: 'view',
        url: RecuiterPreference.TEAM_GET,
        params: {
          uuid: props.currentUUID,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        setTeam(res.data.results);
      })
      .catch(() => {});

    return results;
  }, [props.currentUUID]);

  const handleDelete = async (idToRemove) => {
    setIsWorking(true);
    await axios
      .put(
        RecuiterPreference.TEAM_WRITE,
        {
          uuid: team.uuid,
          title: team.title,
          status: team.status,
          users: (team.users || [])
            .filter((item) => item.uuid !== idToRemove)
            .map((u) => u.uuid || u),
        },
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        setIsWorking(false);
        addToast(t(`${translationPath}team-member-deleted-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.getTeams();
        props.closeModal();
      })
      .catch(() => {
        setIsWorking(false);
        addToast(t(`${translationPath}error-in-deleting-team-member`), {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  return (
    <>
      <StyledModal
        className="modal-dialog-centered"
        size="md"
        isOpen={props.isOpen}
        toggle={() => props.closeModal()}
      >
        {(!team || isWorking) && <Loader />}
        {team && !isWorking && (
          <>
            <div className="modal-header border-0">
              <h5 className="modal-title" id="exampleModalLabel">
                {team.title}
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => props.closeModal()}
              >
                <span aria-hidden>×</span>
              </button>
            </div>
            <div className="modal-body">
              <EditTeamTable {...props} data={team} handleDelete={handleDelete} />
            </div>
          </>
        )}
      </StyledModal>
    </>
  );
};

export default ViewTeamModal;

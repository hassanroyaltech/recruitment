import React, { useState, useEffect, useCallback } from 'react';
import SimpleHeader from 'components/Headers/SimpleHeader';
import axios from 'api/middleware';
import { connect } from 'react-redux';
import RecuiterPreference from 'utils/RecuiterPreference';
import { ToastProvider } from 'react-toast-notifications';
import { Button } from 'reactstrap';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getFullURL } from 'shared/utils';
import { Helmet } from 'react-helmet';
import { generateHeaders } from 'api/headers';
import urls from 'api/urls';
import { useTranslation } from 'react-i18next';
import Loader from '../components/Loader.jsx';
import TeamsTable from './TeamsTable.jsx';
import EditTeam from './EditTeam';

import AddTeamModal from './AddTeamModal.jsx';
import EditTeamModal from './EditTeamModal.jsx';
import { Can } from '../../../utils/functions/permissions';

const translationPath = 'TeamMember.';
const parentTranslationPath = 'RecruiterPreferences';

const TeamMember = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const [currentTeam, setCurrentTeam] = useState();

  const [teams, setTeams] = useState();
  const [isTeamLoading, setIsTeamLoading] = useState(false);

  const getTeams = useCallback(async () => {
    setIsTeamLoading(true);
    await axios
      .get(RecuiterPreference.TEAM_GET, {
        params: { limit: 1000 },
        headers: generateHeaders(),
      })
      .then((res) => {
        setTeams(res.data.results.data);
        setIsTeamLoading(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  const removeTeam = (idToRemove) => {
    setTeams((items) => items.filter((t) => t.uuid !== idToRemove));
  };

  const [users, setUsers] = useState([]);
  const getUsers = async () =>
    await axios.get(urls.preferences.USERS_DROPDOWN, {
      params: {
        company_uuid: user.company_id,
        limit: 100,
      },
      headers: generateHeaders(),
    });

  // Modal States
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);

  const openAddTeamModal = () => {
    getUsers()
      .then((res) => {
        const { results } = res.data;
        if (results) setUsers(results);
        setIsAddTeamModalOpen(true);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };
  const closeModal = () => {
    setIsAddTeamModalOpen(false);
    setIsEditTeamModalOpen(false);
  };

  const handleEdit = (e, row) => {
    props.history.push(
      `/recruiter/recruiter-preference/team/edit-team/${row.uuid}`,
      { currentTeam: row },
    );
  };

  const handleView = (e, row) => {
    getUsers()
      .then((res) => {
        const { results } = res.data;
        if (results) setUsers(results);
        setCurrentTeam(row);
        setIsEditTeamModalOpen(true);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const fullURL = getFullURL();
  // const lastURLSegment_ = getLastURLSegment();
  const isOnUsers = fullURL.includes('edit-team');
  const TITLE = t(`${translationPath}teams-list`);
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <ToastProvider placement="top-center">
        {/* Header */}
        <SimpleHeader
          name={
            isOnUsers
              ? t(`${translationPath}teams-users`)
              : t(`${translationPath}manage-team`)
          }
          parentName="Preferences"
        >
          {users && !isOnUsers && (
            <>
              <Button
                disabled={!Can('create', 'team')}
                className="btn-neutral"
                color="default"
                size="sm"
                onClick={openAddTeamModal}
              >
                <i className="fas fa-plus" /> {t(`${translationPath}add-new-team`)}
              </Button>
              <AddTeamModal
                isOpen={isAddTeamModalOpen}
                getTeamData={getTeams}
                closeModal={closeModal}
                users={users}
                user={user}
              />
            </>
          )}
          {users && isOnUsers && (
            <>
              <Button
                className="btn-neutral"
                color="default"
                size="sm"
                onClick={() => setIsEditTeamModalOpen(true)}
              >
                <i className="fas fa-plus" /> {t(`${translationPath}add-user`)}
              </Button>
            </>
          )}
        </SimpleHeader>

        {/* Modals */}
        {users && !isOnUsers && (
          <>
            <AddTeamModal
              isOpen={isAddTeamModalOpen}
              getTeamData={getTeams}
              closeModal={closeModal}
              users={users}
              user={user}
            />
          </>
        )}
        {users && currentTeam && isEditTeamModalOpen && (
          <EditTeamModal
            isOpen={isEditTeamModalOpen}
            closeModal={closeModal}
            users={users}
            getTeamData={getTeams}
            currentTeam={currentTeam}
            setIsEditTeamModalOpen={setIsEditTeamModalOpen}
            user={user}
          />
        )}

        {/* Header */}

        <div className="mt--8 container-fluid">
          <div className="row pb-4 flex-mobile-row-reverse-2">
            <div className="col-12 card_0 tab-content p-4">
              <Switch>
                <Route exact path="/recruiter/recruiter-preference/team">
                  <div className="tab-pane active" id="e_rp_1" role="tabpanel">
                    <div className="mb-lg-0  h-100 hide-content1  hide-content2 show-content">
                      {/* Table - Start */}
                      {(!teams || isTeamLoading) && <Loader />}
                      {teams && !isTeamLoading && (
                        <TeamsTable
                          teams={teams}
                          user={user}
                          getTeams={getTeams}
                          handleEdit={handleEdit}
                          handleView={handleView}
                          removeTeam={removeTeam}
                          openAddTeamModal={openAddTeamModal}
                        />
                      )}
                      {/* Table - End */}
                    </div>
                  </div>
                </Route>

                <Redirect
                  exact
                  from="/recruiter/recruiter-preference/team/edit-team"
                  to="/recruiter/recruiter-preference/team/"
                />
                <Route
                  exact
                  path="/recruiter/recruiter-preference/team/edit-team/:uuid"
                  render={(props) => (
                    <EditTeam setCurrentTeam={setCurrentTeam} {...props} />
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </ToastProvider>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(TeamMember);

import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';
import { connect } from 'react-redux';
import RecuiterPreference from 'utils/RecuiterPreference';
import { Button, Row, Card, CardHeader } from 'reactstrap';
// import EditUserModal from "../ManageUsers/EditUserModal.jsx";
import { Helmet } from 'react-helmet';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import Loader from '../components/Loader';
import EditTeamTable from './EditTeamTable';

const translationPath = 'TeamMember.';
const parentTranslationPath = 'RecruiterPreferences';

const handleMove = (e, stage) => {};

const handleEdit = (e, stage) => {};

const handleSMS = (e, stage) => {};

const EditTeam = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const [team, setTeam] = useState();
  useEffect(() => {
    const getTeam = async () =>
      await axios
        .request({
          method: 'view',
          url: RecuiterPreference.TEAM_GET,
          params: {
            uuid: props.match.params.uuid,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setTeam(res.data.results);
        })
        .catch((err) => {
          console.error(err.response);
        });
    getTeam();
  }, [user.company_id, user.token]);

  const [isWorking, setIsWorking] = useState(false);
  const handleDelete = async (idToRemove, team) => {
    setIsWorking(true);
    await axios
      .put(
        RecuiterPreference.TEAM_WRITE,
        {
          uuid: team.uuid,
          title: team.title,
          status: team.status,
          users: team.users.filter((user) => user.uuid !== idToRemove),
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        setIsWorking(false);

        // addToast("Team Updated.", {
        //   appearance: "success",
        //   autoDismiss: true
        // });
        // window.location.reload();
      })
      .catch((err) => {
        console.error(err.response);
        setIsWorking(false);
        // addToast("Error in editing team.", {
        //   appearance: "error",
        //   autoDismiss: true
        // });
      });
  };

  // Stage Modal Start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsUserEditModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const [currentUser, setCurrentUser] = useState();
  const openEditUserModal = (row) => {
    setCurrentUser(row);
    setIsUserEditModalOpen(true);
  };
  const closeModal = () => {
    setIsUserEditModalOpen(false);
  };

  const goBack = () => {
    props.history.goBack();
  };
  return (
    <>
      <Helmet>
        <title>{t(`${translationPath}team-members`)}</title>
      </Helmet>
      <div className="tab-pane active" id="e_rp_1" role="tabpanel">
        <div className="card mb-lg-0  h-100 hide-content1  hide-content2 show-content">
          <Row>
            <div className="col">
              <Card className="mb-0 pb-2">
                <CardHeader>
                  <div className="float-left">
                    <h1 className="display-4 mb-0 d-inline-block mr-1-reversed">
                      <Button
                        className="btn btn-icon bg-transparent shadow-none"
                        type="button"
                        onClick={goBack}
                      >
                        <span className="btn-inner--icon">
                          <i className="fas fa-arrow-left fa-lg" />
                        </span>
                      </Button>
                      {`${(team && team.title) || t(`${translationPath}edit-team`)}`}
                    </h1>
                  </div>
                </CardHeader>
                {(!team || isWorking) && <Loader />}
                {team && team.users && !isWorking && (
                  <EditTeamTable
                    {...props}
                    data={team}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleMove={handleMove}
                    handleSMS={handleSMS}
                    openUserModal={handleAdd}
                    openEditUserModal={openEditUserModal}
                    setCurrentTeam={props.setCurrentTeam}
                  />
                )}
              </Card>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(EditTeam);

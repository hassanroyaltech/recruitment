/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, CardBody, Col, Modal, ModalBody, Row } from 'reactstrap';

import { useFormik } from 'formik';

import ReactBSAlert from 'react-bootstrap-sweetalert';
import urls from '../../../api/urls';
import { evarecAPI } from '../../../api/evarec';
import { useTranslation } from 'react-i18next';
import RecruiterSearch from '../../../pages/RecruiterSearch';
import Loader from '../../Elevatus/Loader';
import { HttpServices, showError, showSuccess } from '../../../helpers';

const translationPath = 'TeamsModalComponent.';
const TeamsModal = (props) => {
  const { match, assessment, isOpen, onClose, parentTranslationPath } = props;
  const { t } = useTranslation('EvaSSESSPipeline');
  const [loading, setLoading] = useState(false);
  const [, setMembers] = useState();
  const [state, setState] = useState({
    AddMemberModal: false,
    maxPerPage: 5,
    pageIndex: 0,
    data: [],
    invitedTeams: assessment?.steps?.inviteTeam || [],
    title: '',
    alert: null,
    options: [],
    openSureModal: false,
    openDoneModal: false,
    loadingInvite: false,
    teams: [],
    account: JSON.parse(localStorage.getItem('user'))?.results,
    dropdownoptions: [],
  });
  const [invitedTeams, setInvitedTeams] = useState({
    users: [],
    employees: [],
    job_poster: [],
    job_recruiter: [],
  });

  const formik = useFormik({
    initialValues: {
      team: [],
    },
    onSubmit: () => {},
  });

  const { values } = formik;
  const getInvitedMembers = useCallback(async () => {
    const url
      = props.type === 'ATS'
        ? urls.evarec.ats.GET_INVITED_TEAM
        : `${urls.evassess.InvitedRecruiters}`;
    setLoading(true);
    evarecAPI
      .getInvitedTeamsOnJob(url, match?.params?.id, null, 1, props.type)
      .then((response) => {
        if (response.data.statusCode === 200) {
          setMembers(response.data.results);
          const localMembers = response.data.results.map((team) => ({
            label: team?.name ? team?.name : team,
            value: team?.uuid,
          }));
          setState((prevState) => ({
            ...prevState,
            options: localMembers,
          }));
          const invitedUsers = [];
          const invitedEmployees = [];
          const resultArr = response.data.results;
          if (props.type === 'ATS')
            setInvitedTeams({
              teams: resultArr.map((item) => ({
                ...item,
                label: item.name,
                value: item.uuid,
              })),
            });
          else {
            resultArr.forEach((item) => {
              if (item.user_type === 'user') invitedUsers.push(item?.uuid);
              // if(item.user_type === 'employee') invitedEmployees.push({ ...item, user_uuid:item?.uuid });// need changes from backend
              if (item.user_type === 'employee') invitedEmployees.push(item);
            });
            setInvitedTeams(() => ({
              users: invitedUsers,
              employees: invitedEmployees,
            }));
          }

          setLoading(false);
        }
      });
  }, [match?.params?.id, props.type]);
  const getInfo = useCallback(
    async (newValue) => {
      const url
        = props.type === 'ATS'
          ? urls.evarec.ats.TEAM_SEARCH
          : `${urls.evassess.TEAM_SEARCH}`;
      const getOptions = await HttpServices.get(url, {
        params: {
          name: newValue,
        },
      });
      if (getOptions.status === 200)
        setState((prevState) => ({
          ...prevState,
          dropdownoptions: getOptions.data.results,
        }));
    },
    [props.type],
  );
  useEffect(() => {
    void getInvitedMembers();
  }, [getInvitedMembers]);
  useEffect(() => {
    void getInfo();
  }, [getInfo]);
  const hideAlert = () => {
    setState((prevState) => ({
      ...prevState,
      openDoneModal: false,
      openSureModal: false,
    }));
    onClose();
  };

  const inviteTeams = async () => {
    let teamUUIDS;
    if (props.type === 'ATS')
      teamUUIDS = (invitedTeams?.teams || []).map((item) => item?.value);
    else
      teamUUIDS = [
        ...invitedTeams.users,
        ...invitedTeams.employees.map((item) => item.user_uuid),
      ];
    const url
      = props.type === 'ATS'
        ? urls.evarec.ats.INVITE_TEAM
        : urls.evassess.InviteRecruiters;
    setState((prevState) => ({ ...prevState, loadingInvite: true }));
    const localJobTeams = {
      job_recruiter: invitedTeams.job_recruiter?.[0]?.value,
      job_poster: invitedTeams.job_poster?.[0]?.value,
    };
    evarecAPI
      .inviteTeamMembers(
        url,
        match?.params?.id,
        teamUUIDS,
        props.type,
        localJobTeams,
      )
      .then(() => {
        showSuccess(t(`${translationPath}team-member-invited-successfully`));

        setState((prevState) => ({
          ...prevState,
          openDoneModal: true,
          loadingInvite: false,
        }));
        if (props.getAllActive) props.getAllActive();
      })
      .catch((error) => {
        showError(t(`${translationPath}team-member-invite-failed`));

        setState((prevState) => ({
          ...prevState,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
          loadingInvite: false,
        }));
      });
  };
  return (
    <>
      {state.openDoneModal && (
        <ReactBSAlert
          success
          style={{
            display: 'block',
            width: '30em',
          }}
          title={t(`${translationPath}recruiters-updated-successfully`)}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="primary"
          confirmBtnText={t(`${translationPath}ok`)}
          btnSize=""
        >
          {/* Invited successfully */}
        </ReactBSAlert>
      )}
      <Modal
        className="modal-dialog-centered choose-assessment-type"
        size="md"
        isOpen={isOpen}
        toggle={onClose}
      >
        <div className="modal-header border-0">
          <h3 className="h3 mb-0">{t(`${translationPath}team-members`)}</h3>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={onClose}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <ModalBody
          className="modal-body pt-0"
          style={{ overflow: 'inherit', maxHeight: '100%' }}
        >
          {loading ? (
            <CardBody className="text-center">
              <Row>
                <Col xl="12">
                  <Loader width="730px" height="49vh" speed={1} color="primary" />
                </Col>
              </Row>
            </CardBody>
          ) : (
            <div className="px-4 pb-3">
              <RecruiterSearch
                options={state.options}
                setNumberOfDeleted={(value) => {
                  setState((prevState) => ({
                    ...prevState,
                    NumberOfDeleted: value,
                  }));
                }}
                parentTranslationPath={parentTranslationPath}
                setEmailsData={(data) => {
                  setState((prevState) => ({
                    ...prevState,
                    options: data?.map((item) => item.value),
                  }));
                }}
                invitedTeams={invitedTeams}
                setInvitedTeams={setInvitedTeams}
                jobUUID={props.uuid}
                type={props.type}
              />
              <div className="mt-4 d-flex justify-content-center">
                <Button
                  type="button"
                  color="primary"
                  className="btn"
                  style={{ width: 200 }}
                  disabled={
                    state.loadingInvite
                    || !values.team
                    || (state.options && state.options.length === 0)
                  }
                  onClick={inviteTeams}
                >
                  {state.loadingInvite && (
                    <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {`${
                    state.loadingInvite
                      ? t(`${translationPath}saving`)
                      : t(`${translationPath}save`)
                  }`}
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
export default TeamsModal;

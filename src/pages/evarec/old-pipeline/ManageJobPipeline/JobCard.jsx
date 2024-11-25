// React and reactstrao
import React, { useEffect, useState } from 'react';
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

// Redux
import { connect, useSelector } from 'react-redux';

// Moment (for dates)
import moment from 'moment';

// Styled components and classnames
import styled from 'styled-components';
import classnames from 'classnames';

// Drag indicator icon
import { DragIndicator } from 'shared/icons';

// Components
// import ScheduleMeeting from '../ScheduleMeeting';
import ScheduleMeeting from 'components/Views/ScheduleMeeting';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
// import SendOffer from '../../SendOffer';
import { CheckboxesComponent, DialogComponent } from 'components';
import { useTranslation } from 'react-i18next';
import { OffersTab } from '../../../../components/Views/CandidateModals/evarecCandidateModal/OffersTab';
import { SubscriptionServicesEnum } from '../../../../enums';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
} from '../../../../helpers';
import NoPermissionComponent from '../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageApplicationsPermissions } from '../../../../permissions';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';

// Import EVA-REC API

/**
 * Styled Divs are defined here
 * (should be replaced, as they are causing many warnings)
 */
const Pill = styled.div`
  align-items: center;
  background: var(--bgprimary);
  border-radius: 100%;
  color: white;
  display: flex;
  font-size: 18px;
  height: 40px;
  justify-content: center;
  position: absolute;
  right: -10px;
  top: -10px;
  width: 40px;
  z-index: 99;
`;

const Handle = styled.div`
  cursor: move;
  margin-bottom: 4px;
  margin-left: auto;
  margin-top: 16px;
  opacity: 0.3;
  transition: 0.3s ease all;
  width: fit-content;

  &:hover {
    opacity: 1;
  }
`;

const Grid = styled.div`
  //cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const GridRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

/**
 * The JobCard component
 * @param isSelected
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const JobCard = ({ isSelected, isDisabled, ...props }) => {
  const { t } = useTranslation(parentTranslationPath);
  // Modal States
  const [dialog, setDialog] = useState(null);

  // Candidate Profile State
  const [profile] = useState({});

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  // Open the Candidate Modal from the notification list.
  useEffect(() => {
    if (
      window.location.search.substring(
        window.location.search.lastIndexOf('=') + 1,
      ) === props.user_uuid
    )
      props.showJobCandidateModal(
        props.user_uuid,
        props.match.params.id,
        props.profile_uuid,
        props.score,
        props.candidate_uuid,
        props.stages,
        profile,
        props.applied_at,
        props.task,
      );
  }, []);

  /**
   * Effect to get candidate profile data from EVA-REC API
   * @param {} profile_uuid
   * @returns {Promise}
   */
  // useEffect(() => {
  //   let isSubscribed = true;
  //   console.log('profileuuid', props.profile_uuid);

  //   evarecAPI.getCandidate(props.profile_uuid).then((res) => {
  //     if (isSubscribed) {
  //       setProfile(res.data.results);
  //       console.log('rr', res.data.results);
  //     }
  //   });

  //   return () => {
  //     isSubscribed = false;
  //   };
  // }, [props.profile_uuid]);

  /**
   * Handler to close a dialog
   */
  const closeDialog = () => setDialog(null);

  /**
   * Handler to drag a job card
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleClick(e);
  };

  /**
   * Handler to show the schedule interview modal
   */
  const showScheduleModal = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Language
    const { language }
      = (localStorage.getItem('user')
        && JSON.parse(localStorage.getItem('user'))?.results)
      || [];

    if (props.timezones)
      setDialog(
        <ScheduleMeeting
          relation_uuid={props.match.params.id}
          relation={1}
          timezones={props.timezones}
          data={props}
          isOpen
          closeModal={closeDialog}
          toggle={closeDialog}
          candidate_email={props.subtitle}
          // We only schedule a meeting for the selected candidate
          selectedCandidates={props.uuid}
          candidate={{
            title: props.title,
            uuid: props.user_uuid,
          }}
          user={props.user}
          languages={language}
        />,
      );
  };

  /**
   * Handler to show the send offer modal
   */
  const showSendOfferModal = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDialog(
      <DialogComponent
        isOpen
        onCloseClicked={closeDialog}
        maxWidth="lg"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        titleText="candidate-offers"
        dialogContent={
          <OffersTab
            candidate_uuid={props.candidate_uuid}
            stage_uuid={props.stage.id}
            pipeline_uuid={props.currentPipeline?.job?.pipeline_uuid}
            job_uuid={props.job_uuid}
          />
        }
      />,
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };
  const onCardClicked = (event) => {
    if (isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    if (props.showJobCandidateModal && profile.length !== 0)
      props.showJobCandidateModal(
        props.user_uuid,
        props.match.params.id,
        props.profile_uuid,
        props.score,
        props.candidate_uuid,
        props.stages,
        profile,
        props.applied_at,
        props.task,
        props.reference_number,
        props.applicant_number,
      );
  };

  /**
   * Return JSX
   * @returns {JSX.Element}
   */
  return (
    <>
      {dialog}
      <Card
        className={classnames(
          'm-2 stage-card pipeline-stage-card evarec',
          props.isGhosting && 'ghosting',
          isSelected && 'selected',
          (isDisabled && 'disabled-stage-card') || 'c-pointer',
        )}
        onClick={onCardClicked}
        // className={`m-2 stage-card pipeline-stage-card ${
        //   props.isGhosting ? 'ghosting' : ''
        // } ${isSelected ? 'selected' : ''}`}
        // selectionCount={props.selectionCount}
      >
        {props.selectionCount && <Pill>{props.selectionCount}</Pill>}
        <Grid>
          <GridRow style={{ alignItems: 'flex-start' }}>
            <LetterAvatar name={props.title} />
            {/* <Img */}
            {/*  className='avatar  avatar-sm  rounded-circle text-white img-circle' */}
            {/*  src={ */}
            {/*    props.profile_image?.url || require('assets/img/theme/team-4.jpg') */}
            {/*  } */}
            {/* /> */}
            <div className="ml-2-reversed d-flex flex-column flex-grow-1">
              <div className="m-0 mt-1 cursor-pointer header-text">
                {props.title}
              </div>
              {props.subtitle && (
                <div
                  className="h7 text-gray"
                  style={{ overflowWrap: 'anywhere', minWidth: '9rem' }}
                >
                  {props.subtitle}
                </div>
              )}
              <div
                style={{ marginTop: 5 }}
                className={classnames(
                  'candidate-badge',
                  props.score >= 67
                    ? 'success'
                    : props.score < 33
                      ? 'error'
                      : 'warning',
                )}
              >
                {Math.round(props.score) || 0}%
              </div>
            </div>
            {/* {(Can('edit', 'job_board') || Can('create', 'job_board')) && ( */}
            {
              <div className="flex flex-column align-items-end">
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn btn-sm btn-link rounded-circle font-16 text-gray d-flex align-items-center justify-content-center"
                    style={{
                      width: 24,
                      height: 24,
                      background: 'none',
                      border: 'none',
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <i className="fa fa-ellipsis-h" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <div onMouseEnter={onPopperOpen}>
                      <DropdownItem
                        onClick={showScheduleModal}
                        className="dropdown-item d-flex align-items-center"
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.ScheduleMeeting.key,
                          })
                        }
                      >
                        {t(`${translationPath}schedule-a-meeting`)}
                      </DropdownItem>
                    </div>
                    <div onMouseEnter={onPopperOpen}>
                      <DropdownItem
                        onClick={showSendOfferModal}
                        className="dropdown-item d-flex align-items-center"
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.SendOffer.key,
                          })
                        }
                      >
                        {t(`${translationPath}send-offer`)}
                      </DropdownItem>
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <Handle onClick={handleDrag} {...props.dragHandleProps}>
                  <DragIndicator className="drag-indicator" />
                </Handle>
              </div>
            }
          </GridRow>
          <GridRow>
            <div className="w-100 text-gray d-flex-v-center-h-between flex-wrap">
              <div className="d-inline-flex-v-center flex-wrap">
                <small className="m-0 h7">
                  <i className="far fa-comment-alt" />
                  &nbsp;
                  {props.num_of_discussion
                    ? props.num_of_discussion < 10
                      ? `0${props.num_of_discussion}`
                      : props.num_of_discussion
                    : '00'}
                </small>
                <small className="m-0 h7 ml-3">
                  <i className="far fa-clock" />
                  &nbsp;
                  {moment(new Date(props.applied_at * 1000)).format('DD MMM YYYY')}
                </small>
              </div>
              <CheckboxesComponent
                idRef={`candidate${props.uuid}`}
                singleChecked={isSelected}
                onSelectedCheckboxClicked={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (props.setSelected) props.setSelected(props.uuid);
                }}
              />
            </div>
          </GridRow>
        </Grid>
      </Card>
      <NoPermissionComponent
        anchorEl={anchorEl}
        placement="right-start"
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
  configs: state.Configs,
});
export default connect(mapStateToProps)(JobCard);

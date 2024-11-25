/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import styled from 'styled-components';
import classnames from 'classnames';
import {
  Badge,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  CardFooter,
  CardBody,
  CardHeader,
  Button,
} from 'reactstrap';
import LetterAvatar from '../../../components/Elevatus/LetterAvatar';
import Tooltip from '@mui/material/Tooltip';
import { evarecAPI } from '../../../api/evarec';
import { commonAPI } from '../../../api/common';
import ScheduleMeeting from '../../../components/Views/ScheduleMeeting';
import ShowResumeModal from '../../../components/Elevatus/ShowResumeModal';
import SendOffer from '../../../components/Views/OfferModal/index';
import { CheckboxesComponent } from '../../../components';
import { useTranslation } from 'react-i18next';
import AddToPipeline from './AddToPipeline';

import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../helpers';
import { MeetingFromFeaturesEnum, SubscriptionServicesEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ResumeDeleteDialog } from './dialogs';
import { RMSPermissions } from '../../../permissions';
import { ResumeDetailsDialog } from './dialogs/ResumeDetails.Dialog';
import { EvaAnalysisDialog } from '../../../components/EvaAnalysis/EvaAnalysis.Dialog';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

const GridRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const ResumeCard = ({ isSelected, ...props }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenDetailsDialog, setIsOpenDetailsDialog] = useState(false);
  const [isOpenEvaAnalysisDialog, setIsOpenEvaAnalysisDialog] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isSendOfferModalOpen, setIsSendOfferModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );

  /**
   * Handler to show the schedule interview modal
   */
  const showScheduleModal = () => {
    // Language
    const { language }
      = (localStorage.getItem('user')
        && JSON.parse(localStorage.getItem('user'))?.results)
      || undefined;
    commonAPI.getTimeZones().then((res) => {
      setDialog(
        <ScheduleMeeting
          // relation_uuid={props.match.params.id}
          // relation={1}
          timezones={res.data.results}
          data={props}
          isOpen
          closeModal={closeDialog}
          toggle={closeDialog}
          candidate_email={props?.email}
          // We only schedule a meeting for the selected candidate
          selectedCandidates={[]}
          candidate={{
            title: props.title,
            uuid: props.user_uuid,
          }}
          user={props.user}
          languages={language}
          from_feature={MeetingFromFeaturesEnum.RMS.key}
          rms
        />,
      );
    });
  };

  // Adds a resume to a pipeline
  const addToPipeline = () => {
    const candidateUuid = props?.candidate_uuid ? props?.candidate_uuid : null;
    evarecAPI
      .searchJob(0, candidateUuid, 'rms')
      .then((response) => {
        setDialog(
          <AddToPipeline
            isOpen
            onClose={closeDialog}
            email={props.email}
            uuid={props.uuid}
            jobs={response?.data?.results}
            source="rms"
            candidate_uuid={props.user_uuid}
          />,
        );
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };
  // Adds a resume to a pipeline
  const showResume = () => {
    setShowResumeModal(true);
  };

  const closeDialog = () => {
    if (showResumeModal) setShowResumeModal(false);
    setDialog(null);
  };

  // This function either returns the Profile Picture or a fontawesome Avatar (User)
  // It is important to note that the default behavior is having a link to the picture
  // But for the same of clarity will will override it to test.
  props.profile_pic = null;

  /* A function from stackoverflow that capitalizes a string o multiple words/tokens */
  function capitalize(input) {
    const trimmedInput = (typeof input === 'string' ? input : '').replace(
      /\s+$/,
      '',
    );
    const words = trimmedInput.split(' ');
    const CapitalizedWords = [];
    words.forEach((element) => {
      CapitalizedWords.push(
        element[0]?.toUpperCase() + element.slice(1, element.length),
      );
    });
    return CapitalizedWords.join(' ');
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
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

  return (
    <div className="card-item-wrapper size-x2">
      <Card
        className={`resume-list-card card-contents-wrapper ${classnames(
          'm-2 stage-card premium-card share-card resume-card-rms shadow px-2 pt-2 pb-0',
          props.isGhosting && 'ghosting',
          isSelected && 'selected',
        )}`}
      >
        {dialog}
        {showResumeModal && (
          <ShowResumeModal
            isOpen={showResumeModal}
            onClose={closeDialog}
            link={props?.url}
          />
        )}
        {isSendOfferModalOpen && (
          <SendOffer
            isOpen
            closeModal={() => setIsSendOfferModalOpen(false)}
            toggle={closeDialog}
            pipeline={localStorage.getItem('pipeLineUuid')}
            match
            user={user}
            rms_uuid={props.uuid}
            candidate_email={props.email}
            firstname={props.title ? props.title.split(' ')[0] : null}
            lastname={props.title ? props.title.split(' ')[1] : null}
            rms
          />
        )}
        <CardHeader className="padding-10">
          <GridRow style={{ alignItems: 'flex-start' }} className="mb-1">
            {/* <AvatarPic /> */}
            {props.title ? (
              <LetterAvatar name={props?.title} />
            ) : (
              <LetterAvatar name="N/A" />
            )}
            <div className="action-buttons fa-center py-2">
              {props?.url && (
                <Button
                  onClick={showResume}
                  className="btn btn-sm btn-link rounded-circle font-16 text-gray align-items-center justify-content-center"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: RMSPermissions.ViewResumes.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <i className="fa fa-eye text-gray" />
                </Button>
              )}
              <UncontrolledDropdown>
                <DropdownToggle
                  className="btn btn-sm btn-link rounded-circle font-16 text-gray d-flex align-items-center justify-content-center"
                  style={{
                    width: 24,
                    height: 24,
                    background: 'none',
                    border: 'none',
                  }}
                >
                  <i className="fa fa-ellipsis-h" />
                </DropdownToggle>
                <DropdownMenu end>
                  {props.matched_job && (
                    <DropdownItem
                      onClick={() => setIsOpenEvaAnalysisDialog(true)}
                      className="dropdown-item d-flex align-items-center"
                    >
                      {t(`${translationPath}eva-analysis`)}
                    </DropdownItem>
                  )}
                  <DropdownItem
                    onClick={() => setIsOpenDetailsDialog(true)}
                    className="dropdown-item d-flex align-items-center"
                  >
                    {t(`${translationPath}view-extracted-data`)}
                  </DropdownItem>
                  <div onMouseEnter={onPopperOpen}>
                    <DropdownItem
                      onClick={showScheduleModal}
                      className="dropdown-item d-flex align-items-center"
                      disabled={
                        !getIsAllowedPermissionV2({
                          permissionId: RMSPermissions.ScheduleAMeeting.key,
                          permissions: permissionsReducer,
                        })
                      }
                    >
                      {t(`${translationPath}schedule-a-meeting`)}
                    </DropdownItem>
                  </div>
                  <Tooltip
                    title={
                      !props?.email || props?.email === ''
                        ? t(`${translationPath}candidate-email-not-detected`)
                        : ''
                    }
                  >
                    <span>
                      <DropdownItem
                        onClick={addToPipeline}
                        disabled={
                          !props?.email
                          || props?.email === ''
                          || !getIsAllowedPermissionV2({
                            permissionId: RMSPermissions.AddCandidateToPipeline.key,
                            permissions: permissionsReducer,
                          })
                        }
                        className="dropdown-item d-flex align-items-center"
                      >
                        {t(`${translationPath}add-to-pipeline`)}
                      </DropdownItem>
                    </span>
                  </Tooltip>
                  {/*<Tooltip*/}
                  {/*  title={*/}
                  {/*    !props?.email || props?.email === ''*/}
                  {/*      ? t(`${translationPath}candidate-email-not-detected`)*/}
                  {/*      : ''*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <div onMouseEnter={onPopperOpen}>*/}
                  {/*    <DropdownItem*/}
                  {/*      onClick={() => {*/}
                  {/*        setIsSendOfferModalOpen(true);*/}
                  {/*      }}*/}
                  {/*      disabled={*/}
                  {/*        !props?.email || props?.email === ''*/}
                  {/*        || !getIsAllowedPermissionV2({*/}
                  {/*          permissionId: ManageApplicationsPermissions.SendOffer.key,*/}
                  {/*          permissions: permissionsReducer,*/}
                  {/*        })*/}
                  {/*      }*/}
                  {/*      className="dropdown-item d-flex align-items-center"*/}
                  {/*    >*/}
                  {/*      {t(`${translationPath}send-offer`)}*/}
                  {/*    </DropdownItem>*/}
                  {/*  </div>*/}
                  {/*</Tooltip>*/}
                  <DropdownItem
                    onClick={() => setIsOpenDeleteDialog(true)}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: RMSPermissions.DeleteResumes.key,
                        permissions: permissionsReducer,
                      })
                    }
                    className="dropdown-item d-flex align-items-center"
                  >
                    {t(`${translationPath}delete-resume`)}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </GridRow>
        </CardHeader>
        <CardBody className="px-2 py-0">
          <GridRow>
            <div className="d-flex flex-column flex-grow-1 mt-2">
              <p className="m-1 mb-2 h6">
                {props.title
                  ? capitalize(props?.title.toLowerCase())
                  : t(`${translationPath}candidate-name-cant-be-detected`)}
              </p>
              {props?.subtitle && (
                <div className="h6 text-gray" style={{ overflowWrap: 'anywhere' }}>
                  {props?.subtitle}
                </div>
              )}
            </div>
          </GridRow>
          {/*{props.reference_number && (*/}
          {/*  <GridRow>*/}
          {/*    {props?.reference_number && (*/}
          {/*      <div className="w-100">*/}
          {/*        <p className="m-1 h7 p_truncate compact-layout">*/}
          {/*          <span>{`${t(`${translationPath}candidate-reference-number`)}: ${*/}
          {/*            props.reference_number*/}
          {/*          }`}</span>*/}
          {/*        </p>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  </GridRow>*/}
          {/*)}*/}
          <GridRow>
            {props?.experiences && (
              <div className="w-100">
                <p className="m-1 h7 p_truncate compact-layout">
                  {` ${
                    props.experiences?.job_title
                      ? ` - ${capitalize(props.experiences?.job_title)}`
                      : t(`${translationPath}position-could-not-be-detected`)
                  }
                   ${
              props.experiences?.company
                ? ` @ ${props.experiences?.company}`
                : ''
              }`}
                </p>
              </div>
            )}
          </GridRow>
          <GridRow>
            {props?.education && (
              <div className="w-100">
                <p className="m-1 h7 p_truncate compact-layout">
                  {/* {' '} */}
                  {` ${
                    props.education?.major
                      ? ` - ${capitalize(props.education?.major)}`
                      : t(`${translationPath}major-could-not-be-detected`)
                  }`}
                </p>
              </div>
            )}
          </GridRow>
          <GridRow>
            {props?.education && (
              <div className="w-100">
                <p className="m-1 h7 p_truncate">
                  {/* {' '} */}
                  {`${
                    props.education?.institution
                      ? ` - ${capitalize(props.education?.institution)}`
                      : t(`${translationPath}institution-could-not-be-detected`)
                  }`}
                </p>
              </div>
            )}
          </GridRow>
          <GridRow className="my-3 flex-wrap justify-content-start">
            {props.skills
              && props.skills.slice(0, 5).map((item, index) => (
                <React.Fragment key={`skillsKey${index + 1}`}>
                  <Badge
                    data-toggle="tooltip"
                    data-placement="top"
                    title={item}
                    data-container="body"
                    data-animation="true"
                    pill
                    className="skills-badge mb-1"
                    style={{ fontSize: '11px' }}
                    color=""
                  >
                    {/* This was set at 10 and 9, respectively but I've found that
                          12 and 11, as well as 15 and 14 tend to look great. */}
                    <span className="status">
                      {item.length > 15 ? `${item.substr(0, 14)} ...` : item}
                    </span>
                  </Badge>
                </React.Fragment>
              ))}
          </GridRow>
        </CardBody>
        <CardFooter className="padding-10">
          <div className="w-100 d-flex align-items-center justify-content-between text-gray">
            <div>
              {props.score >= 0 && (
                <div
                  className={classnames(
                    'candidate-badge',
                    props.score >= 67
                      ? 'success'
                      : props.score < 33
                        ? 'error'
                        : 'warning',
                  )}
                  style={{ fontSize: '0.85rem' }}
                >
                  {Math.round(props.score) || 0}%
                </div>
              )}
            </div>
            <div className="resume-list-checkbox">
              {props?.withCheckbox && (
                <CheckboxesComponent
                  idRef={`candidate${props.uuid}`}
                  singleChecked={isSelected}
                  onSelectedCheckboxChanged={() =>
                    props.toggleSelection({
                      uuid: props.uuid,
                      email: props.email,
                      candidate_uuid: props.user_uuid,
                      name: `${
                        props.title
                          ? capitalize(props?.title.toLowerCase())
                          : t(`${translationPath}no-name`)
                      }`,
                    })
                  }
                />
              )}
            </div>
          </div>
        </CardFooter>
        {dialog}
        {isOpenDeleteDialog && props.uuid && (
          <ResumeDeleteDialog
            rms_uuid={props.uuid}
            isOpen={isOpenDeleteDialog}
            onSave={props.onDeleteResume}
            isOpenChanged={() => {
              setIsOpenDeleteDialog(false);
            }}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {isOpenDetailsDialog && props.uuid && (
          <ResumeDetailsDialog
            data={props.resumeData}
            isOpen={isOpenDetailsDialog}
            isOpenChanged={() => {
              setIsOpenDetailsDialog(false);
            }}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {isOpenEvaAnalysisDialog && props.uuid && (
          <EvaAnalysisDialog
            source="rms"
            job_uuid={props.matched_job}
            media_uuid={props.resumeData.media_uuid}
            isOpen={isOpenEvaAnalysisDialog}
            isOpenChanged={() => {
              setIsOpenEvaAnalysisDialog(false);
            }}
            email={props?.email}
            resume_uuid={props.resumeData.uuid}
          />
        )}
        <NoPermissionComponent
          anchorEl={anchorEl}
          popperOpen={popperOpen}
          setAnchorEl={setAnchorEl}
          setPopperOpen={setPopperOpen}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
  configs: state.Configs,
});
export default connect(mapStateToProps)(ResumeCard);

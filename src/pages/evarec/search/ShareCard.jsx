import React, { useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import styled from 'styled-components';
import classnames from 'classnames';
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { ButtonBase, IconButton } from '@mui/material';
import { evarecAPI } from '../../../api/evarec';
import ScheduleMeeting from '../../../components/Views/ScheduleMeeting';
import { EleModal } from '../../../components/Elevatus/EleModal';
import JobCandidateModal from '../../../components/Views/CandidateModals/evarecCandidateModal';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import LetterAvatar from '../../../components/Elevatus/LetterAvatar';
import AddToPipeline from '../rms/AddToPipeline';
import { CheckboxesComponent, DialogComponent } from '../../../components';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../helpers';
import {
  CandidateTypesEnum,
  MeetingFromFeaturesEnum,
  SubscriptionServicesEnum,
} from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { SearchDatabasePermissions } from '../../../permissions';
import { AppliedJobsTab } from '../../../components/Views/CandidateModals/evarecCandidateModal/AppliedJobs/AppliedJobs.Tab';
import { GetAllIntegrationsConnections } from '../../../services';
import { EvaAnalysisDialog } from '../../../components/EvaAnalysis/EvaAnalysis.Dialog';

const translationPath = '';
const parentTranslationPath = 'EvarecRecSearch';
const GridRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Img = styled.img`
  min-width: 36px;
`;

const ShareCard = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [dialog, setDialog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const [isFavorite, setIsFavorite] = useState(
    props.applicant?.user_detail?.[0]?.is_favorite,
  );
  // Flag to hold Expand skills state
  const [expand, setExpand] = useState(true);
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const [isOpenEvaAnalysisDialog, setIsOpenEvaAnalysisDialog] = useState(false);

  const getCurrentActiveProfile = useMemo(
    () => () =>
      (selectedBranchReducer
        && props.applicant?.candidate_company?.find(
          (item) => item.uuid === selectedBranchReducer.uuid,
        ))
      || (props.applicant?.candidate_company?.length > 0
        && props?.applicant?.candidate_company?.[0]),
    [props.applicant?.candidate_company, selectedBranchReducer],
  );

  /**
   * This closes dialogs
   */
  const closeDialog = () => setDialog(null);

  const showScheduleModal = () => {
    setDialog(
      <ScheduleMeeting
        searchDatabase
        timezones={props.timezones}
        data={props}
        isOpen
        from_feature={MeetingFromFeaturesEnum.SearchDatabase.key}
        closeModal={closeDialog}
        toggle={closeDialog}
        candidate_email={props.email}
        selectedCandidates={(props?.isShareResume && props?.user_uuid) || props.uuid}
        candidate={{
          title: props.title,
          uuid: (props?.isShareResume && props?.user_uuid) || props.uuid,
        }}
      />,
    );
  };
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

  // Adds a resume to a pipeline
  const addToPipeline = () => {
    evarecAPI
      .searchJob(0, props?.profile_uuid)
      .then((response) => {
        setDialog(
          <AddToPipeline
            isOpen
            fromCandidateDatabase={props.fromCandidateDatabase}
            isShareResume={props.isShareResume}
            onClose={closeDialog}
            email={props.email}
            uuid={
              props.fromCandidateDatabase || props.isShareResume
                ? props.profile_uuid
                : props.uuid
            }
            jobs={response.data.results}
          />,
        );
      })
      .catch((error) => showError(t('Shared:failed-to-get-saved-data'), error));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if partner connected or not
   */
  const getIsConnectedPartner = useMemo(
    () =>
      ({ key }) =>
        props.connections.results.some(
          (item) => item.partner === key && item.is_connected,
        ),
    [props.connections.results],
  );

  return (
    <div className="card-item-wrapper">
      <Card
        className={classnames(
          'card-contents-wrapper card h-100 p-3',
          props.isGhosting && 'ghosting',
          props.isSelected && 'selected',
        )}
      >
        {dialog}
        <GridRow className="bd-highlight">
          {props?.applicant?.profile_pic || props.profile_pic ? (
            <Img
              className="avatar  avatar-sm  rounded-circle text-white img-circle"
              style={{
                height: 50,
                width: 50,
                minWidth: 50,
              }}
              src={props?.applicant?.profile_pic || props.profile_pic}
            />
          ) : (
            <LetterAvatar large name={props.title} />
          )}

          <div className="ml-2-reversed d-flex flex-column flex-grow-1">
            <ButtonBase
              className="btns theme-card-title"
              onClick={
                props.share
                  ? props.onClick
                  : () => {
                    // eslint-disable-next-line no-unused-expressions
                    props.is_completed_profile
                      ? window.open(
                        `${
                          process.env.REACT_APP_HEADERS
                        }/recruiter/job/search-database/profile/${
                          props.profile_uuid
                        }?company_uuid=${
                          getCurrentActiveProfile().company_uuid
                        }`,
                        '_blank',
                      )
                      : {};
                  }
              }
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: SearchDatabasePermissions.ViewCvCandidate.key,
                })
              }
            >
              {props.title}
            </ButtonBase>
            {props.position && props?.comapny && (
              <div
                className="h7 text-gray t-90p"
                style={{ overflowWrap: 'anywhere' }}
              >
                {props.position} {t(`${translationPath}at`)}{' '}
                {(props.comapny
                  && (props.comapny[i18next.language] || props.comapny.en))
                  || 'N/A'}
              </div>
            )}
          </div>
          <div className="action-buttons d-inline-flex-center">
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
              <DropdownMenu>
                {props.match_job_uuid && (
                  <div onMouseEnter={onPopperOpen}>
                    <DropdownItem
                      onClick={() => setIsOpenEvaAnalysisDialog(true)}
                      className="dropdown-item d-flex align-items-center"
                    >
                      {t(`${translationPath}eva-analysis`)}
                    </DropdownItem>
                  </div>
                )}
                <div onMouseEnter={onPopperOpen}>
                  <DropdownItem
                    onClick={showScheduleModal}
                    className="dropdown-item d-flex align-items-center"
                    disabled={
                      // userReducer?.results?.user?.is_provider
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          SearchDatabasePermissions.ScheduleInterview.key,
                      })
                    }
                  >
                    {t(`${translationPath}schedule-interview`)}
                  </DropdownItem>
                </div>
                <Tooltip
                  title={
                    props.is_completed_profile ? '' : 'InCompleted Candidate Profile'
                  }
                >
                  <span>
                    <DropdownItem
                      onClick={addToPipeline}
                      className="dropdown-item d-flex align-items-center"
                      disabled={
                        !props.is_completed_profile
                        || !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                            SearchDatabasePermissions.AddCandidateToApplication.key,
                        })
                      }
                    >
                      {t(`${translationPath}add-to-pipeline`)}
                    </DropdownItem>
                  </span>
                </Tooltip>
              </DropdownMenu>
            </UncontrolledDropdown>
            {props.fromCandidateDatabase && (
              <div className="float-left mx-2">
                <>
                  {props.applied ? (
                    <Tooltip title="This candidate has an application on file.">
                      <i className="far fa-file-alt text-brand-green" />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={t(`${translationPath}this-candidate-has-not-applied`)}
                    >
                      <i className="far fa-file-alt text-brand-gray" />
                    </Tooltip>
                  )}
                </>
              </div>
            )}
          </div>
        </GridRow>
        <GridRow className="h-100 p-2">
          <div className="d-flex-v-center-h-between">
            <span>{props.subtitle}</span>
            {props?.applicant?.candidate_type
            === CandidateTypesEnum.Employee.value ? (
                <div className="chip-item small-item mx-0 my-0">
                  {t(`${translationPath}employee`)}
                </div>
              ) : null}
          </div>
        </GridRow>
        <GridRow className="h-100">
          <span className="text-gray px-2 fz-14px">
            {`${t(`${translationPath}registered-at`)}: ${
              props?.applicant?.candidate_registration_date || '-'
            }`}
          </span>
        </GridRow>
        <GridRow className="h-100">
          <ButtonBase
            className="btns theme-outline mt-3"
            onClick={() => setShowAppliedJobs(true)}
          >
            <span>{t(`${translationPath}show-applied-jobs`)}</span>
          </ButtonBase>
        </GridRow>
        {/*{props.reference_number && (*/}
        {/*  <GridRow className="h-100">*/}
        {/*    <div className="mt-3 h7 text-gray">{`${t(`${translationPath}candidate-reference-number`)}: ${props.reference_number}`}</div>*/}
        {/*  </GridRow>*/}
        {/*)}*/}
        {/*{props.applicant?.applicant_number.length > 0  && (*/}
        {/*  <GridRow className="h-100">*/}
        {/*    <div className="mt-3 h7 text-gray">{`${t(`${translationPath}application-reference-number`)}: ${props.applicant?.applicant_number}`}</div>*/}
        {/*  </GridRow>*/}
        {/*)}*/}

        {props.applicant?.assigned_user_uuid && (
          <GridRow className="h-100">
            <div className="mt-3 h7 text-gray">{`${t(
              `${translationPath}assignee-name`,
            )}: ${
              props.applicant.assigned_user?.first_name?.[i18next.language]
              || props.applicant.assigned_user?.first_name?.en
            } ${
              props.applicant.assigned_user?.last_name?.[i18next.language]
              || props.applicant.assigned_user?.last_name?.en
              || ''
            }`}</div>
          </GridRow>
        )}
        <GridRow className="h-100">
          <div className="w-100 mt-3">
            {expand
              && props.tabs
              && props.tabs.slice(0, 3).map((tab, index) => (
                <div
                  className="chip-item small-item mx-1 mb-2"
                  key={`tabsChipsKey${index + 1}`}
                >
                  {tab}
                </div>
              ))}
            {!expand
              && props.tabs
              && props.tabs.map((tab, index) => (
                <div
                  className="chip-item small-item mx-1 mb-2"
                  key={`tabsChipsKey${index + 1}`}
                >
                  {tab}
                </div>
              ))}
            {expand && props.tabs && props.tabs.length > 3 && (
              <ButtonBase
                className="chip-item small-item mx-1 mb-2"
                onClick={() => setExpand(false)}
              >
                +{props.tabs.length - 3}
              </ButtonBase>
            )}
          </div>
        </GridRow>
        <GridRow>
          <div className="w-100 d-flex align-items-center justify-content-between text-gray">
            <IconButton
              disabled={
                isLoading
                || !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: SearchDatabasePermissions.AddCandidateToFavorite.key,
                })
              }
              onClick={() => {
                setIsLoading(true);
                evarecAPI
                  .favouriteCandidate(
                    props.isShareResume ? props.user_uuid : props.uuid,
                  )
                  .then(() => {
                    setIsFavorite((item) => !item);
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    showError(
                      (error && error.data && error.data.message)
                        || t('Shared:failed-to-update'),
                    );
                  });
              }}
            >
              {isFavorite ? (
                <i className="fas fa-heart text-brand-pink" />
              ) : (
                <i className="far fa-heart" />
              )}
            </IconButton>
            {props.score >= 0 && (
              <div
                className={classnames(
                  'candidate-badge',
                  (props.score >= 70 && 'success')
                    || (props.score > 35 ? 'warning' : 'error'),
                )}
              >
                {Math.round(props.score) || 0}%
              </div>
            )}
            {!props.isShareResume && (
              <CheckboxesComponent
                idRef={`candidate${props.uuid}`}
                singleChecked={
                  props.isSelected
                  || props.selectedTaskIds.findIndex((item) => item === props.uuid)
                    !== -1
                }
                onSelectedCheckboxClicked={() => {
                  props.toggleSelection(props.uuid);
                  props.toggleProfileSelection(props.profile_uuid);
                }}
              />
            )}
          </div>
        </GridRow>

        {props.ATSModal && (
          <EleModal
            show={props.ATSModal}
            handleClose={() => props.setATSModal(false)}
          >
            <JobCandidateModal
              jobUuid={props.job_uuid}
              currentJob={props?.currentJob || {}}
              jobPipelineUUID={props?.currentJob?.job?.pipelines?.[0]?.uuid}
              // currentPipelineId={currentPipeline?.job?.pipeline_uuid}
              selectedCandidate={props.uuid}
              profileUuid={props?.profile_uuid}
              score={props?.score}
              profile={props?.profile || []}
              applied_at={props?.date}
              stages={props?.stages || []}
              candidateUuid={props.user_uuid}
              show={props.ATSModal}
              onClose={() => {
                props.setATSModal(!props.ATSModal);
              }}
              share
            />
          </EleModal>
        )}
        {props.ATSModal && (
          <EleModal
            show={props.ATSModal}
            handleClose={() => props.setATSModal(false)}
          >
            <JobCandidateModal
              jobUuid={props.job_uuid}
              currentJob={props?.currentJob || {}}
              jobPipelineUUID={props?.currentJob?.job?.pipelines?.[0]?.uuid}
              getIsConnectedPartner={getIsConnectedPartner}
              // currentPipelineId={currentPipeline?.job?.pipeline_uuid}
              selectedCandidate={props.uuid}
              profileUuid={props?.profile_uuid}
              score={props?.score}
              profile={props?.profile || []}
              applied_at={props?.date}
              stages={props?.stages || []}
              candidateUuid={props.user_uuid}
              show={props.ATSModal}
              onClose={() => {
                props.setATSModal(!props.ATSModal);
              }}
              share
            />
          </EleModal>
        )}

        <DialogComponent
          maxWidth="md"
          titleText="applied-jobs"
          contentClasses="px-0"
          dialogContent={
            <AppliedJobsTab candidate_uuid={props?.uuid || props?.user_uuid} />
          }
          wrapperClasses="setups-management-dialog-wrapper"
          isOpen={showAppliedJobs}
          onCloseClicked={() => setShowAppliedJobs(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        {isOpenEvaAnalysisDialog && (
          <EvaAnalysisDialog
            source={'search-database'}
            job_uuid={props.match_job_uuid}
            profile_uuid={props.profile_uuid}
            user_uuid={props?.uuid}
            isOpen={isOpenEvaAnalysisDialog}
            isOpenChanged={() => {
              setIsOpenEvaAnalysisDialog(false);
            }}
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
export default connect(mapStateToProps)(ShareCard);

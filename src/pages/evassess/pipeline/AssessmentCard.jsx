/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Badge,
  Row,
  Col,
  Card,
} from 'reactstrap';
import Rating from '@mui/material/Rating';
import { connect, useSelector } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import moment from 'moment';
import ScheduleMeeting from 'components/Views/ScheduleMeeting';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import SendOffer from 'components/Views/OfferModal/index';
import { CheckboxesComponent } from 'components/Checkboxes/Checkboxes.Component';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
} from '../../../helpers';
import { MeetingFromFeaturesEnum, SubscriptionServicesEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import {
  CreateAssessmentPermissions,
  ManageAssessmentsPermissions,
} from '../../../permissions';
import useVitally from '../../../hooks/useVitally.Hook';

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
  margin-bottom: 4px;
  margin-left: auto;
  margin-top: 16px;
  opacity: 0.3;
  transition: 0.3s ease all;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
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
const translationPath = 'AssessmentCardComponent.';
const AssessmentCard = ({
  isSelected,
  stage_uuid,
  isDraggable,
  selectedColumn,
  isPipelineLoading,
  setSelectedColumn,
  remainingCreditsLimit,
  currentAssessment,
  ...props
}) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSendOfferModalOpen, setIsSendOfferModalOpen] = useState(false);
  const { VitallyTrack } = useVitally();
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleClick(e);
  };
  // Open the Candidate Modal from the notification list.
  useEffect(() => {
    if (
      window.location.search.substring(
        window.location.search.lastIndexOf('=') + 1,
      ) === props.user_uuid
    )
      props.showModal2(
        props.uuid,
        props.match.params.id,
        props.isCompleted,
        props.similarity,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  const onCardClicked = (event) => {
    // if (!isDraggable) return;
    event.preventDefault();
    event.stopPropagation();
    props.showModal2(
      props.uuid,
      props.match.params.id,
      props.isCompleted,
      props.similarity,
    );
    VitallyTrack('EVA-SSESS - Open candidate modal');
    window?.ChurnZero?.push([
      'trackEvent',
      'EVA-SSESS - Open candidate modal',
      'Open candidate modal',
      1,
      {},
    ]);
  };

  return (
    <>
      <ToastProvider placement="top-center">
        {isScheduleModalOpen && props.timezones && (
          <ScheduleMeeting
            relation_uuid={props.match.params.id}
            relation={2}
            from_feature={MeetingFromFeaturesEnum.VideoAssessment.key}
            timezones={props.timezones}
            data={props}
            isOpen={isScheduleModalOpen}
            closeModal={() => setIsScheduleModalOpen(false)}
            toggle={() => setIsScheduleModalOpen(false)}
            selectedCandidates={props.uuid}
            candidate_email={props.candidate_email}
            parentTranslationPath={props.parentTranslationPath}
            candidate={{
              title: props.title,
              uuid: props.user_uuid,
            }}
            user={props.user}
            languages={JSON.parse(localStorage.getItem('user'))?.results?.language}
            pipeline_uuid={currentAssessment.pipeline.uuid}
          />
        )}
        {isSendOfferModalOpen && (
          <SendOffer
            isOpen={isSendOfferModalOpen}
            closeModal={() => setIsSendOfferModalOpen(false)}
            pipeline={localStorage.getItem('pipeLineUuid')}
            user={props.user}
            relation={2}
            parentTranslationPath={props.parentTranslationPath}
            relation_uuid={props.match.params.id}
            relation_candidate_uuid={props.uuid}
          />
        )}
      </ToastProvider>
      <ToastProvider placement="top-center">
        <Card
          className={classnames(
            'm-2 stage-card pipeline-stage-card evassess',
            props.isGhosting && 'ghosting',
            isSelected && 'selected',
            isDraggable && 'c-pointer',
          )}
          onClick={onCardClicked}
        >
          {props.selectionCount && <Pill>{props.selectionCount}</Pill>}
          <Grid>
            <GridRow style={{ alignItems: 'flex-start' }}>
              <LetterAvatar name={props.title} />
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
                <Row className="  ml-1-reversed mt-2">
                  <Col xs="9" className="px-0">
                    <Badge className="badge-dot" color="">
                      <i
                        className={props.isCompleted ? 'bg-success' : 'bg-danger'}
                      />
                      <span className="status">
                        {props.isCompleted
                          ? t(`${translationPath}complete`)
                          : t(`${translationPath}incomplete`)}
                      </span>
                    </Badge>
                  </Col>
                  <Col xs="3" className="px-0">
                    <div
                      style={{ marginTop: 3 }}
                      className={classnames(
                        'candidate-badge',
                        props.similarity >= 67
                          ? 'success'
                          : props.similarity < 33
                            ? 'error'
                            : 'warning',
                      )}
                    >
                      {Math.round(props.similarity) || 0}%
                    </div>
                  </Col>
                </Row>
                <div id="assessment-card-rating-wrapper" style={{ marginTop: 5 }}>
                  <Rating
                    name="avg_rating2"
                    value={props.avg_rating || 0}
                    disabled
                  />
                </div>
              </div>
              {getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  UpdateEvaSsessApplication:
                    CreateAssessmentPermissions.UpdateEvaSsessApplication,
                  AddEvaSsessApplication:
                    CreateAssessmentPermissions.AddEvaSsessApplication,
                },
              }) && (
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsScheduleModalOpen(true);
                          }}
                          className="dropdown-item d-flex align-items-center"
                          disabled={
                            !getIsAllowedPermissionV2({
                              permissions,
                              permissionId:
                                ManageAssessmentsPermissions.ScheduleMeeting.key,
                            })
                          }
                        >
                          <i className="fas fa-clock" />
                          <span>{t(`${translationPath}schedule-interview`)}</span>
                        </DropdownItem>
                      </div>
                      <div onMouseEnter={onPopperOpen}>
                        <DropdownItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsSendOfferModalOpen(true);
                          }}
                          // disabled={
                          //   !getIsAllowedPermissionV2({
                          //     permissions,
                          //     permissionId:
                          //     ManageAssessmentsPermissions.SendOffer.key,
                          //   })
                          // }
                          className="dropdown-item d-flex align-items-center"
                        >
                          <i className="fa fa-paper-plane" />
                          <span>{t(`${translationPath}send-offer`)}</span>
                        </DropdownItem>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <Handle onClick={handleDrag} {...props.dragHandleProps}>
                    {remainingCreditsLimit > 0 ? (
                      isDraggable ? (
                        <i
                          style={{
                            fontSize: '16px',
                            cursor: isDraggable ? 'grab' : 'not-allowed',
                          }}
                          className="fas fa-grip-vertical"
                        />
                      ) : (
                        <i className="fas fa-circle-notch fa-spin" />
                      )
                    ) : (
                      <i
                        style={{
                          fontSize: '16px',
                          cursor: isDraggable ? 'grab' : 'not-allowed',
                        }}
                        className="fas fa-grip-vertical"
                      />
                    )}
                  </Handle>
                </div>
              )}
            </GridRow>
            <GridRow>
              <div className="w-100 text-gray d-flex-v-center-h-between flex-wrap">
                <div className="d-inline-flex-v-center flex-wrap">
                  <small className="m-0 h7">
                    {props.comments ? props.comments : 0}
                    <i className="far fa-comment-alt m-1" />
                  </small>
                  <small className="m-0 h7 ml-3-reversed">
                    <i className="far fa-clock" />
                    &nbsp;
                    {moment(Date.parse(props.task.register_at))
                      .locale(i18next.language)
                      .format('DD MMM YYYY')}
                  </small>
                </div>
                <CheckboxesComponent
                  idRef={`candidate${props.uuid}`}
                  singleChecked={isSelected}
                  isDisabled={isPipelineLoading}
                  onSelectedCheckboxClicked={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (isSelected && stage_uuid === selectedColumn)
                      setSelectedColumn('');

                    if (props.setSelected) props.setSelected(props.uuid);
                    props.setSelectedTaskItems((items) => {
                      const ItemIndex = items.findIndex(
                        (el) => el.id === props.uuid,
                      );
                      if (ItemIndex !== -1) items.splice(ItemIndex, 1);
                      else items.push(props.candidate);
                      return [...items];
                    });
                  }}
                />
              </div>
            </GridRow>
          </Grid>
        </Card>
      </ToastProvider>

      <NoPermissionComponent
        anchorEl={anchorEl}
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
export default connect(mapStateToProps)(AssessmentCard);

/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  Badge,
  Button,
  Col,
  Modal,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  ModalBody,
  FormGroup,
} from 'reactstrap';
import Select from 'react-select';
import { useToasts } from 'react-toast-notifications';
import ReactPaginate from 'react-paginate';
import { evassessAPI } from '../../../api/evassess';
import { kebabToTitle } from '../../../shared/utils';
import { CheckboxesComponent } from '../../../components';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import { ThreeDots } from '../../recruiter-preference/components/Loaders';
import Empty from '../../recruiter-preference/components/Empty';
import {
  getIsAllowedPermissionV2,
  GlobalSavingDateFormat,
  showError,
} from '../../../helpers';
import { useSelector } from 'react-redux';
import { ManageAssessmentsPermissions } from 'permissions';
import { EvaSessInviteStatusEnum } from '../../../enums';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';
import { GetEvaRecVideoAssessment } from '../../../services';
import { SharedAutocompleteControl } from '../../setups/shared';

const ExtendCard = styled(ModalBody)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  & > * {
    margin-bottom: 2px;
  }

  & span {
    font-size: 14px;
  }
`;
const translationPath = 'InviteStatusComponent.';
const InviteStatus = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  // Pagination
  const [limit] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [candidates, setCandidates] = useState();
  const [candidatesView, setCandidatesView] = useState();
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [totalCandidates] = useState([]);
  const [, setFirstTime] = useState(true);
  const [isGettingCandidates, setIsGettingCandidates] = useState(true);
  const [flagQuery, setFlagQuery] = useState(false);
  const [value, setValue] = useState('');
  const [candidatesSummary, setCandidatesSummary] = useState({});
  const [jobAssessments, setJobAssessments] = useState([]);
  const [assessmentUUID, setAssessmentUUID] = useState(
    props?.match?.params?.id || '',
  );
  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');
  // Tomorrow Date

  const toggleCandidate = (currentState, idToToggle) => {
    if (!currentState) {
      setSelectedCandidates((items) => items.filter((s) => s !== idToToggle));
      return;
    }
    setSelectedCandidates((items) => [...items, idToToggle]);
  };

  /**
   * Handle clicking another page (in the pagination)
   *
   * This will set the 'page' key equal to the current page and the api will use
   * it to retrieve more candidates
   * @param e
   */
  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setPage(currentPage);
    window.scrollTo(0, 0);
  };

  // Search

  const [statusFilter, setStatusFilter] = useState({
    value: 'all',
    label: t(`${translationPath}all`),
  });
  const [query, setQuery] = useState('');

  const getInvitedCandidates = useCallback(async () => {
    if (!assessmentUUID) return;
    const body = {
      uuid: assessmentUUID,
      status: statusFilter.value,
      page: page + 1,
      limit,
      query: query || null,
      ...(props?.jobUUID && { job_uuid: props?.jobUUID }),
    };
    evassessAPI
      .getInvitedCandidates(body)
      .then((res) => {
        totalCandidates.push(res.data.results.candidates);
        setCandidates(res.data.results.candidates);
        setCandidatesView(res.data.results.candidates);
        setTotal(res.data.results?.total);
        setIsGettingCandidates(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-invited-candidates`), error);
        setIsGettingCandidates(false);
      });
  }, [
    assessmentUUID,
    statusFilter.value,
    page,
    limit,
    query,
    props?.jobUUID,
    totalCandidates,
    t,
  ]);

  /**
   * Function to Update Candidates Status from Summary
   * @param {*} event
   * @param {*} date
   */
  const updateInvitedCandidatesSummary = async (event, date) => {
    if (!assessmentUUID) return;
    evassessAPI
      .updateCandidatesSummary(
        assessmentUUID,
        (event === 'invited' && 'pending') || event,
        props.jobUUID,
        date,
      )
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          date ? 'EVA-SSESS - Extend deadline' : 'EVA-SSESS - Send reminders',
          date ? 'EVA-SSESS - Extend deadline' : 'EVA-SSESS - Send reminders',
          1,
          {},
        ]);
        addToast(t(`${translationPath}candidates-status-updated-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.closeModal();
        setIsWorking(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}candidates-status-update-failed`), error);
      });
  };

  /**
   *  Function to get Candidate Status for Summary tab
   */
  const getInvitedCandidatesSummary = useCallback(async () => {
    if (!assessmentUUID) return;
    evassessAPI
      .getCandidatesSummary(assessmentUUID, props?.jobUUID)
      .then((res) => {
        setCandidatesSummary(res?.data?.results);
        setIsGettingCandidates(false);
      })
      .catch((error) => {
        showError(
          t(`${translationPath}error-in-getting-invited-candidates-summary`),
          error,
        );

        setIsGettingCandidates(false);
      });
  }, [assessmentUUID, props?.jobUUID, t]);

  const InviteStatusesObject = useMemo(() => {
    let returnedObject = {};
    Object.values(EvaSessInviteStatusEnum).forEach((currentValue) => {
      returnedObject[currentValue.value] = {
        ...currentValue,
        label: t(`${translationPath}${currentValue.label}`),
      };
    });
    return returnedObject;
  }, [t]);

  useEffect(() => {
    setIsGettingCandidates(true);
    getInvitedCandidatesSummary();
  }, [getInvitedCandidatesSummary]);

  // Status Filter
  useEffect(() => {
    if (!props.isOpen) return;
    setIsGettingCandidates(true);
    getInvitedCandidates();
  }, [
    props.isOpen,
    assessmentUUID,
    statusFilter,
    page,
    limit,
    query,
    getInvitedCandidates,
  ]);

  useEffect(() => {
    if (flagQuery && value.length === 0) {
      // setPage(0, ()=> {
      //   getInvitedCandidates();
      // });
      setPage(0);
      setQuery('');
      setFlagQuery(false);
    }
  }, [flagQuery, value]);

  const [isWorking, setIsWorking] = useState(false);

  const sendReminder = async () => {
    if (!assessmentUUID) return;
    // This line of code to flat the array of arrays into one array.
    const newArray = Array.prototype.concat.apply([], totalCandidates);
    // Remove Duplicate Objects from Array
    const invited_user = newArray.filter(
      (v, i, a) => a.findIndex((items) => items.uuid === v.uuid) === i,
    );
    const body = {
      uuid: assessmentUUID,
      user_invited: invited_user
        .filter(
          (c) => selectedCandidates.findIndex((item) => item.uuid === c.uuid) !== -1,
        )
        .map((c) => ({
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: null,
        })),
    };
    setIsWorking(true);
    evassessAPI
      .inviteCandidate(body)
      .then((res) => {
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-SSESS - Send reminders',
          'Send reminders',
          1,
          {},
        ]);
        addToast(
          <span>
            <span>{t(`${translationPath}reminder-sent-successfully-for`)}</span>
            <span className="px-1">{selectedCandidates.length}</span>
            <span>{t(`${translationPath}candidates`)}</span>
          </span>,
          {
            appearance: 'success',
            autoDismiss: true,
          },
        );
        props.closeModal();
        setIsWorking(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}candidates-invite-failed`), error);

        setIsWorking(false);
      });
  };

  // Deadline modal
  const [isFetching, setIsFetching] = useState(false);
  const [showExtendCard, setShowExtendCard] = useState(false);
  const [expiredCandidate, setExpiredCandidate] = useState();
  const [extendedDeadline, setExtendedDeadline] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedArr, setDeletedArr] = useState([]);

  const openDeadlineModal = (candidateToExtend) => {
    setShowExtendCard(true);
    setExpiredCandidate(candidateToExtend);
  };

  const doExtendDeadline = async () => {
    if (!assessmentUUID) return;
    const body = {
      uuid: assessmentUUID,
      user_invited: [
        {
          first_name: expiredCandidate.first_name,
          last_name: expiredCandidate.last_name,
          email: expiredCandidate.email,
          phone: null,
        },
      ],
      deadline: extendedDeadline,
    };
    if (!extendedDeadline) return;
    setIsFetching(true);
    evassessAPI
      .inviteCandidate(body)
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-SSESS - Extend deadline',
          'Extend deadline',
          1,
          {},
        ]);
        addToast(t(`${translationPath}deadline-extended-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setIsFetching(false);
        setExpiredCandidate(undefined);
        setShowExtendCard(false);
        setFirstTime(true);
        props.closeModal();
      })
      .catch((error) => {
        showError(t(`${translationPath}deadline-extend-failed`), error);

        setIsFetching(false);
      });
  };

  useEffect(() => {
    const newArr = selectedCandidates
      .filter(
        (item) =>
          item.status === EvaSessInviteStatusEnum.INVITED.value
          || item.status === EvaSessInviteStatusEnum.RESEND.value,
      )
      .map((item) => item.uuid);

    setDeletedArr(newArr);
  }, [selectedCandidates]);
  const getEvaRecVideoAssessment = useCallback(async () => {
    if (props?.forEvaRec && props?.jobUUID)
      try {
        const response = await GetEvaRecVideoAssessment({
          job_uuid: props?.jobUUID,
        });
        if (response.status === 200) {
          const data = response?.data?.results;
          setJobAssessments(data || []);
          if (data.length === 1) setAssessmentUUID(data?.[0]?.uuid || '');
        } else showError(t('Shared:failed-to-get-saved-data'), response);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
  }, [props?.forEvaRec, props?.jobUUID, t]);

  useEffect(() => {
    getEvaRecVideoAssessment();
  }, [getEvaRecVideoAssessment]);
  const handleDeleteStatus = () => {
    if (!assessmentUUID) return;
    setIsDeleting(true);
    evassessAPI
      .deleteInvitedStatus(assessmentUUID, deletedArr)
      .then(() => {
        addToast(t(`${translationPath}status-deleted-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });

        setIsGettingCandidates(true);
        getInvitedCandidates();
        setDeletedArr([]);
        setSelectedCandidates([]);
        setIsDeleting(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}status-deleting-failed`), error);

        setIsDeleting(false);
      });
  };
  const onAssesmentChange = useCallback((newValue) => {
    setAssessmentUUID(newValue.value);
  }, []);
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        toggle={props.onClick}
        className="modal-dialog-centered share-candidate-modal"
      >
        <div className="modal-content card mb-0 pb-3">
          <div className="modal-header border-0 bg-primary d-flex align-items-center">
            <h5 className="modal-title mt-0 text-white font-16">
              {t(`${translationPath}invite-status`)}
            </h5>
            <button
              type="button"
              className="close text-white"
              data-dismiss="modal"
              aria-hidden="true"
              onClick={props.onClick}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          {props?.forEvaRec && props?.jobUUID && (
            <div className="d-flex mt-2">
              <SharedAutocompleteControl
                editValue={assessmentUUID}
                placeholder={t(`${translationPath}select-video-assessment`)}
                title={t(`${translationPath}video-assessment`)}
                stateKey="uuid"
                isFullWidth
                getOptionLabel={(option) => option.title}
                isRequired
                disableClearable
                sharedClassesWrapper="px-2"
                initValues={jobAssessments}
                isSubmitted
                initValuesKey="uuid"
                initValuesTitle="title"
                onValueChanged={onAssesmentChange}
                // parentTranslationPath={parentTranslationPath}
                // translationPath={translationPath}
              />
            </div>
          )}
          {
            <>
              <Nav tabs className="ml-2-reversed mt-2">
                <NavItem>
                  <NavLink
                    className="py-2"
                    active={currentTab === 'tab-1'}
                    onClick={() => {
                      setCurrentTab('tab-1');
                      setIsGettingCandidates(true);
                      getInvitedCandidatesSummary();
                    }}
                  >
                    {t(`${translationPath}summary`)}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="py-2"
                    active={currentTab === 'tab-2'}
                    onClick={() => {
                      setCurrentTab('tab-2');
                      setIsGettingCandidates(true);
                      getInvitedCandidates();
                    }}
                  >
                    {t(`${translationPath}invite-status`)}
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={currentTab}>
                <TabPane key="tab-1" tabId="tab-1">
                  {assessmentUUID && (!candidatesSummary || isGettingCandidates) ? (
                    <ThreeDots />
                  ) : (
                    <>
                      <Table style={{ border: 'none !important' }}>
                        <thead>
                          <tr>
                            <th>{t(`${translationPath}candidate-status`)}</th>
                            <th>{t(`${translationPath}total`)}</th>
                            <th>{t(`${translationPath}action`)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(candidatesSummary).map((item, index) => (
                            <tr key={`candidatesSummaryKey${index + 1}`}>
                              <th scope="row">
                                {kebabToTitle(
                                  `${
                                    item[0] === 'invited'
                                      ? t(`${translationPath}pending`)
                                      : item[0] === 'un_complete'
                                        ? t(`${translationPath}incomplete`)
                                        : t(`${translationPath}${item[0]}`)
                                  }`,
                                )}
                                <span className="px-1">
                                  {t(`${translationPath}candidates`)}
                                </span>
                              </th>
                              <td>{item[1]}</td>
                              <td>
                                {item[0] !== 'complete' && (
                                  <div className="d-flex mt-2">
                                    <Button
                                      disabled={
                                        !item[1] > 0
                                        || !getIsAllowedPermissionV2({
                                          permissions,
                                          permissionId:
                                            ManageAssessmentsPermissions
                                              .ExtendDeadline.key,
                                        })
                                      }
                                      onClick={() =>
                                        item[0] === 'expired'
                                          ? setShowExtendCard(true)
                                          : updateInvitedCandidatesSummary(item[0])
                                      }
                                      color="primary"
                                      className="btn-sm ml-auto-reversed"
                                    >
                                      {isWorking && (
                                        <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                                      )}
                                      {`${
                                        isWorking
                                          ? t(`${translationPath}candidates`)
                                          : item[0] === 'expired'
                                            ? t(`${translationPath}extend-deadline`)
                                            : t(`${translationPath}send-reminder`)
                                      }`}
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div>
                        {showExtendCard && (
                          <ExtendCard className="border-top p-2 mt-3 py-3">
                            <DatePickerComponent
                              isFullWidth
                              inputPlaceholder="YYYY-MM-DD"
                              value={extendedDeadline || ''}
                              onChange={(date) => {
                                setExtendedDeadline(date.value);
                              }}
                              displayFormat={GlobalSavingDateFormat}
                              datePickerWrapperClasses="px-0"
                            />

                            <div>
                              <Button
                                color="danger"
                                className="btn-sm"
                                onClick={() => setShowExtendCard(false)}
                              >
                                {t(`${translationPath}cancel`)}
                              </Button>
                              <Button
                                disabled={!extendedDeadline}
                                color="primary"
                                className="btn-sm"
                                onClick={() => {
                                  updateInvitedCandidatesSummary(
                                    'extend',
                                    extendedDeadline,
                                  );
                                }}
                              >
                                {t(`${translationPath}submit`)}
                              </Button>
                            </div>
                          </ExtendCard>
                        )}
                      </div>
                    </>
                  )}
                </TabPane>
                <TabPane key="tab-2" tabId="tab-2">
                  <ModalBody>
                    <Row>
                      <Col xl={12}>
                        <form role="search" className="app-search-invite">
                          <div className="form-group m-0">
                            <input
                              disabled={isGettingCandidates}
                              type="text"
                              className="form-control"
                              placeholder={t(
                                `${translationPath}search-by-name-email`,
                              )}
                              value={value}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setFlagQuery(true);
                                  setPage(0);
                                  setQuery(value);
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => setValue(e.currentTarget.value)}
                            />
                          </div>
                        </form>
                      </Col>
                    </Row>
                    <Row className="p-3">
                      <Col xl={4}>
                        <h5 className="text-muted mb-3 pt-2">
                          {t(`${translationPath}candidates-list`)}
                        </h5>
                      </Col>
                      <Col xl={8} className="p-0">
                        <FormGroup className="m-0 ">
                          <Select
                            isDisabled={isGettingCandidates}
                            isLoading={isGettingCandidates}
                            onChange={(o) => {
                              setPage(0);
                              setStatusFilter(o);
                            }}
                            defaultValue={statusFilter}
                            placeholder={t(`${translationPath}select-status`)}
                            options={[
                              {
                                value: 'all',
                                label: t(`${translationPath}all`),
                              },
                              {
                                value: 'pending',
                                label: t(`${translationPath}pending`),
                              },
                              {
                                value: 'un_complete',
                                label: t(`${translationPath}incomplete`),
                              },
                              {
                                value: 'expired',
                                label: t(`${translationPath}expired`),
                              },
                              {
                                value: 'complete',
                                label: t(`${translationPath}complete`),
                              },
                            ]}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    {assessmentUUID
                      && (!candidates || !candidatesView || isGettingCandidates) && (
                      <ThreeDots />
                    )}
                    {candidates && candidatesView && !isGettingCandidates && (
                      <>
                        {candidatesView && candidatesView.length === 0 && <Empty />}

                        {candidatesView && candidatesView.length !== 0 && (
                          <Col xl={12} key="all">
                            <Row>
                              <Col className="d-flex align-items-center justify-content-between">
                                <div>
                                  <CheckboxesComponent
                                    idRef="toggle-all"
                                    singleChecked={
                                      selectedCandidates.length
                                      === candidatesView.filter(
                                        (item) => item.can_reminder,
                                      ).length
                                    }
                                    onSelectedCheckboxChanged={() => {
                                      selectedCandidates.length
                                      === candidatesView.filter(
                                        (item) => item.can_reminder,
                                      ).length
                                        ? setSelectedCandidates([])
                                        : setSelectedCandidates(() => {
                                          const localItem = candidatesView.filter(
                                            (c) => c.can_reminder,
                                          );
                                          return [...localItem];
                                        });
                                    }}
                                    label={t(`${translationPath}select-all`)}
                                  />
                                </div>
                                {selectedCandidates.length > 0 && (
                                  <small>
                                    {selectedCandidates.length}
                                    <span className="px-1">
                                      {t(`${translationPath}selected-candidates`)}
                                    </span>
                                  </small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        )}

                        {candidatesView
                          && candidatesView.map((candidate, i) => (
                            <Col
                              xl={12}
                              className="border mt-2 mb-1"
                              key={`candidateItemsKey${i + 1}`}
                            >
                              <Row className="pt-3 pb-3">
                                <Col xl={12} className="d-flex-v-center-h-between">
                                  <CheckboxesComponent
                                    wrapperClasses="w-50"
                                    idRef={`candidate-${i}`}
                                    singleChecked={
                                      candidate.can_reminder
                                      && selectedCandidates.findIndex(
                                        (item) => item.uuid === candidate.uuid,
                                      ) !== -1
                                    }
                                    onSelectedCheckboxChanged={
                                      candidate.can_reminder
                                      && ((e, isChecked) =>
                                        toggleCandidate(isChecked, candidate))
                                    }
                                    isDisabled={!candidate.can_reminder}
                                    label={
                                      <div>
                                        {`${candidate.first_name} ${candidate.last_name}`}
                                        <small className="m-0 text-pending-muted d-block">
                                          {candidate.email}
                                        </small>
                                      </div>
                                    }
                                  />
                                  {/* Check the deadline and compare it with today date,
                              // then check the candidate status to exclude the complete
                              // candidates */}
                                  {candidate.show_extend && (
                                    <>
                                      <Button
                                        color="primary"
                                        className="btn-sm ml-2-reversed  "
                                        onClick={() => openDeadlineModal(candidate)}
                                        disabled={
                                          !getIsAllowedPermissionV2({
                                            permissions,
                                            permissionId:
                                              ManageAssessmentsPermissions
                                                .ExtendDeadline.key,
                                          })
                                        }
                                      >
                                        {t(`${translationPath}extend-deadline`)}
                                      </Button>
                                    </>
                                  )}
                                  {/* {!candidate.show_extend && ( */}

                                  {/* )} */}
                                </Col>
                                <Col md={12} className="px-4">
                                  <Badge
                                    className="badge-dot mr-2-reversed ml-1-reversed"
                                    color=""
                                  >
                                    <i
                                      className={
                                        InviteStatusesObject[candidate.status]?.color
                                      }
                                    />
                                    <span className="status">
                                      {InviteStatusesObject[candidate.status]?.label}
                                    </span>
                                  </Badge>
                                  {candidate.show_extend && (
                                    <>
                                      <Badge
                                        className="ml-auto-reversed"
                                        color="danger"
                                        pill
                                      >
                                        {t(`${translationPath}expired`)}
                                      </Badge>
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          ))}

                        <div className="d-flex mt-3">
                          <Button
                            disabled={
                              selectedCandidates && selectedCandidates.length === 0
                            }
                            onClick={sendReminder}
                            color="primary"
                            className="btn-sm ml-auto-reversed px-2"
                          >
                            {isWorking && (
                              <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                            )}
                            {`${
                              isWorking
                                ? t(`${translationPath}sending`)
                                : t(`${translationPath}send-reminder`)
                            }`}
                          </Button>
                          <Tooltip
                            title={t(
                              `${translationPath}delete-pending-assessments-only`,
                            )}
                          >
                            <span>
                              <Button
                                disabled={
                                  (deletedArr && deletedArr.length === 0)
                                  || isDeleting
                                }
                                color="primary"
                                onClick={handleDeleteStatus}
                                className="btn-sm ml-2-reversed px-4"
                              >
                                {isDeleting && (
                                  <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                                )}
                                {`${
                                  isDeleting
                                    ? t(`${translationPath}deleting`)
                                    : t(`${translationPath}delete`)
                                }`}
                              </Button>
                            </span>
                          </Tooltip>
                        </div>
                        <Row className="justify-content-center">
                          <Col xl={12} className="my-4 px-2">
                            <ReactPaginate
                              previousLabel={t(`${translationPath}prev`)}
                              nextLabel={t(`${translationPath}next`)}
                              breakLabel="..."
                              breakClassName="break-me"
                              pageCount={Math.ceil(total / limit)}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageClick}
                              containerClassName="pagination justify-content-center mx-3"
                              subContainerClassName="pages pagination justify-content-center mx-3"
                              pageClassName="page-item"
                              pageLinkClassName="page-link"
                              activeLinkClassName="active page-link"
                              previousClassName="page-item"
                              nextClassName="page-item"
                              previousLinkClassName="page-link"
                              nextLinkClassName="page-link"
                              disabledClassName="disabled page-item"
                              activeClassName="active"
                              forcePage={page}
                            />
                          </Col>
                        </Row>
                        {assessmentUUID
                          && showExtendCard
                          && expiredCandidate
                          && isFetching && <ThreeDots />}
                        {showExtendCard && expiredCandidate && !isFetching && (
                          <ExtendCard className="border-top p-2 mt-3 py-3">
                            <DatePickerComponent
                              idRef="date"
                              isFullWidth
                              inputPlaceholder="YYYY-MM-DD"
                              value={extendedDeadline || ''}
                              onChange={(date) => {
                                setExtendedDeadline(date.value);
                              }}
                              displayFormat={GlobalSavingDateFormat}
                              datePickerWrapperClasses="px-0"
                            />

                            <span>
                              {t(`${translationPath}extend-deadline-for`)}
                              {` ${expiredCandidate.first_name} ${expiredCandidate.last_name}`}
                            </span>
                            <div>
                              <Button
                                color="danger"
                                className="btn-sm"
                                onClick={() => setShowExtendCard(false)}
                              >
                                {t(`${translationPath}cancel`)}
                              </Button>
                              <Button
                                disabled={!extendedDeadline}
                                color="primary"
                                className="btn-sm"
                                onClick={doExtendDeadline}
                              >
                                {t(`${translationPath}submit`)}
                              </Button>
                            </div>
                          </ExtendCard>
                        )}
                      </>
                    )}
                  </ModalBody>
                </TabPane>
              </TabContent>
            </>
          }
        </div>
      </Modal>
    </>
  );
};

export default InviteStatus;

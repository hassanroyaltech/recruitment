// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';

// Loader
import { BoardsLoader } from 'shared/Loaders';

// API URLs and functions and components
import ReactPaginate from 'react-paginate';
import { evarecAPI } from 'api/evarec';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ButtonBase } from '@mui/material';
import UploadResume from './UploadResume';
import UploadDocument from './UploadDocument';
import MatchUpload from './MatchUpload';
import { MatchEvaRec } from './MatchEvaRec';
import UploadingDialog from '../UploadingDialog';
import ShareProfileModal from '../../../components/Elevatus/ShareProfileModal';

import ResumeCard from './ResumeCard';
import { useTitle } from '../../../hooks';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription, PagesFilterInitValue,
  showError
} from '../../../helpers';
import {
  // FilterDialogCallLocationsEnum,
  SubscriptionServicesEnum,
} from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { RMSPermissions } from '../../../permissions';
// import { FilterModal } from '../../../components';
import i18next from 'i18next';
import { CustomCandidatesFilterTagsEnum } from 'enums/Pages/CandidateFilterTags.Enum';
import {
  GetAllEvaRecPipelineTeams,
  GetAllRmsResumes,
  GetRMSConfig,
} from '../../../services';
import { RmsFilterDialog } from './dialogs/RmsFilter.Dialog';
import AddToPipeline from './AddToPipeline';
import { toast } from 'react-toastify';
import useVitally from '../../../hooks/useVitally.Hook';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

/**
 * Returns the ResumeList component
 * @returns {JSX.Element}
 * @constructor
 */
const ResumeList = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}resume-matching-system`));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const [rmsConfig, setRmsConfig] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  /**
   * Various states and constants
   */
  // General controls
  const [dialog, setDialog] = useState(null);
  const [loading, isLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Recent uploads
  const [hasRecentUploads, setHasRecentUploads] = useState(false);

  const [resumes, setResumes] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Selected items
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filters
  const [filter, setFilter] = useState({
    limit: 20,
    page: 1,
    filters: null,
    tags: [],
  });
  const [isFiltered, setIsFiltered] = useState(false);
  // Totals
  const [total, setTotal] = useState(0);
  // Messages
  const [totalMessage, setTotalMessage] = useState(null);
  const [remaining, setRemaining] = useState(-1);
  const [remainingMessage, setRemainingMessage] = useState(null);
  // const [uploadedMessage, setUploadMessage] = useState('');

  // Control variables
  const [firstPull, setFirstPull] = useState(true);
  const [reloadPull, setReloadPull] = useState(false);
  const [bulkSelect, setBulkSelect] = useState(false);

  const { VitallyTrack } = useVitally();
  /**
   * Resolve the color of the badge based on percentage
   *
   * @param number
   * @returns {string}
   */
  function resolveColor(number) {
    if (number >= 67) return 'error';
    if (number < 67 && number >= 34) return 'warning';

    return 'success';
  }

  /**
   * Resolves the message the displays how many resumes are remaining to
   * be processed.
   * @param _remaining
   * @returns {JSX.Element}
   */
  const resolveRemainingMessage = useCallback(
    (_remaining) => {
      if (_remaining === null)
        setRemainingMessage(
          <div
            className={classnames('candidate-badge', 'info', 'p-2')}
            style={{ fontSize: '0.85rem' }}
          >
            {t(`${translationPath}checking-queue`)}
          </div>,
        );
      else if (_remaining === 0)
        setRemainingMessage(
          <div
            className={classnames('candidate-badge', 'info', 'p-2')}
            style={{ fontSize: '0.85rem' }}
          >
            {t(`${translationPath}there-are-no-resumes-to-process`)}.
          </div>,
        );
      else
        setRemainingMessage(
          <div
            className={classnames(
              'candidate-badge',
              resolveColor(_remaining),
              'p-2',
            )}
            style={{ fontSize: '0.85rem' }}
          >
            {Math.round(_remaining)}
            {t(`${translationPath}resume(s)-are-still-processing`)}
          </div>,
        );
    },
    [t],
  );

  /**
   * Resolves the message that displays the total number of successfully parsed
   * resumes.
   * @param _total
   */
  const resolveTotalMessage = useCallback(
    (_total) => {
      setTotalMessage(
        <p className="text-muted m-0 font-14">
          {' '}
          {t(`${translationPath}displaying`)}{' '}
          <span className="font-weight-bold">{_total}</span>{' '}
          {t(`${translationPath}resumes`)}.
        </p>,
      );
    },
    [t],
  );

  /**
   * Check recent uploads
   */
  useEffect(() => {
    evarecAPI
      .getRecentUploads(1)
      .then((res) => {
        setHasRecentUploads(res.total >= 1);
      })
      .catch((errors) => {
        showError(t('Shared:failed-to-get-saved-data'), errors);
      });
  }, [t]);

  const GetAllRmsResumesHandler = useCallback(async () => {
    isLoading(true);
    const response = await GetAllRmsResumes({
      ...filter,
      filters: filter?.filters,
      job_uuid: selectedJob?.uuid,
      tags: filter?.tags,
      // company_uuid: selectedBranchReducer?.uuid && [selectedBranchReducer.uuid],
    });
    isLoading(false);
    if (response && response.status === 200) {
      setResumes(response.data.results);
      setFirstPull(false);
      setReloadPull(false);
      setTotal(response.data.paginate.total);
      resolveTotalMessage(response.data.paginate.total);
      resolveRemainingMessage(null);
    } else showError(t(`Shared:failed-to-get-saved-data`), response);
  }, [filter, selectedJob, t, resolveTotalMessage, resolveRemainingMessage]);

  const getRMSConfig = useCallback(async () => {
    setRmsConfig(null);
    const res = await GetRMSConfig();
    if (res && res.status === 200) setRmsConfig(res.data.results);
    else {
      setRmsConfig(null);
      showError(t(`Shared:failed-to-get-saved-data`), res);
    }
  }, [t]);

  /**
   * @author Yanal Kashou
   * This checks the status of the resumes, updates the list of resumes and the
   * number of remaining resumes according to an interval-based logic.
   *
   * This way, we do not reload the page, we only updates states for real-time
   * UI updates.
   *
   * Function Logic
   * --------------
   * [Step 1]
   * Pull indexed resumes
   *
   * [Step 2]
   * Check processing status
   * Record number of remaining resumes (not_complete)
   *
   * [Step 3]
   * If 1 or more are processing and the number of not_complete resumes has decreased
   * Pull the new data
   *
   * [Step 4]
   * Wait ten seconds and repeat step 2 to 4.
   */
  useEffect(() => {
    // This will turn off the dropzone after upload
    setShowForm(false);
    if (firstPull || reloadPull) {
      getRMSConfig();
      GetAllRmsResumesHandler();
    }

    // We set an interval for the next pulls
    const interval = setInterval(() => {
      // Check how many resumes are remaining in processing
      evarecAPI
        .checkResumesStatus()
        .then((response) => {
          if (response?.data?.results) {
            // At this point, there are N remaining CVs
            const notComplete = response?.data?.results?.not_complete;
            /**
             * @note
             * There is a special case where the resumes are processed instantly and
             * the next status check does not modify the number of 'notComplete' resumes
             * This happens because the processing ends between 2 status checks
             * that yielded no remaining CVs.
             *
             * This is not handled yet, due to rarity of the case, the complexity of
             * determining the state and the fact that the user will refresh the page
             * after they see no results.
             */
            // If there are any resumes flagged as not_complete
            if (notComplete > 0 && notComplete < remaining)
              // and the current remaining resumes are less than previous check
              // Get the new resume
              GetAllRmsResumesHandler();

            // Reload the number of remaining CVs into the state
            setRemaining(notComplete);

            // Resolve the new total message
            resolveTotalMessage(total);

            // Resolve the new remaining message
            resolveRemainingMessage(notComplete);
          }
        })
        .catch((error) => {
          showError('', error);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, [
    t,
    selectedJob,
    filter,
    total,
    remaining,
    reloadPull,
    firstPull,
    resolveTotalMessage,
    resolveRemainingMessage,
    GetAllRmsResumesHandler,
    getRMSConfig,
  ]);

  /**
   * Matching via Upload
   *
   * Currently waits 10 seconds (10000 ms) before showing the data
   *
   * @param files
   */
  const onMatchUpload = (files) => {
    // if (files.immediately) {
    isLoading(false);
    setIsFiltered(true);
    // setUploadMessage('');
    setFilter((items) => ({
      ...items,
      match: files,
      limit: 20,
      page: 1,
    }));

    setSelectedJob({
      label: files.title,
      uuid: files.reference_uuid,
    });
    // setDialog(null);
  };

  /**
   * This shows dialog to match with an uploaded document
   */
  const showMatchUploadDialog = () => {
    setDialog(
      <MatchUpload
        isOpen
        onClose={closeDialog}
        onUpload={(files) => {
          onMatchUpload(files);
          closeDialog();
          setReloadPull(true);
        }}
      />,
    );
  };

  /**
   * This shows the dialog to upload a document
   */
  const showUploadDocumentDialog = () => {
    setDialog(
      <UploadDocument
        isOpen
        setHasRecentUploads={setHasRecentUploads}
        onClose={closeDialog}
        onUpload={() => {
          // onMatchUpload(files);
          // setDialog(null);
        }}
      />,
    );
  };

  /**
   * This shows the share dialog
   */
  const showShareDialog = async () => {
    const response = await GetAllEvaRecPipelineTeams({});
    if (response && response.status === 200) {
      if (selectedTaskIds?.length)
        setDialog(
          <ShareProfileModal
            isOpen
            onClose={() => closeDialog()}
            uuid={selectedTaskIds?.map((item) => item.uuid) || []}
            users={response?.data?.results}
          />,
        );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  /**
   * This shows the matching with EVA-REC dialog
   */
  const showMatchEvaRecDialog = () => {
    evarecAPI.searchJob(0).then((response) => {
      setDialog(
        <MatchEvaRec
          isOpen
          onClose={closeDialog}
          selectedJob={selectedJob}
          onApply={(localSelectedJob) => {
            setSelectedJob(localSelectedJob);
            setIsFiltered(true);
            // This shuts down the modal after clicking apply
            setDialog(false);
            setFilter((items) => ({
              ...items,
              job: localSelectedJob,
              limit: 20,
              page: 1,
            }));
            // Reload by triggering the hook
            setReloadPull(true);
            window?.ChurnZero?.push([
              'trackEvent',
              'RMS - Match with EVA-REC',
              'Match with EVA-REC (RMS)',
              1,
              {},
            ]);
          }}
          jobs={response?.data?.results}
        />,
      );
    });
  };

  /**
   * This shows the dialog to add a new resume
   */
  const showAddNewResumeDialog = () => {
    // This sets the filtered state to 'true'
    if (!rmsConfig || rmsConfig?.remaining === 0) {
      showError(t(`please-contact-your-account-manager`), undefined, {
        type: toast.TYPE.WARNING,
      });
      return;
    }
    setIsFiltered(false);
    setShowForm(true);

    // setFilters([]);
  };

  /**
   * This shows the filter dialog
   */
  const showFilterDialog = () => {
    setShowFilterModal(true);
  };

  const addToPipeline = () => {
    setDialog(
      <AddToPipeline
        isOpen
        isMultiple
        onClose={closeDialog}
        // email={props.email}
        // uuid={props.uuid}
        source="rms"
        items={selectedTaskIds}
        // candidate_uuid={props.user_uuid}
      />,
    );
  };
  /**
   * This closes dialogs
   */
  const closeDialog = () => setDialog(null);

  /**
   * This section was resetting the taskIds and actually double-setting
   * them to the same value.
   * Also the logic was very obscure and it was overly complicated and not doing anything useful.
   * I fixed it by appending and removing items from the selectedTaskIds array as expected
   * and then updating the state so we don't end up mutating it, but instead, resetting it to the
   * value needed.
   */
  /** <-- Toggle behavior for checkbox on resume cards --> */
  const toggleSelection = ({ uuid, email, candidate_uuid, name }) => {
    // A boolean that checks if the taskId of the checkbox
    // already exists within the array selectedTaskIds
    const wasSelected = selectedTaskIds.find((item) => item.uuid === uuid);

    // If a checkbox is selected (was not before)
    // we append to the array
    if (!wasSelected)
      // Update the array
      // selectedTaskIds.push(taskId);
      // Update the state with the new array;
      setSelectedTaskIds((items) => [
        ...items,
        { uuid, email, candidate_uuid, name },
      ]);
    // If the checkbox is not selected and there are 1 or more items in the list
    // we get the index of the item and delete it.
    else if (selectedTaskIds.length >= 1)
      // Splice the array
      // selectedTaskIds.splice(selectedTaskIds.indexOf(taskId), 1);
      // Set the new state to the spliced array
      setSelectedTaskIds((items) => items.filter((item) => item.uuid !== uuid));
  };

  /**
   * Handle clicking another page (in the pagination)
   *
   * This will set the 'page' key equal to the current page and the api will use
   * it to retrieve more resumes.
   * @param e
   */
  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setFilter((items) => ({ ...items, page: currentPage + 1 }));
    window.scrollTo(0, 0);
    setReloadPull(true);
  };

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

  /**
   * @description Render the Component
   * @returns {JSX.Element}
   */
  return (
    <>
      {uploading && (
        <UploadingDialog
          isOpen={uploading}
          onClose={() => setUploading(false)}
          seconds={100}
        />
      )}

      {/* <-- *** FILTER MODAL *** --> */}
      {showFilterModal && (
        <RmsFilterDialog
          filterEditValue={filter?.filters}
          isOpen={showFilterModal}
          isOpenChanged={() => setShowFilterModal(false)}
          onApply={(filterModalstate) => {
            setFilter((items) => ({
              ...items,
              filters: filterModalstate,
              limit: 20,
              page: 1,
            }));
            VitallyTrack('EVA-REC - Search on Candidate');
            window?.ChurnZero?.push([
              'trackEvent',
              'EVA-REC - Search on Candidate',
              'Search on Candidate',
              1,
              {},
            ]);
            // This turns off the filter modal
            setShowFilterModal(false);

            // This sets the filtered state to 'true'
            setIsFiltered(true);

            // Reload by triggering the hook
            setReloadPull(true);
          }}
        />
      )}
      {/*{showFilterModal && (*/}
      {/*  <FilterModal*/}
      {/*    filterEditValue={filter?.filters}*/}
      {/*    filterEditValueTags={filter?.tags}*/}
      {/*    isOpen={showFilterModal}*/}
      {/*    callLocation={FilterDialogCallLocationsEnum.RMS.key}*/}
      {/*    onClose={() => {*/}
      {/*      setShowFilterModal(false);*/}
      {/*    }}*/}
      {/*    onApply={(localFilterType, localFilters, tags, filterModalstate) => {*/}
      {/*      // These are the filters themselves*/}
      {/*      setFilter((items) => ({*/}
      {/*        ...items,*/}
      {/*        filters: filterModalstate,*/}
      {/*        limit: 20,*/}
      {/*        page: 0,*/}
      {/*        tags,*/}
      {/*      }));*/}

      {/*      // This turns off the filter modal*/}
      {/*      setShowFilterModal(false);*/}

      {/*      // This sets the filtered state to 'true'*/}
      {/*      setIsFiltered(true);*/}

      {/*      // Reload by triggering the hook*/}
      {/*      setReloadPull(true);*/}
      {/*    }}*/}
      {/*    hideSourceFilter*/}
      {/*    hideReferenceAndApplicant*/}
      {/*    hideAssigneeFilters*/}
      {/*    showRmsFilters*/}
      {/*  />*/}
      {/*)}*/}

      {/* <-- *** MAIN BODY *** --> */}

      <div className="content-page bg-white">
        <div className="content">
          <Container
            fluid
            className="m-4 px-3 w-auto"
            style={{ minHeight: 'calc(100vh - 80px)' }}
          >
            <div className="d-flex flex-wrap justify-content-between py-3 tabs-with-actions nav-tabs">
              <div className="h6 text-primary px-2">
                {t(`${translationPath}resume-matching-system`)}
                {totalMessage}
                <div>{remainingMessage}</div>
              </div>

              <Nav className="d-inline-flex align-items-center px-2">
                <NavItem>
                  <NavLink
                    color="link"
                    className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                    disabled={loading}
                    onClick={() => {
                      setBulkSelect((val) => !val);
                      // setSelectedTaskIds([]);
                    }}
                  >
                    {t(`${translationPath}bulk-select`)}
                  </NavLink>
                </NavItem>
                <NavItem onMouseEnter={onPopperOpen}>
                  <NavLink
                    color="link"
                    className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                    disabled={
                      (selectedTaskIds?.length || 0) === 0
                      || showForm
                      || !getIsAllowedPermissionV2({
                        permissionId: RMSPermissions.ShareCandidateCv.key,
                        permissions: permissionsReducer,
                      })
                    }
                    onClick={showShareDialog}
                  >
                    <i className="fas fa-link" /> {t(`${translationPath}share`)}
                  </NavLink>
                </NavItem>
                <NavItem className="float-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color=""
                      disabled={showForm}
                      className="nav-link nav-link-shadow text-gray font-weight-normal"
                    >
                      {t(`${translationPath}match`)}
                      <i className="fas fa-angle-down pl-2" />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissionId: RMSPermissions.MatchWithEvaRec.key,
                            permissions: permissionsReducer,
                          })
                        }
                        onClick={showMatchEvaRecDialog}
                        color="link"
                        className="btn-sm justify-self-end text-dark"
                      >
                        {t(`${translationPath}match-with-eva-rec`)}
                      </DropdownItem>
                      <DropdownItem
                        disabled={
                          !hasRecentUploads
                          || !getIsAllowedPermissionV2({
                            permissionId: RMSPermissions.MatchWithDocument.key,
                            permissions: permissionsReducer,
                          })
                        }
                        onClick={showMatchUploadDialog}
                        color="link"
                        className="btn-sm justify-self-end text-dark"
                      >
                        {t(`${translationPath}match-with-document`)}
                      </DropdownItem>
                      <hr className="m-1" />
                      <DropdownItem
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissionId: RMSPermissions.UploadADocument.key,
                            permissions: permissionsReducer,
                          })
                        }
                        onClick={showUploadDocumentDialog}
                        color="link"
                        className="btn-sm justify-self-end text-dark"
                      >
                        {t(`${translationPath}upload-a-new-document`)}
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </NavItem>
                {showForm ? (
                  <NavItem>
                    <NavLink
                      color="primary"
                      className="btn btn-primary text-white nav-primary nav-link-shadow font-weight-normal"
                      onClick={() => {
                        setShowForm(!showForm);
                        setReloadPull(true);
                      }}
                    >
                      {t(`${translationPath}back-to-list`)}
                    </NavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <NavLink
                      color="primary"
                      className="btn btn-primary text-white nav-primary nav-link-shadow font-weight-normal"
                      disabled={
                        !getIsAllowedPermissionV2({
                          permissionId: RMSPermissions.AddNewResumes.key,
                          permissions: permissionsReducer,
                        }) || !rmsConfig
                      }
                      onClick={showAddNewResumeDialog}
                    >
                      {t(`${translationPath}add-new-resumes`)}
                    </NavLink>
                  </NavItem>
                )}

                <NavItem>
                  <NavLink
                    color="link"
                    className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                    onClick={showFilterDialog}
                    disabled={
                      showForm
                      || !getIsAllowedPermissionV2({
                        permissionId: RMSPermissions.FilterCandidates.key,
                        permissions: permissionsReducer,
                        showForm,
                      })
                    }
                  >
                    <i className="fas fa-sliders-h" />
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            {/* <-- *** SELECTED CHIPS *** --> */}

            <ButtonBase
              className="btns btns-transparent mx-0"
              onClick={() => {
                setFilter((items) => ({
                  ...items,
                  page: 1,
                  filters: { ...PagesFilterInitValue },
                  tags: [],
                }));
                setReloadPull(true);
              }}
            >
              <span>{t(`${translationPath}reset-filters`)}</span>
            </ButtonBase>

            {[
              'job_type',
              'degree_type',
              'career_level',
              'country',
              'industry',
              'language',
              'major',
              'nationality',
              'assigned_user_uuid',
              'assigned_employee_uuid',
            ].map((chip) =>
              filter.filters?.[chip]?.map((subItem, i) => (
                <ButtonBase
                  key={`${subItem}Key${i + 1}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        [chip]: items.filters?.[chip]?.filter(
                          (item) => item.uuid !== subItem.uuid,
                        ),
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>
                    {chip === 'assigned_employee_uuid'
                      && `${
                        subItem?.first_name
                        && (subItem?.first_name[i18next.language]
                          || subItem?.first_name.en)
                      }${
                        subItem?.last_name
                        && ` ${
                          subItem?.last_name[i18next.language]
                          || subItem?.last_name.en
                        }`
                      }`}
                    {chip === 'assigned_user_uuid'
                      && `${
                        subItem?.first_name
                        && (subItem?.first_name[i18next.language]
                          || subItem?.first_name.en)
                      }${
                        subItem?.last_name
                        && ` ${
                          subItem?.last_name[i18next.language]
                          || subItem?.last_name.en
                        }`
                      }`}
                    {chip !== 'assigned_employee_uuid'
                      && chip !== 'assigned_user_uuid'
                      && (subItem?.name?.[i18next.language] || subItem?.name?.en)}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )),
            )}

            {filter.filters?.gender
            && Object.keys(filter.filters?.gender)?.length ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        gender: '',
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>
                    {filter.filters?.gender.name?.[i18next.language]
                    || filter.filters?.gender.name?.en}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}

            {filter.filters?.source_type
            && Object.keys(filter.filters?.source_type)?.length ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        source_type: null,
                        source: null,
                      },
                    }));
                  }}
                >
                  <span>
                    {filter.filters?.source_type.value
                    || filter.filters?.source_type.value}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}

            {filter.filters?.source
            && Object.keys(filter.filters?.source)?.length ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        source: null,
                      },
                    }));
                  }}
                >
                  <span>
                    {`${
                      (filter.filters?.source.first_name
                      && ((typeof filter.filters?.source.first_name === 'string'
                        && filter.filters?.source.first_name)
                        || (typeof filter.filters?.source.first_name !== 'string'
                          && (filter.filters?.source.first_name[i18next.language]
                            || filter.filters?.source.first_name.en))))
                    || ''
                    }${
                      (filter.filters?.source.last_name
                      && ((typeof filter.filters?.source.last_name === 'string'
                        && ` ${filter.filters?.source.last_name}`)
                        || (typeof filter.filters?.source.last_name !== 'string'
                          && ` ${
                            filter.filters?.source.last_name[i18next.language]
                            || filter.filters?.source.last_name.en
                          }`)))
                    || ''
                    }` || 'N/A'}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}

            {['skills', 'job_position', 'query'].map((chip) =>
              filter.filters?.[chip]?.map((subItem, i) => (
                <ButtonBase
                  key={`${subItem}Key${i + 1}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        [chip]: items.filters?.[chip]?.filter(
                          (item) => item !== subItem,
                        ),
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>{subItem}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )),
            )}
            {/* ['right_to_work', 'willing_to_travel', 'willing_to_relocate', 'owns_a_car', 'is_completed_profiles', 'un_completed_profile'] */}
            {filter.filters?.checkboxFilters
            && Object.keys(filter.filters?.checkboxFilters)?.length
              ? Object.keys(filter.filters?.checkboxFilters)
                ?.filter((item) => filter?.filters?.checkboxFilters?.[item])
                .map((chip, i) => (
                  <ButtonBase
                    key={`${chip}Key${i + 1}`}
                    className="btns theme-transparent"
                    onClick={() => {
                      setFilter((items) => {
                        const copyPrevFilter = {
                          ...items?.filters?.checkboxFilters,
                        };
                        delete copyPrevFilter?.[chip];
                        return {
                          ...items,
                          page: 1,
                          filters: {
                            ...items.filters,
                            checkboxFilters: copyPrevFilter,
                          },
                        };
                      });
                      setReloadPull(true);
                    }}
                  >
                    <span>
                      {t(`${translationPath}${chip.replaceAll('_', '-')}`)}
                    </span>
                    <span className="fas fa-times px-2" />
                  </ButtonBase>
                ))
              : null}

            {/* Tags */}
            {filter?.tags
              ?.filter((item) => item?.key)
              .map((item, i) => (
                <ButtonBase
                  key={`${item}Key${i + 1}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      tags: items.tags?.filter((tag) => tag?.key !== item?.key),
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>
                    {item?.value
                      ?.map((val) => {
                        if (item.key === CustomCandidatesFilterTagsEnum.user.key)
                          return `${
                            val.first_name
                            && (val.first_name[i18next.language] || val.first_name.en)
                          }${
                            val.last_name
                            && ` ${val.last_name[i18next.language] || val.last_name.en}`
                          }`;
                        else if (
                          item.key === CustomCandidatesFilterTagsEnum.employee.key
                        )
                          return `${
                            val.first_name
                            && (val.first_name[i18next.language] || val.first_name.en)
                          }${
                            val.last_name
                            && ` ${val.last_name[i18next.language] || val.last_name.en}`
                          }${
                            (!val.has_access
                              && ` ${t('Shared:dont-have-permissions')}`)
                            || ''
                          }`;
                        return val?.name?.[i18next.language] || val?.name?.en;
                      })
                      .join(', ')}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ))}

            {/* RMS filters */}
            {filter?.filters?.rms_filters
              && filter?.filters?.rms_filters?.length > 0
              && filter.filters.rms_filters.map((item, idx) => (
                <ButtonBase
                  key={`${item.key?.slug}-${idx}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        rms_filters: items.filters?.rms_filters?.filter(
                          (fil) =>
                            !(
                              fil?.key?.slug === item?.key?.slug
                              && fil?.value === item?.value
                            ),
                        ),
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>
                    {`${item.key?.title}: ${
                      ['company_uuid'].includes(item.key?.slug)
                        ? (item?.value || [])
                          .map(
                            (elms) => elms.name[i18next.language] || elms.name.en,
                          )
                          .join(', ')
                        : item.value
                    }`}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ))}
            {bulkSelect ? (
              <div className="d-flex-v-center-h-end">
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setSelectedTaskIds([]);
                  }}
                  disabled={selectedTaskIds.length === 0 || loading}
                >
                  <span>
                    {`${t(`${translationPath}selected`)} (${
                      selectedTaskIds.length
                    }) `}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
                <Nav className="d-inline-flex align-items-center p-relative px-2">
                  <NavItem>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        color=""
                        disabled={selectedTaskIds.length === 0 || loading}
                        className="nav-link nav-link-shadow text-gray font-weight-normal"
                      >
                        {t(`${translationPath}actions`)}
                        <i className="fas fa-angle-down pl-2" />
                      </DropdownToggle>
                      <DropdownMenu
                        {...(i18next.dir() === 'rtl'
                          ? { start: true }
                          : { end: true })}
                      >
                        <DropdownItem
                          disabled={
                            loading
                            || !getIsAllowedPermissionV2({
                              permissionId:
                                RMSPermissions.AddCandidateToPipeline.key,
                              permissions: permissionsReducer,
                            })
                          }
                          onClick={addToPipeline}
                          color="link"
                          className="btn-sm justify-self-end text-dark"
                        >
                          {t(`${translationPath}add-to-pipeline`)}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </NavItem>
                </Nav>
              </div>
            ) : null}
            {/* <-- *** LIST OF RESUME CARDS *** --> */}
            <div className="d-flex-h-center flex-wrap pt-3">
              {loading ? (
                <BoardsLoader />
              ) : isFiltered || (resumes && resumes?.length && !showForm) ? (
                resumes
                && resumes?.map((resume, index) => (
                  <ResumeCard
                    withCheckbox
                    key={`resumesCardKey${index + 1}`}
                    toggleSelection={({ uuid, email, candidate_uuid, name }) =>
                      toggleSelection({ uuid, email, candidate_uuid, name })
                    }
                    index={index}
                    uuid={resume.uuid}
                    url={resume.url}
                    profile_pic={resume.basic_information?.profile_pic} // not returned anymore
                    title={resume.basic_information?.personal_name}
                    email={resume.email} // changed to array but I'll use the first one anyway
                    score={resume.similarity}
                    // isSelected={resume.isSelected}
                    isSelected={selectedTaskIds.some(
                      (item) => item.uuid === resume.uuid,
                    )}
                    isCompleted={resume.is_complete}
                    skills={resume.skills}
                    experiences={resume.experience?.[0]} // changed to array and flag name from work => experience
                    education={resume.education?.[0]}
                    onDeleteResume={() => setReloadPull(true)}
                    candidate_uuid={resume.user_uuid} // candidate_uuid not returned anymore but we're getting user_uuid
                    // reference_number={resume?.reference_number} // not returned and not relevant anymore
                    user_uuid={resume.user_uuid}
                    resumeData={resume}
                    matched_job={selectedJob?.uuid}
                  />
                ))
              ) : (
                <UploadResume
                  onClick={() => {
                    setFilter({
                      limit: 20,
                      page: 1,
                      filters: null,
                      tags: [],
                    });
                    setShowForm(false);
                    setReloadPull(true);
                  }}
                  rmsConfig={rmsConfig}
                />
              )}
            </div>
            {/* // ) : isFiltered && resumes && resumes.length === 0 ? ( */}
            {/* //   <div className="h6 text-primary ml-3">No Resumes Found</div> */}
            {/* // ) : ( */}
            {/* //   <UploadResume */}
            {/* //     onClick={() => { */}
            {/* //       setShowForm(!showForm); */}
            {/* //       setReloadPull(true); */}
            {/* //     }} */}
            {/* //   /> */}

            {/* <-- *** PAGINATION *** --> */}
            {resumes && resumes?.length > 0 && !showForm && (
              <ReactPaginate
                previousLabel={t(`${translationPath}previous-page`)}
                nextLabel={t(`${translationPath}next-page`)}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={Math.ceil(total / filter.limit)}
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
              />
            )}
          </Container>
        </div>
      </div>
      {dialog}
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

export default ResumeList;

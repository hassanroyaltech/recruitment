/**
 * ----------------------------------------------------------------------------------
 * @title SearchDatabase.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the SearchDatabase component where users can search their
 * entire database of candidates, match them with applications (jobs) posted on
 * the EVA-REC system and filter through them as in the RMS.
 * ----------------------------------------------------------------------------------
 */
import React, { useCallback, useEffect, useState } from 'react';
import { evarecAPI } from 'api/evarec';
import { commonAPI } from '../../../api/common';
import ReactPaginate from 'react-paginate';
import { BoardsLoader } from '../../../shared/Loaders';
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
import ShareProfileModal from '../../../components/Elevatus/ShareProfileModal';
import Tooltip from '@mui/material/Tooltip';
// Toast notifications
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ButtonBase } from '@mui/material';
import ShareCard from './ShareCard';
import { MatchEvaRec } from '../rms/MatchEvaRec';
import Compare from './Compare';
import { useTitle } from '../../../hooks';
import {
  getAllApproveApplicantsHandler,
  getIsAllowedPermissionV2,
  getIsAllowedSubscription, PagesFilterInitValue,
  showError
} from '../../../helpers';
import {
  DynamicFormTypesEnum,
  FilterDialogCallLocationsEnum,
  PipelineQuickFilterLocationsEnum,
  ProfileManagementFeaturesEnum,
  SubscriptionServicesEnum,
} from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { SearchDatabasePermissions } from '../../../permissions';
import { FilterModal } from '../../../components';
import { AssignUserManagementDialog, CandidateManagementDialog } from '../shared';
import {
  GetAllSetupsBranches,
  GetAllProviderBranches,
  GetAllEvaRecPipelineTeams,
  GetAllIntegrationsConnections,
} from '../../../services';
import i18next from 'i18next';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import { CustomCandidatesFilterTagsEnum } from 'enums/Pages/CandidateFilterTags.Enum';
import AddToPipeline from '../rms/AddToPipeline';
import useVitally from '../../../hooks/useVitally.Hook';
import QuickFiltersComponent from '../../../components/QuickFilters/QuickFilters.Component';

const translationPath = '';
const parentTranslationPath = 'EvarecRecSearch';
const sortOptions = {
  ASC: {
    key: 'ASC',
    title: 'oldest',
  },
  DESC: {
    key: 'DESC',
    title: 'newest',
  },
  height_asc: {
    key: 'height_asc',
    title: 'height-asc',
  },
  height_desc: {
    key: 'height_desc',
    title: 'height-desc',
  },
  weight_asc: {
    key: 'weight_asc',
    title: 'weight-asc',
  },
  weight_desc: {
    key: 'weight_desc',
    title: 'weight-desc',
  },
};
/**
 * Search Database page
 * @returns {JSX.Element}
 * @constructor
 */
const SearchDatabase = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}search-database`));
  const [applicants, setApplicants] = useState([]);
  const [isOpenCandidateManagementDialog, setIsOpenCandidateManagementDialog]
    = useState(false);
  const [dialog, setDialog] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [reloadPull, setReloadPull] = useState(false);
  const [isOpenAssignUserManagementDialog, setIsOpenAssignUserManagementDialog]
    = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const { VitallyTrack } = useVitally();
  const [filter, setFilter] = useState({
    limit: 12,
    page: 1,
    filters: { candidate_property: [] },
    tags: [],
  });
  const [total, setTotal] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [firstPull, setFirstPull] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [bulkSelect, setBulkSelect] = useState(false);
  const [connections, setConnections] = useState({
    results: [],
    totalCount: 0,
  });
  const [filters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((state) => state?.userReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);

  /**
   * Effect to get Timezones for schedule interview
   */
  useEffect(() => {
    commonAPI
      .getTimeZones()
      .then((res) => {
        setTimezones(res.data.results);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t]);

  /**
   * Function to handle selected checked box for card uuid.
   * @param {*} applicant
   */
  const toggleSelection = (applicant) => {
    setSelectedTaskIds((items) => {
      const taskIndex = items.findIndex(
        (item) => item === applicant.candidate_company?.[0]?.user_uuid,
      );
      if (taskIndex !== -1) items.splice(taskIndex, 1);
      else items.push(applicant.candidate_company?.[0]?.user_uuid);

      return [...items];
    });
    setSelectedApplicants((items) => {
      const taskIndex = items.findIndex((item) => item.uuid === applicant.uuid);
      if (taskIndex !== -1) items.splice(taskIndex, 1);
      else items.push(applicant);
      return [...items];
    });
  };

  /**
   * Function to handle selected checked box for card uuid.
   * @param {*} uuid
   */
  const toggleProfileSelection = (uuid) => {
    if (!uuid) return;
    setSelectedProfileIds((items) => {
      const taskIndex = items.findIndex((item) => item === uuid);
      if (taskIndex !== -1) items.splice(taskIndex, 1);
      else items.push(uuid);

      return [...items];
    });
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

  const UpdateCandidateList = useCallback(
    (response) => {
      if (response && response.status === 200) {
        setReloadPull(false);
        setFirstPull(false);
        setApplicants(response.data.results);
        setTotal(response.data.paginate.total);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );
  useEffect(() => {
    window?.ChurnZero?.push([
      'trackEvent',
      'Open search database',
      'Open search database from EVA REC',
      1,
      {},
    ]);
  }, []);
  // this to get the data on filter change & init
  useEffect(() => {
    if (firstPull || reloadPull)
      getAllApproveApplicantsHandler({
        filter: {
          ...filter,
          is_include: true,
          filters: {
            ...filter.filters,
          },
          filter: {
            ...filter,
            job: selectedJob,
          },
        },
        setIsLoading,
        isLoadingRef: null,
        afterCallHandler: UpdateCandidateList,
      });
  }, [UpdateCandidateList, selectedJob, filter, firstPull, reloadPull, t]);

  const candidateManagementOpenChangeHandler = useCallback(() => {
    setIsOpenCandidateManagementDialog(false);
  }, []);

  const onSaveCandidateHandler = useCallback(() => {
    setIsOpenCandidateManagementDialog(false);
    setReloadPull((items) => !items);
  }, []);

  const assignUserManagementOpenChangeHandler = useCallback(() => {
    setIsOpenAssignUserManagementDialog(false);
  }, []);

  const onSaveAssignUserHandler = useCallback(() => {
    setReloadPull((items) => !items);
  }, []);

  /**
   * This closes dialogs
   */
  const closeDialog = () => {
    setDialog(null);
    setSelectedProfileIds([]);
    setSelectedTaskIds([]);
  };

  /**
   * This shows the matching with EVA-REC dialog
   *
   * @note THIS IS NOT YET IMPLEMENTED
   */
  const showMatchEvaRecDialog = () => {
    evarecAPI
      .searchJob(0)
      .then((response) => {
        setDialog(
          <MatchEvaRec
            isOpen
            mode="search-database"
            onClose={closeDialog}
            selectedJob={selectedJob}
            onApply={(job) => {
              setSelectedJob(job);
              // This shuts down the modal after clicking apply
              setDialog(false);
              // Reload by triggering the hook
              setReloadPull(true);
              window?.ChurnZero?.push([
                'trackEvent',
                'Search DB - Match with EVA-REC',
                'Match with EVA-REC (search DB)',
                1,
                {},
              ]);
            }}
            jobs={response.data.results}
          />,
        );
      })
      .catch((error) => showError(t('Shared:failed-to-get-saved-data'), error));
  };

  /**
   * This shows the compare profiles modal
   */
  const showCompareDialog = () => {
    setDialog(
      <Compare
        isOpen
        mode="search-database"
        onClose={closeDialog}
        uuid={selectedProfileIds}
      />,
    );
  };

  const addToPipeline = () => {
    const company_uuid = selectedBranchReducer.uuid;
    const items = selectedApplicants?.map((item) => {
      const profileByCompany
        = (item?.user_detail?.length > 0
          && item?.user_detail.find(
            (profile) =>
              profile?.company?.uuid === company_uuid
              && profile.is_completed_profile,
          ))
        || item?.user_detail[0];
      return {
        uuid: item?.uuid,
        email: item.email,
        profile_uuid: profileByCompany.profile_uuid,

        name: item.name,
        is_completed_profile: profileByCompany.is_completed_profile,
      };
    });
    setDialog(
      <AddToPipeline
        isOpen
        onClose={() => setDialog(null)}
        isMultiple
        items={items}
        fromCandidateDatabase
        // email={props.email}
        // uuid={props.uuid}
        // candidate_uuid={props.user_uuid}
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
            uuid={selectedTaskIds}
            users={response.data.results}
            type="search"
          />,
        );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  /**
   * This shows the filter dialog
   */
  const showFilterDialog = () => {
    setShowFilterModal(true);
  };

  /**
   * Resolve subtitle so we don't have 'null at null' instead of {position} at {company}
   * @param position
   * @param company
   * @returns {string|*}
   */
  const resolveSubtitle = (position, company) => {
    if (position && !company) return position;

    if (position && company) return `${position} at ${company}`;

    if (!position && company) return `At ${company}`;
  };

  const onApplyQuickFilterHandler = useCallback(
    (filterType, filters, tags, filterModalState) => {
      setFilter((items) => ({
        ...items,
        page: 1,
        filters: filterModalState,
        tags,
      }));
      VitallyTrack('EVA-REC - Search on Candidate');
      // Reload by triggering the hook
      setReloadPull(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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

  // useEffect(() => {
  //   if (userReducer?.results?.user?.is_provider) SearchDBForProviderHandler();
  // }, [userReducer, SearchDBForProviderHandler]);
  const handleSort = useCallback((val) => {
    setFilter((items) => ({
      ...items,
      filters: { ...items.filters, sort_by: val },
    }));
    setReloadPull((items) => !items);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const getAllIntegrationsConnections = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllIntegrationsConnections(filters);
    setIsLoading(false);
    if (response && response.status === 200) {
      const { results } = response.data;
      const { paginate } = response.data;
      if (filters.page <= 1)
        setConnections({
          results: results,
          totalCount: paginate.total,
        });
      else
        setConnections((items) => ({
          results: [...items.results, ...results],
          totalCount: paginate.total || [...items.results, ...results].length,
        }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [filters, t]);

  useEffect(() => {
    void getAllIntegrationsConnections();
  }, [getAllIntegrationsConnections, filters]);

  /**
   * Render the component
   * @returns {JSX.Element}
   */

  return (
    <div className="content-page bg-white">
      {showFilterModal && (
        <FilterModal
          filterEditValueTags={filter?.tags}
          filterEditValue={filter?.filters}
          callLocation={FilterDialogCallLocationsEnum.SearchDB.key}
          isWithCheckboxes
          isOpen={showFilterModal}
          onClose={() => {
            setShowFilterModal(false);
          }}
          onApply={(filterType, filters, tags, filterModalstate) => {
            setFilter((items) => ({
              ...items,
              page: 1,
              filters: filterModalstate,
              tags,
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

            // Reload by triggering the hook
            setReloadPull(true);
          }}
          // showTags
          hideIncludeExclude
          showCandidateType={true}
          isShowHeightAndWeight={true}
          isShowDynamicProperty={true}
          isShowAssigneeFilter={true}
          isShowAge={true}
        />
      )}
      <div className="content">
        <Container
          fluid
          className="m-4 px-3 w-auto"
          style={{ minHeight: 'calc(100vh - 78px)' }}
        >
          <div className="d-flex flex-wrap justify-content-between py-3 tabs-with-actions nav-tabs">
            <div className="h6 text-primary px-2">
              {t(`${translationPath}applicant-database`)}
            </div>
            <Nav className="px-2 align-items-center">
              <NavItem>
                <NavLink
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  disabled={loading}
                  onClick={() => {
                    setBulkSelect((val) => !val);
                    // setSelectedTaskIds([]);
                    // setSelectedApplicants([]);
                  }}
                >
                  {t(`${translationPath}bulk-select`)}
                </NavLink>
              </NavItem>
              {selectedTaskIds && selectedTaskIds.length > 0 && (
                <NavItem>
                  <NavLink
                    color="link"
                    className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                    onClick={() => setIsOpenAssignUserManagementDialog(true)}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: SearchDatabasePermissions.AssignUser.key,
                        permissions,
                      })
                    }
                  >
                    <i className="fas fa-user-plus mx-1" />
                    <span>{t(`${translationPath}assignee-user`)}</span>
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => setIsOpenCandidateManagementDialog(true)}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: SearchDatabasePermissions.AddCandidates.key,
                    })
                  }
                >
                  <i className="fas fa-plus mx-1" />
                  <span>{t(`${translationPath}add-candidate`)}</span>
                </NavLink>
              </NavItem>
              {getIsAllowedPermissionV2({
                permissions,
                permissionId: SearchDatabasePermissions.CompareCandidates.key, // missing permission
              })
                && !userReducer?.results?.user?.is_provider && (
                <NavItem>
                  <NavLink
                    color="link"
                    className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                    disabled={(selectedTaskIds?.length || 0) === 0}
                    onClick={showShareDialog}
                  >
                    <i className="fas fa-link mx-1" />
                    {t(`${translationPath}share`)}
                  </NavLink>
                </NavItem>
              )}
              {getIsAllowedPermissionV2({
                permissions,
                permissionId:
                  SearchDatabasePermissions.MatchCandidateWithApplication.key,
              }) && (
                <NavItem className="float-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color=""
                      className="nav-link nav-link-shadow text-gray font-weight-normal"
                    >
                      {t(`${translationPath}match`)}
                      <i className="fas fa-angle-down pl-2" />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem
                        onClick={showMatchEvaRecDialog}
                        color="link"
                        className="btn-sm justfiy-self-end text-dark"
                      >
                        {t(`${translationPath}match-with-eva-rec`)}
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </NavItem>
              )}
              <NavItem onMouseEnter={onPopperOpen}>
                <Tooltip
                  title={t(`${translationPath}select-at-least-two-applicants`)}
                >
                  <span>
                    <NavLink
                      disabled={
                        selectedProfileIds.length < 2
                        || !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                            SearchDatabasePermissions.CompareCandidates.key,
                        })
                      }
                      color="link"
                      className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                      onClick={showCompareDialog}
                    >
                      <i className="far fa-copy mx-1" />
                      {t(`${translationPath}compare`)}
                    </NavLink>
                  </span>
                </Tooltip>
              </NavItem>
              {getIsAllowedPermissionV2({
                permissions,
                permissionId: SearchDatabasePermissions.FilterCandidates.key,
              }) && (
                <NavItem
                  color="link"
                  className="btn nav-link nav-link-shadow px-2 float-right text-gray font-weight-normal"
                  onClick={showFilterDialog}
                >
                  <i className="fas fa-sliders-h" />
                </NavItem>
              )}
            </Nav>
          </div>
          {/*<div className="separator-h" />*/}
          <QuickFiltersComponent
            moduleKey={PipelineQuickFilterLocationsEnum.SearchDatabase.key}
            filterEditValueTags={filter?.tags}
            filterEditValue={filter?.filters}
            callLocation={FilterDialogCallLocationsEnum.SearchDB.key}
            isWithCheckboxes
            isOpen={showFilterModal}
            onClose={() => {
              setShowFilterModal(false);
            }}
            onApply={onApplyQuickFilterHandler}
            // showTags
            hideIncludeExclude
            showCandidateType
            isShowHeightAndWeight
            isShowAssigneeFilter
          />
          <div className="separator-h mb-3" />
          {/*{getIsAllowedPermissionV2({*/}
          {/*  permissions,*/}
          {/*  permissionId: SearchDatabasePermissions.FilterCandidates.key,*/}
          {/*}) && (*/}
          <div className="pt-3">
            <div className="d-flex">
              <div className="d-flex-v-center-h-between">
                {userReducer.results?.user?.is_provider ? (
                  <SharedAPIAutocompleteControl
                    title="branches"
                    isQuarterWidth
                    searchKey="search"
                    stateKey="query_company"
                    placeholder="select-branches"
                    idRef="searchBranchAutocompleteRef"
                    getDataAPI={GetAllProviderBranches}
                    // editValue={filters.query_company}
                    getOptionLabel={(option) =>
                      (option.name
                        && (option.name[i18next.language]
                          || option.name.en
                          || 'N/A'))
                      || 'N/A'
                    }
                    onValueChanged={({ value }) => {
                      setFilter((items) => ({
                        ...items,
                        filters: {
                          ...items?.filters,
                          query_company: value,
                          is_include: true,
                        },
                      }));
                      // Trigger a reload
                      setReloadPull(true);
                    }}
                    type={DynamicFormTypesEnum.array.key}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    extraProps={{
                      account_uuid: accountReducer.account_uuid,
                      is_member:
                        userReducer?.results?.user?.member_type === 'member',
                    }}
                  />
                ) : (
                  <SharedAPIAutocompleteControl
                    title="branches"
                    isQuarterWidth
                    searchKey="search"
                    stateKey="query_company"
                    placeholder="select-branches"
                    idRef="searchBranchAutocompleteRef"
                    getDataAPI={GetAllSetupsBranches}
                    // editValue={filters.query_company}
                    getOptionLabel={(option) =>
                      (option.name
                        && (option.name[i18next.language]
                          || option.name.en
                          || 'N/A'))
                      || 'N/A'
                    }
                    onValueChanged={({ value }) => {
                      setFilter((items) => ({
                        ...items,
                        filters: {
                          ...items?.filters,
                          query_company: value,
                          is_include: true,
                        },
                      }));
                      // Trigger a reload
                      setReloadPull(true);
                    }}
                    type={DynamicFormTypesEnum.array.key}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    extraProps={{
                      has_access: true,
                    }}
                  />
                )}

                <Nav>
                  <NavItem>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        color=""
                        disabled={loading}
                        className="nav-link nav-link-shadow text-gray font-weight-normal mb-4"
                      >
                        {t(`${translationPath}sort`)}
                        <i className="fas fa-angle-down pl-2" />
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ width: 'fit-content', minWidth: '80px' }}
                        {...(i18next.dir() === 'rtl'
                          ? { start: true }
                          : { end: true })}
                      >
                        {Object.values(sortOptions).map((item) => (
                          <DropdownItem
                            key={item.key}
                            disabled={loading}
                            onClick={() => {
                              handleSort(item.key);
                            }}
                            color="link"
                            className="btn-sm justify-self-end text-dark"
                          >
                            {t(`${translationPath}${item.title}`)}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </NavItem>
                </Nav>
              </div>
            </div>

            {/* Filter chips */}
            <div className="px-2 mb-2">
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
                'interested_position_title',
                'academic_certificate',
                'country',
                'industry',
                'language',
                'major',
                'nationality',
                'assigned_user_uuid',
                'assigned_employee_uuid',
                'category_uuid',
              ].map((chip) =>
                filter.filters?.[chip]?.map((subItem, i) => (
                  <ButtonBase
                    key={`${subItem.uuid}Key${i + 1}`}
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
                      {chip === 'category_uuid'
                        && (subItem?.title?.[i18next.language] || subItem?.title?.en)}
                      {chip !== 'assigned_employee_uuid'
                        && chip !== 'assigned_user_uuid'
                        && chip !== 'category_uuid'
                        && (subItem?.name?.[i18next.language] || subItem?.name?.en)}
                    </span>
                    <span className="fas fa-times px-2" />
                  </ButtonBase>
                )),
              )}
              {filter?.filters?.candidate_type?.value ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      filters: {
                        ...items?.filters,
                        candidate_type: null,
                      },
                    }));
                    // Trigger a reload
                    setReloadPull(true);
                  }}
                  disabled={loading}
                >
                  <span>{filter?.filters?.candidate_type?.value || ''}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}
              {filter?.filters?.has_assignee?.value ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      filters: {
                        ...items?.filters,
                        has_assignee: null,
                      },
                    }));
                    // Trigger a reload
                    setReloadPull(true);
                  }}
                  disabled={loading}
                >
                  <span>
                    {t(`${translationPath}has-assignee`)}:{' '}
                    {filter?.filters?.has_assignee?.value || ''}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}
              {filter.filters?.sort_by ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    handleSort(null);
                  }}
                  disabled={loading}
                >
                  <span>
                    {t(
                      `${translationPath}${
                        sortOptions?.[filter.filters?.sort_by]?.title
                      }`,
                    )}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}
              {(filter.filters?.from_height || filter.filters?.to_height) && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      filters: {
                        ...items?.filters,
                        from_height: null,
                        to_height: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                  disabled={loading}
                >
                  <span>
                    {t(`${translationPath}height`)}
                    {(filter.filters?.from_height
                      || filter.filters?.from_height === 0) && (
                      <span className="mx-2">{`${t(`${translationPath}from`)}: ${
                        filter.filters?.from_height
                      }`}</span>
                    )}
                    {filter.filters?.from_height && filter.filters?.to_height && (
                      <span>-</span>
                    )}
                    {(filter.filters?.to_height
                      || filter.filters?.to_height === 0) && (
                      <span className="mx-2">{`${t(`${translationPath}to`)}: ${
                        filter.filters?.to_height
                      }`}</span>
                    )}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}
              {(filter.filters?.from_weight || filter.filters?.to_weight) && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      filters: {
                        ...items?.filters,
                        from_weight: null,
                        to_weight: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                  disabled={loading}
                >
                  <span>
                    {t(`${translationPath}weight`)}
                    {(filter.filters?.from_weight
                      || filter.filters?.from_weight === 0) && (
                      <span className="mx-2">{`${t(`${translationPath}from`)}: ${
                        filter.filters?.from_weight
                      }`}</span>
                    )}
                    {filter.filters?.from_weight && filter.filters?.to_weight && (
                      <span>-</span>
                    )}
                    {(filter.filters?.to_weight
                      || filter.filters?.to_weight === 0) && (
                      <span className="mx-2">{`${t(`${translationPath}to`)}: ${
                        filter.filters?.to_weight
                      }`}</span>
                    )}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}
              {filter.filters?.date_filter_type
              && filter.filters?.date_filter_type !== 'default' ? (
                  <ButtonBase
                    className="btns theme-transparent"
                    onClick={() => {
                      setFilter((items) => ({
                        ...items,
                        filters: {
                          ...items?.filters,
                          date_filter_type: 'default',
                          from_date: null,
                          to_date: null,
                        },
                      }));
                      // Trigger a reload
                      setReloadPull(true);
                    }}
                    disabled={loading}
                  >
                    {filter.filters?.date_filter_type === 'custom' ? (
                      <span>
                        <span className="fas fa-calendar" />
                        <span className="mx-2">{`${t(
                          `${translationPath}from-date`,
                        )}: ${filter.filters?.from_date}`}</span>
                        <span>-</span>
                        <span className="fas fa-calendar mx-2" />
                        <span>{`${t(`${translationPath}to-date`)}: ${
                          filter.filters?.to_date
                        }`}</span>
                      </span>
                    ) : (
                      <span style={{ textTransform: 'capitalize' }}>
                        {`${filter.filters?.date_filter_type || ''}`}
                      </span>
                    )}

                    <span className="fas fa-times px-2" />
                  </ButtonBase>
                ) : null}
              {['candidate_registered', 'candidate_applied'].map((item) => (
                <React.Fragment key={item}>
                  {filter?.filters?.[item] ? (
                    <ButtonBase
                      className="btns theme-transparent"
                      onClick={() => {
                        setFilter((items) => ({
                          ...items,
                          filters: {
                            ...items?.filters,
                            candidate_registered: false,
                            candidate_applied: false,
                            from_date: null,
                            to_date: null,
                            date_filter_type: 'default',
                          },
                        }));
                        // Trigger a reload
                        setReloadPull(true);
                      }}
                      disabled={loading}
                    >
                      <span>
                        {t(`${translationPath}${item.replaceAll('_', '-')}`)}
                      </span>
                      <span className="fas fa-times px-2" />
                    </ButtonBase>
                  ) : null}
                </React.Fragment>
              ))}
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
              {filter.filters?.national_id && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items?.filters,
                        national_id: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>{filter.filters?.national_id}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}
              {filter.filters?.candidate_name && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items?.filters,
                        candidate_name: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>{filter.filters?.candidate_name}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}
              {filter.filters?.applicant_number && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items?.filters,
                        applicant_number: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>{filter.filters?.applicant_number}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}
              {filter.filters?.reference_number && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items?.filters,
                        reference_number: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                >
                  <span>{filter.filters?.reference_number}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}

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
                      setReloadPull(true);
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
                      setReloadPull(true);
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
              {filter.filters?.candidate_property
                && filter.filters?.candidate_property.map(
                  (item, index) =>
                    (!Object.hasOwn(item, 'lookup')
                      && item.value.map((element, elementIndex) => (
                        <ButtonBase
                          className="btns theme-transparent"
                          key={`${item.uuid}-${element}`}
                          onClick={() => {
                            setFilter((items) => {
                              if (
                                Array.isArray(
                                  items.filters.candidate_property[index].value,
                                )
                              )
                                items.filters.candidate_property[index].value.splice(
                                  elementIndex,
                                  1,
                                );
                              return {
                                ...items,
                                page: 1,
                                filters: {
                                  ...items.filters,
                                  candidate_property:
                                    items.filters.candidate_property,
                                },
                              };
                            });
                            setReloadPull(true);
                          }}
                        >
                          <span>{element}</span>
                          <span className="fas fa-times px-2" />
                        </ButtonBase>
                      )))
                    || item.lookup.map((element, elementIndex) => (
                      <ButtonBase
                        className="btns theme-transparent"
                        key={`${item.uuid}-${element.uuid}`}
                        onClick={() => {
                          setFilter((items) => {
                            if (
                              Array.isArray(
                                items.filters.candidate_property[index].value,
                              )
                            )
                              items.filters.candidate_property[index].value.splice(
                                elementIndex,
                                1,
                              );
                            if (
                              !Array.isArray(
                                items.filters.candidate_property[index].value,
                              )
                              || items.filters.candidate_property[index].value
                                .length === 0
                            )
                              items.filters.candidate_property.splice(index, 1);
                            else
                              items.filters.candidate_property[index].lookup.splice(
                                elementIndex,
                                1,
                              );
                            return {
                              ...items,
                              page: 1,
                              filters: {
                                ...items.filters,
                                candidate_property: items.filters.candidate_property,
                              },
                            };
                          });
                          setReloadPull(true);
                        }}
                      >
                        <span>{element.title}</span>
                        <span className="fas fa-times px-2" />
                      </ButtonBase>
                    )),
                )}

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

              {/* ['right_to_work', 'willing_to_travel', 'willing_to_relocate', 'owns_a_car', 'is_completed_profile', 'un_completed_profile'] */}
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
                              && ` ${
                                val.last_name[i18next.language] || val.last_name.en
                              }`
                            }`;
                          else if (
                            item.key === CustomCandidatesFilterTagsEnum.employee.key
                          )
                            return `${
                              val.first_name
                              && (val.first_name[i18next.language] || val.first_name.en)
                            }${
                              val.last_name
                              && ` ${
                                val.last_name[i18next.language] || val.last_name.en
                              }`
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

              {(filter.filters?.age_lte || filter.filters?.age_gte) && (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      filters: {
                        ...items?.filters,
                        age_lte: null,
                        age_gte: null,
                      },
                    }));
                    setReloadPull(true);
                  }}
                  disabled={loading}
                >
                  <span>
                    {/*{t(`${translationPath}age`)}*/}
                    {(filter.filters?.age_lte
                      || filter.filters?.age_lte === 0) && (
                      <span className="mx-2">{`${t(`${translationPath}from-age`)}: ${
                        filter.filters?.age_lte
                      }`}</span>
                    )}
                    {filter.filters?.age_lte && filter.filters?.to_height && (
                      <span>-</span>
                    )}
                    {(filter.filters?.age_gte
                      || filter.filters?.age_gte === 0) && (
                      <span className="mx-2">{`${t(`${translationPath}to-age`)}: ${
                        filter.filters?.age_gte
                      }`}</span>
                    )}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )}
            </div>

            {selectedJob && selectedJob.label && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  // Deselect the job
                  setSelectedJob(null);
                  setFilter((items) => ({
                    ...items,
                    page: 1,
                  }));
                  // Trigger a reload
                  setReloadPull(true);
                }}
              >
                <span>{selectedJob.label}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )}
            {bulkSelect ? (
              <div className="d-flex-v-center-h-end">
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setSelectedTaskIds([]);
                    setSelectedApplicants([]);
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
                                SearchDatabasePermissions.AddCandidateToApplication
                                  .key,
                              permissions: permissions,
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
            <div className="d-flex-h-center flex-wrap pt-3">
              {loading ? (
                <BoardsLoader />
              ) : (
                applicants?.map((applicant, index) => (
                  <ShareCard
                    key={`applicationKey${index + 1}`}
                    applicant={applicant}
                    connections={connections}
                    subtitle={resolveSubtitle(
                      applicant.candidate_company?.[0]?.profile?.profile?.[0]
                        ?.position,
                      applicant.user_detail?.[0]?.company?.name?.[
                        i18next.language
                      ]
                        || applicant.user_detail?.[0]?.company?.name?.en
                        || '',
                    )}
                    uuid={applicant?.candidate_company?.[0]?.user_uuid}
                    timezones={timezones}
                    fromCandidateDatabase
                    tabs={applicant.user_detail?.[0]?.skills}
                    email={applicant.email}
                    score={applicant?.similarity}
                    applied={applicant.user_detail?.[0]?.is_applied}
                    selectedTaskIds={selectedTaskIds}
                    isSelected={applicant.isSelected}
                    profile_uuid={applicant.user_detail?.[0]?.profile_uuid}
                    toggleSelection={() => toggleSelection(applicant)}
                    is_completed_profile={
                      applicant.user_detail?.[0]?.is_completed_profile
                    }
                    title={applicant.name}
                    toggleProfileSelection={(uuid) => toggleProfileSelection(uuid)}
                    reference_number={applicant?.reference_number}
                    match_job_uuid={selectedJob?.uuid}
                  />
                ))
              )}
            </div>
            {applicants && applicants?.length > 0 && !loading && (
              <ReactPaginate
                previousLabel={t(`${translationPath}previous-page`)}
                nextLabel={t(`${translationPath}next-page`)}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={Math.ceil(total / filter?.limit)}
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
                forcePage={filter?.page - 1}
              />
            )}
          </div>
          {/*// )}*/}
        </Container>
      </div>
      {dialog}
      {isOpenCandidateManagementDialog && (
        <CandidateManagementDialog
          isOpen={isOpenCandidateManagementDialog}
          feature={ProfileManagementFeaturesEnum.SearchDB.key}
          isOpenChanged={candidateManagementOpenChangeHandler}
          onSave={onSaveCandidateHandler}
          componentPermission={SearchDatabasePermissions}
        />
      )}
      {isOpenAssignUserManagementDialog && (
        <AssignUserManagementDialog
          selectedApplicants={selectedApplicants}
          isOpen={isOpenAssignUserManagementDialog}
          isOpenChanged={assignUserManagementOpenChangeHandler}
          onSave={onSaveAssignUserHandler}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </div>
  );
};

export default SearchDatabase;

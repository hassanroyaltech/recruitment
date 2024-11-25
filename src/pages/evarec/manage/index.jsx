// React and reactstrap
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabPane,
  Tooltip,
  UncontrolledDropdown,
} from 'reactstrap';

// Classnames
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import classnames from 'classnames';
// Axios

// Moment and lodash
import _ from 'lodash';

// Components
import Loader from 'components/Elevatus/Loader';

// API urls and functions
import urls from 'api/urls';

// The main table
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import { Link, useHistory } from 'react-router-dom';
import ManageJobTable from './ManageJobTable';
import { evarecAPI } from '../../../api/evarec';
import { useTitle } from '../../../hooks';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  GlobalHistory,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  PagesFilterInitValue,
  showError,
} from '../../../helpers';
import {
  AssigneeTypesEnum,
  DynamicFormTypesEnum,
  JobHiringStatusesEnum,
  PostVacancyEnum,
  ProfileSourcesTypesEnum,
  SubscriptionServicesEnum,
  SystemActionsEnum,
  TablesNameEnum,
  WorkflowsTemplatesTypesEnum,
} from '../../../enums';
import { NoPermissionComponent } from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import {
  CheckboxesComponent,
  DialogComponent,
  Inputs,
  TableColumnsPopoverComponent,
  SwitchComponent,
  TooltipsComponent,
} from '../../../components';
import TablesComponent from '../../../components/Tables/Tables.Component';
import {
  GetAllEvaRecPipelines,
  GetAllJobRequisitions,
  GetAllPendingVacancies,
  GetAllSetupsCategories,
  GetAllSetupsPositionsTitle,
  GetAllSetupsPriority,
  GetAllSetupsProviders,
  GetAllSetupsUsers,
  GetAllSetupsWorkflowsTemplates,
  getSetupsHierarchy,
  getSetupsProvidersById,
  getSetupsUsersById,
} from '../../../services';
import { AssignToUsersDialog } from '../dispatcher-process/dialogs';
import {
  CreateAnApplicationPermissions,
  ManageApplicationsPermissions,
} from '../../../permissions';
import Error401 from '../../static/Error401';
import i18next from 'i18next';
import moment from 'moment';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from 'pages/setups/shared';
import Datepicker from 'components/Elevatus/Datepicker';
import JobRequisitionDialog from './dialogs/JobRequisition.dialog';
import AddNoteModal from '../../../components/Views/NotesModal/AddNoteModal';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { DeleteJob } from '../services/api/manageJob';
import { JobVacancyStatusDialog } from './dialogs/JobVacancyStatus.Dialog';
import CopyModal from '../../../components/Elevatus/CopyModal';
const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';
const initialTabVal = () => {
  if (window.location.pathname.includes('archive')) return 'archive';
  if (window.location.pathname.includes('active')) return 'active';
  if (window.location.pathname.includes('approved')) return 'approved';
  if (window.location.pathname.includes('pending')) return 'pending';
};
/**
 * Function that returns the ManageJob component, which renders in part the
 * ManageJobTable, as well as some other elements.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManageJob(props) {
  const { t } = useTranslation(parentTranslationPath);
  const history = useHistory();
  /**
   * State definitions
   */
  const [loading, setLoading] = useState(false);
  const [newSearchProps, setNewSearch] = useState({});
  const [data, setData] = useState([]);
  const [currentTab, setCurrentTab] = useState(initialTabVal() || 'active');
  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkArchive, setIsBulkArchive] = useState(false);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenAssignDialog, setIsOpenAssignDialog] = useState(false);
  const [isOpenJobRequisitionDialog, setIsOpenJobRequisitionDialog]
    = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const stateInitRef = useRef(PagesFilterInitValue);
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [dispatchers, setDispatchers] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [pendingVacancies, setPendingVacancies] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    filters: {
      position_title: [],
      category: [],
      date_of_posting: null,
      internal: null,
      external: null,
      pipeline: [],
      team: [],
      is_published: null,
      priority: [],
      requested_by: [],
      approved_date: null,
      approval_workflow_title: [],
      request_date: null,
      pending_by: [],
      title: [],
      filter_user_type_requested_by: null,
      filter_user_type_pending_by: null,
      national_id: null,
      candidate_name: null,
      candidate_reference_number: null,
      applicant_reference_number: null,
      position: null,
      organization: [],
      vacancy_status: [],
      assigned_to_agency: null,
      agency_uuid: [],
      location:null,
      salary_range:null
    },
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    position_title: [], // array of strings
    category: [], // array of category uuid in string
    date_of_posting: null, //  date format Y-m-d
    internal: null, // boolean 0, 1
    external: null, // boolean 0, 1
    pipeline: [], // array of pipeline uuid in strings
    team: [], // array of user uuid in strings
    is_published: null, // boolean 0, 1
    priority: [], // array of priority uuid strings
    requested_by: [], // array of user uuid in strings
    approved_date: null, // date format Y-m-d (2022-09-15)
    approval_workflow_title: [], // array of strings
    request_date: null,
    pending_by: [],
    title: [],
    filter_user_type_requested_by: null,
    filter_user_type_pending_by: null,
    national_id: null,
    candidate_name: null,
    candidate_reference_number: null,
    applicant_reference_number: null,
    position: null,
    organization: [],
    vacancy_status: [],
    assigned_to_agency: null,
    agency_uuid: [],
    location:null,
    salary_range:null
  });

  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [vacancyStatuses] = useState(
    Object.values(JobHiringStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((state) => state?.userReducer);
  const [copyLink, setCopyLink] = useState(null);

  // const [postVacancyEnum] = useState(() =>
  //   Object.values(PostVacancyEnum).map((item) => ({
  //     ...item,
  //     value: t(item.value),
  //   }))
  // );

  const toggle = () => setTooltipOpen(!tooltipOpen);

  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setPage(currentPage);
  };

  /**
   * Handle Job status (published || unpublished)
   * @param {*} uuid
   * @param {*} rowIndex
   * @param {*} status
   */
  const [jobVacancyState, setJobVacancyState] = useState({ isOpenDialog: false });

  /**
   * Get All Active jobs Function
   * @param rowIndex
   */
  const getAllActiveJob = useCallback(
    (rowIndex, search) => {
      if (currentTab !== 'approved' && currentTab !== 'pending') {
        setLoading(true);
        let url = '';

        if (currentTab === 'active') url = urls.evarec.ats.ACTIVE_JOB;
        if (currentTab === 'archive') url = urls.evarec.ats.ARCHIVED;

        evarecAPI
          .getJobs(
            url,
            currentTab === "active" ? filter.limit : sizePerPage,
            search !== undefined ? 0 : filter.page - 1,
            search,
            {
              ...filter.filters,
              category: filter.filters?.category?.map((it) => it.uuid),
              pipeline: filter.filters?.pipeline?.map((it) => it.uuid),
              agency_uuid: filter.filters?.agency_uuid?.map((it) => it.user_uuid),
              team: filter.filters?.team?.map((it) => it.uuid),
              is_published:
                filter.filters?.is_published
                && parseInt(filter.filters.is_published),
            },
          )
          .then((res) => {
            setDispatchers({
              results: res.data.results.jobs.map((job) => ({
                ...job, // Keep the existing properties of the job
                created_at: job.created_at
                  ? moment(job.created_at).locale(i18next.language).fromNow()
                  : '-', // Format the date using moment and provide fallback
              })),
              totalCount: res.data.results.total,
            });

            setData(
              res.data.results.jobs.map((job, index) => ({
                id: index + 1,
                uuid: job.uuid,
                title: job.title,
                created_at: job?.created_at,
                new_candidates: job.new_candidates,
                total_candidates: job.total_candidates,
                summary_url: '',
                job_url: job.job_url,
                is_published: job.is_published,
                is_external: job.is_externally,
                is_internal: job.is_internally,
                recruiters: job?.teams_invited.length > 0 ? job?.teams_invited : [],
                category: job?.category,
                position_name: job?.position_name,
                position_code: job?.position_code,
                position_code_alias: job?.position_code_alias,
                extra_info: job?.extra_info,
                comment: job?.comment,
                attachment: job?.attachment,
                job_requisition_uuid: job?.job_requisition_uuid,
                vacancy_status: job?.vacancy_status,
                location:job?.location,
                salary_range:job?.salary_range
              })),
            );
            if (rowIndex && document.getElementById(`status-${rowIndex}`))
              document.getElementById(`status-${rowIndex}`).style.cursor = 'pointer';

            setLoading(false);
            setTotal(res?.data?.results?.total);
          })
          // eslint-disable-next-line no-shadow
          .catch((error) => {
            showError(t('Shared:failed-to-get-saved-data'), error);

            setLoading(false);
          });
      }
    },
    [t, currentTab, page, sizePerPage, filter],
  );

  const handleStatusToggle = (uuid, status, rowIndex) => {
    document.getElementById(`status-${rowIndex}`).style.cursor = 'wait';
    evarecAPI
      .togglePublished(uuid, status)
      .then(() => {
        // eslint-disable-next-line no-use-before-define
        getAllActiveJob(rowIndex);
      })
      .catch(() => {
        document.getElementById(`status-${rowIndex}`).style.cursor = 'wait';
      });
  };

  /**
   * Handle Job status (external || internal)
   * @param {*} uuid
   * @param {*} option
   * @param {*} rowIndex
   * @param {*} newValue
   * @param {*} oldValue
   */
  const handleExternalInternalToggle = (
    uuid,
    option,
    rowIndex,
    newValue,
    oldValue,
  ) => {
    setDispatchers((prevDispatchers) => {
      const localItems = [...prevDispatchers.results]; // Copy existing results
      // Ensure rowIndex is valid
      if (localItems[rowIndex])
        localItems[rowIndex] = {
          ...localItems[rowIndex],
          is_externally:
            newValue === PostVacancyEnum.external.key
            || newValue === PostVacancyEnum.both.key,
          is_internally:
            newValue === PostVacancyEnum.internal.key
            || newValue === PostVacancyEnum.both.key,
        };

      return {
        ...prevDispatchers,
        results: localItems,
      };
    });

    // Proceed with the API call
    evarecAPI.toggleExternalInternal(uuid, option).catch((error) => {
      // Revert to the old state in case of an error
      setDispatchers((prevDispatchers) => {
        const localItems = [...prevDispatchers.results]; // Copy existing results
        if (localItems[rowIndex]) localItems[rowIndex] = { ...(oldValue || {}) }; // Revert to old value

        return {
          ...prevDispatchers,
          results: localItems,
        };
      });
      showError(t('Shared:failed-to-update'), error); // Show error notification
    });
  };
  const handleExternalInternalToggleArchive = (
    uuid,
    option,
    rowIndex,
    newValue,
    oldValue,
  ) => {
    evarecAPI
      .toggleExternalInternal(uuid, option)
      .then(() => {
        setData((items) => {
          const localItems = [...items];
          localItems[rowIndex] = {
            ...localItems[rowIndex],
            is_external:
              newValue === PostVacancyEnum.external.key
              || newValue === PostVacancyEnum.both.key,
            is_internal:
              newValue === PostVacancyEnum.internal.key
              || newValue === PostVacancyEnum.both.key,
          };
          return localItems;
        });
      })
      .catch((error) => {
        setData((items) => {
          const localItems = [...items];
          localItems[rowIndex] = { ...(oldValue || {}) };
          return localItems;
        });
        showError(t('Shared:failed-to-update'), error);
      });
  };

  const onChangeVacancyStatus = (index, value) => {
    setDispatchers((items) => {
      const localItems = [...items];
      localItems[index] = {
        ...localItems[index],
        results: value,
      };
      return localItems;
    });
  };
  const onChangeArchiveVacancyStatus = (index, value) => {
    setData((items) => {
      const localItems = [...items];
      localItems[index] = {
        ...localItems[index],
        vacancy_status: value,
      };
      return localItems;
    });
  };
  /**
   * Invoke API to get all active jobs for each page
   */
  const debouncedGetAllActiveJob = useCallback(
    _.debounce((rowIndex, search) => {
      getAllActiveJob(rowIndex, search);
    }, 500), // Debounce timeout set to 500ms
    [getAllActiveJob],
  );

  /**
   * Invoke API to get all active jobs for each page
   */
  useEffect(() => {
    if (searchValue.trim() !== '')
      // Call the debounced function with the current search value
      debouncedGetAllActiveJob(0, searchValue || undefined);
    // If searchValue is empty, call getAllActiveJob without search term
    else getAllActiveJob(0, undefined);

    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedGetAllActiveJob.cancel();
    };
  }, [searchValue, debouncedGetAllActiveJob, currentTab, page]);
  /**
   * Search through props
   * @param props
   */
  // eslint-disable-next-line no-shadow
  const searchProps = (props) => {
    if (!_.isEmpty(props) && _.isEmpty(newSearchProps)) setNewSearch(props);
  };

  useTitle(t(`${translationPath}manage-applications`));

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

  const jobSearchHandler = () => {
    setLoading(true);
    if (currentTab === 'approved')
      setFilter((items) => ({ ...items, search: searchValue }));
    else getAllActiveJob(0, searchValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all dispatchers with filter
   */
  const getAllJobRequisitions = useCallback(async () => {
    setLoading(true);
    const results = await GetAllJobRequisitions({
      ...filter,
      filters: {
        ...filter.filters,
        position_title: filter.filters?.position_title?.map((it) => it.uuid),
        category: filter.filters?.category?.map((it) => it.uuid),
        agency_uuid: filter.filters?.agency_uuid?.map((it) => it.user_uuid),
        priority: filter.filters?.priority?.map((it) => it.uuid),
        requested_by: filter.filters?.requested_by?.map((it) => it.uuid),
        approval_workflow_title: filter.filters?.approval_workflow_title?.map(
          (it) => it.uuid,
        ),
        organization: filter.filters?.organization?.map((it) => it.uuid),
      },
    });
    setLoading(false);
    if (results && results.status === 200)
      setDispatchers({
        results: results.data.results,
        totalCount: results.data.paginate.total,
      });
    else {
      setDispatchers({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), results);
    }
  }, [filter, t]);

  const getAllPendingVacancies = useCallback(async () => {
    setLoading(true);
    const results = await GetAllPendingVacancies({
      ...filter,
      filters: {
        ...filter.filters,
        category: filter.filters?.category?.map((it) => it.uuid),
        agency_uuid: filter.filters?.agency_uuid?.map((it) => it.user_uuid),
        requested_by: filter.filters?.requested_by?.map((it) => it.uuid),
        pending_by: filter.filters?.pending_by?.map((it) => it.uuid),
        date_of_posting: filter.filters?.request_date,
        request_date: null,
      },
    });
    setLoading(false);
    if (results && results.status === 200)
      setPendingVacancies({
        results: results.data?.results?.jobs,
        totalCount: results.data?.results?.total,
      });
    else {
      setPendingVacancies({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), results);
    }
  }, [filter, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.assignToRecruiter.key)
      setIsOpenAssignDialog(true);
    else if (action.key === SystemActionsEnum.postJob.key)
      history.push(
        `/recruiter/job/create?uuid=${row.uuid}${
          row.position_title_uuid
            ? `&position_title_uuid=${row.position_title_uuid}`
            : ''
        }`,
      );
    else if (action.key === SystemActionsEnum.view.key)
      setIsOpenJobRequisitionDialog(true);
  };
  const onActionClickedActiveJobs = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.view.key) openRequisitionDialog(row);
    else if (action.key === SystemActionsEnum.edit.key) {
      localStorage.setItem('job_uuid', row?.uuid);
      GlobalHistory.push(`/recruiter/job/manage/edit/${row?.uuid}`);
    } else if (action.key === SystemActionsEnum.note.key) {
      setNotesModal(row?.uuid);
      setShowNotesModal(true);
    } else if (action.key === SystemActionsEnum.archive.key)
      confirmToggleType(row?.uuid);
    else if (action.key === SystemActionsEnum.update.key)
      // setSelectedRows(row);
      setJobVacancyState({ isOpenDialog: true });
    else if (action.key === SystemActionsEnum.activate.key)
      confirmToggleType(row?.uuid);
    else if (action.key === SystemActionsEnum.applicationLink.key) {
      showCopyModal(true);
      setCopyLink(row?.job_url);
    }
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };
  const [postVacancyEnum] = useState(() =>
    Object.values(PostVacancyEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change selected columns
   * (must be callback)
   */
  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);
  const onActiveColumnsChanged = useCallback(
    (newValue) => {
      const localNewVal = [...newValue];
      const created_at_index = localNewVal.findIndex(
        (item) => item.input === 'created_at',
      );
      const title_index = localNewVal.findIndex((item) => item.input === 'title');
      console.log(title_index);
      if (title_index === -1) {
        console.error('title column not font');
        return;
      }
      localNewVal[title_index].component = (row) => {
        const titleName = row?.title;
        return titleName ? (
          <TooltipsComponent
            title={titleName}
            translationPath=""
            contentComponent={
              <span>
                <Link
                  to={`/recruiter/job/manage/pipeline/${row.uuid}`}
                  className="text-gray"
                >
                  {titleName.length > 19
                    ? `${titleName.substring(0, 20)}...`
                    : titleName}
                </Link>
              </span>
            }
          />
        ) : (
          '-'
        );
      };

      const position_index = localNewVal.findIndex(
        (item) => item.input === 'position_name',
      );
      if (position_index === -1) {
        console.error('position-name column not found');
        return; // Handle the error as needed
      }
      if (created_at_index === -1) {
        console.error('create date column not found');
        return; // Handle the error as needed
      }
      localNewVal[created_at_index] = {
        ...localNewVal[created_at_index],
        input: 'created_at',
        label: t(`${translationPath}date-posted`),
      };

      localNewVal[position_index].component = (row) => {
        const positionName
          = row?.position_name?.[i18next.language] || row?.position_name?.en;
        return positionName ? (
          <TooltipsComponent
            title={positionName}
            translationPath=""
            contentComponent={
              <span>
                {positionName.length > 19
                  ? `${positionName.substring(0, 20)}...`
                  : positionName}
              </span>
            }
          />
        ) : (
          '-'
        );
      };
      // Check if the column for is_external already exists
      const externalIndex = localNewVal.findIndex(
        (item) => item.input === 'is_external',
      );
      if (externalIndex === -1)
        // Add the new column for is_external
        localNewVal.push({
          input: 'is_external',
          label: 'Internal/External', // This should be correctly set
          component: (row, rowIndex) => (
            <SharedAutocompleteControl
              editValue={(() => {
                // Access the properties with the correct names
                const isExternal = row.is_externally || false; // Use is_externally
                const isInternal = row.is_internally || false; // Use is_internally
                const value
                  = isExternal && isInternal
                    ? PostVacancyEnum.both.key
                    : !isExternal && isInternal
                      ? PostVacancyEnum.internal.key
                      : PostVacancyEnum.external.key;
                return value;
              })()}
              placeholder={t(`${translationPath}internal-and-external`)}
              stateKey="internal-and-external"
              onValueChanged={(value) =>
                handleExternalInternalToggle(
                  row.uuid,
                  value.value,
                  rowIndex,
                  value.value,
                  row,
                )
              }
              translationPath={translationPath}
              disableClearable
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
              initValues={postVacancyEnum}
              themeClass="theme-outline"
              errorPath="internal-and-external"
              sharedClassesWrapper="mb-0"
              disabledOptions={(option) => option.key === PostVacancyEnum.both.key}
            />
          ),
        });

      setTableColumns(localNewVal);
    },
    [selectedRows, currentTab],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setDispatchers((items) => {
      const localItems = { ...items };
      const localItemIndex = localItems.results.findIndex(
        (item) => item[primary_key] === row[primary_key],
      );
      if (localItemIndex === -1) return items;
      localItems.results[localItemIndex][key]
        = !localItems.results[localItemIndex][key];
      return JSON.parse(JSON.stringify(localItems));
    });
  };

  const onReloadDataHandlerActiveJob = ({ row, viewItem: { key, primary_key } }) => {
    setDispatchers((items) => {
      const localItems = { ...items };
      const localItemIndex = localItems.results.findIndex(
        (item) => item[primary_key] === row[primary_key],
      );
      if (localItemIndex === -1) return items;
      localItems.results[localItemIndex][key]
        = !localItems.results[localItemIndex][key];
      return JSON.parse(JSON.stringify(localItems));
    });
    getAllActiveJob();
  };
  const resetFilter = useCallback(() => {
    setFilter((items) => ({
      ...items,
      page: 1,
      filters: {
        position_title: [],
        category: [],
        date_of_posting: null,
        internal: null,
        external: null,
        pipeline: [],
        team: [],
        is_published: null,
        priority: [],
        requested_by: [],
        approved_date: null,
        approval_workflow_title: [],
        request_date: null,
        pending_by: [],
        title: [],
        filter_user_type_requested_by: null,
        filter_user_type_pending_by: null,
        national_id: null,
        candidate_name: null,
        candidate_reference_number: null,
        applicant_reference_number: null,
        position: null,
        organization: [],
        vacancy_status: [],
        assigned_to_agency: null,
        agency_uuid: [],
        location:null,
        salary_range:null

      },
    }));
  }, []);

  const openRequisitionDialog = useCallback((row) => {
    setActiveItem(row);
    setIsOpenJobRequisitionDialog(true);
  }, []);
  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    if (currentTab === 'approved') getAllJobRequisitions();
  }, [getAllJobRequisitions, filter, currentTab]);

  useEffect(() => {
    if (currentTab === 'pending') getAllPendingVacancies();
  }, [getAllPendingVacancies, filter, currentTab]);

  const pendingTableColumns = [
    {
      input: 'title',
      label: t(`${translationPath}title`),
      sort: true,
      component: (row) => (
        <span>
          <Link
            to={`/recruiter/job/manage/pipeline/${row.uuid}`}
            className="text-gray"
          >
            {row.title.length > 19 ? `${row.title.substring(0, 20)}...` : row.title}
          </Link>
        </span>
      ),
    },
    {
      input: 'teams_invited',
      label: t(`${translationPath}team`),
      sort: true,
      component: (row) => (
        <div>
          {row.teams_invited?.length > 0
            && row.teams_invited.map((recruiter, i) => (
              <LetterAvatar
                key={i}
                name={`${recruiter?.first_name} ${recruiter?.last_name}`}
              />
            ))}
        </div>
      ),
    },
    {
      input: 'category',
      label: t(`${translationPath}category`),
      sort: true,
      editable: false,
    },
    {
      input: 'is_external',
      label: t(`${translationPath}internal-external`),
      isDummyField: false,
      editable: false,
      component: (row) => {
        if (row.is_externally && row.is_internally) return `${translationPath}both`;
        if (row.is_externally) return `${translationPath}external`;
        return `${translationPath}internal`;
      },
    },
    {
      input: 'created_at',
      label: t(`${translationPath}date-posted`),
      sort: true,
      editable: false,
      formatExtraData: i18next.language,
      component: (row) => moment(row.created_at).locale(i18next.language).fromNow(),
    },
  ];
  const [notesModal, setNotesModal] = useState(null);
  const [copyModal, showCopyModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [dialog, setDialog] = useState(null);
  const closeDialog = () => {
    setIsBulkArchive(false);
    setDialog(null);
    console.log('Dialog state after close:', dialog);
  };
  const onChangeJobVacancyStatus = (vacancy_status, job_uuid) => {
    // Find the record in the dispatchers.results array that matches the job_uuid
    const updatedResults = dispatchers.results.map((record) => {
      console.log(record.uuid);
      if (record.uuid === job_uuid) return { ...record, vacancy_status };
      return record;
    });
    // Update the state using setDispatchers
    setDispatchers({ ...dispatchers, results: updatedResults });
  };
  /** Confirm delete/archive/active item */
  const confirmToggleType = (uuid) => {
    const selectedUuid = isBulkArchive ? uuid : [uuid];

    setDialog(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() =>
          deleteJob(
            selectedUuid,
            `${
              currentTab === 'active'
                ? urls.evarec.ats.ARCHIVE
                : urls.evarec.ats.ACTIVATE
            }`,
          )
        }
        onCancel={closeDialog}
        showCancel
        confirmBtnBsStyle="success"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="danger"
        confirmBtnText={`${t(`${translationPath}yes`)}, ${
          currentTab === 'active'
            ? t(`${translationPath}archive`)
            : t(`${translationPath}active`)
        }`}
        btnSize=""
      >
        {t(`${translationPath}this-job-will-be`)}{' '}
        {currentTab === 'active'
          ? t(`${translationPath}archive`)
          : t(`${translationPath}active`)}
        <br />
        {loading && <i className="fas fa-circle-notch fa-spin" />}
      </ReactBSAlert>,
    );
  };

  /** Delete job */
  const deleteJob = async (uuid, type) => {
    setLoading(true);
    DeleteJob(uuid, type).then(() => {
      setLoading(false);
      setDialog(
        <ReactBSAlert
          success
          style={{ display: 'block' }}
          title={
            currentTab === 'active'
              ? t(`${translationPath}archived`)
              : t(`${translationPath}activated`)
          }
          onConfirm={() => {
            closeDialog();
            setSelectedRows([]);
            setIsBulkArchive(false);
            getAllActiveJob();
          }}
          onCancel={closeDialog}
          confirmBtnBsStyle="primary"
          confirmBtnText={t(`${translationPath}ok`)}
          btnSize=""
        >
          {currentTab === 'active'
            ? t(`${translationPath}archived-successfully`)
            : t(`${translationPath}activated-successfully`)}
        </ReactBSAlert>,
      );
    });
  };
  useEffect(() => {
    if (isBulkArchive) confirmToggleType(selectedRows.map((items) => items.uuid));
  }, [isBulkArchive, selectedRows]);


  useEffect(() => {
    setLoading(true);
    setDispatchers({ results: [[]], totalCount: 0 });
    setLoading(false);
  }, [currentTab]);


  /**
   * Return JSX
   */
  return (
    <>
      {jobVacancyState.isOpenDialog && (
        <JobVacancyStatusDialog
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          isOpen={jobVacancyState.isOpenDialog}
          jobData={activeItem}
          onSave={onChangeJobVacancyStatus}
          isOpenChanged={() => {
            setJobVacancyState({ isOpenDialog: false });
          }}
        />
      )}
      {copyModal && (
        <CopyModal
          {...props}
          url={copyLink}
          discription=""
          isOpen={copyModal}
          onClose={() => showCopyModal(false)}
          title={t(`${translationPath}copy-application-link`)}
        />
      )}
      {dialog}
      {notesModal && (
        <AddNoteModal
          type_panel="ats"
          isOpen={showNotesModal}
          onClose={() => {
            setNotesModal(null);
            setShowNotesModal(false);
            history.replace({ ...history.location, state: {} });
          }}
          uuid={notesModal}
          paths={props.paths}
          {...props}
        />
      )}
      <div className="content-page bg-white page-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex-v-center flex-wrap px-2">
            <div className="h5 px-2">
              <span>{t(`${translationPath}list-of-applications`)}</span>
            </div>
            <div className="d-inline-flex px-2 mb-2">
              <Inputs
                idRef="searchRef"
                value={searchValue}
                themeClass="theme-solid"
                label="search"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSearchValue(value);
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter' && !loading) jobSearchHandler(event);
                }}
                endAdornment={
                  <div className="end-adornment-wrapper">
                    <ButtonBase
                      className="btns-icon theme-transparent"
                      disabled={loading}
                      onClick={jobSearchHandler}
                    >
                      <span className="fas fa-search" />
                    </ButtonBase>
                  </div>
                }
              />
            </div>
          </div>
          {!userReducer?.results?.user?.is_provider && (
            <div className="inline-flex px-2">
              <ButtonBase
                className="btns theme-solid bg-secondary mx-2 mb-3"
                disabled={selectedRows.length === 0}
                onClick={() => setIsBulkArchive(true)}
              >
                <i className="fas fa-archive" />
                <span className="px-1">{t(`${translationPath}bulk-archive`)}</span>
              </ButtonBase>
              <span onMouseEnter={onPopperOpen}>
                <ButtonBase
                  className="btns theme-solid mx-2 mb-3"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        CreateAnApplicationPermissions.AddEvaRecApplication.key,
                    })
                  }
                  onClick={() => history.push('/recruiter/job/create')}
                >
                  <i className="fas fa-plus" />
                  <span className="px-1">
                    {t(`${translationPath}create-an-application`)}
                  </span>
                </ButtonBase>
              </span>
            </div>
          )}
        </div>
        <p className="text-muted px-3">
          <span>{t(`${translationPath}create-an-application-description`)}</span>
          <span>.</span>
        </p>
        <div className="content-page px-3">
          <TabPane tabId="1" className="list-tab-header">
            <div className=" d-flex-h-between">
              <Nav tabs className="w-100 mt-4 px-3 tabs-with-actions">
                <NavItem>
                  <NavLink
                    className={classnames(
                      {
                        'tab-link': true,
                        'active-tab': currentTab === 'active',
                      },
                      'nav-evarec',
                    )}
                    active={currentTab === 'active'}
                    onClick={() => {
                      setPage(0);
                      setCurrentTab('active');
                      history.push('/recruiter/job/manage/active');
                      resetFilter();
                    }}
                  >
                    {t(`${translationPath}active-applications`)}
                  </NavLink>
                </NavItem>
                {/* remove later and depend on permissions only */}
                {!userReducer?.results?.user?.is_provider && (
                  <>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          {
                            'tab-link': true,
                            'active-tab': currentTab === 'archive',
                          },
                          'nav-evarec',
                        )}
                        active={currentTab === 'archive'}
                        onClick={() => {
                          setPage(0);
                          setCurrentTab('archive');
                          history.push('/recruiter/job/manage/archive');
                          resetFilter();
                        }}
                      >
                        {t(`${translationPath}archived-applications`)}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          {
                            'tab-link': true,
                            'active-tab': currentTab === 'approved',
                          },
                          'nav-evarec',
                        )}
                        active={currentTab === 'approved'}
                        onClick={() => {
                          setCurrentTab('approved');
                          history.push('/recruiter/job/manage/approved');
                          resetFilter();
                        }}
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.ApprovedVacancies.key,
                          })
                        }
                      >
                        {t(`${translationPath}approved-requisitions`)}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          {
                            'tab-link': true,
                            'active-tab': currentTab === 'pending',
                          },
                          'nav-evarec',
                        )}
                        active={currentTab === 'pending'}
                        onClick={() => {
                          setPage(0);
                          setCurrentTab('pending');
                          history.push('/recruiter/job/manage/pending');
                          resetFilter();
                        }}
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.ApprovedVacancies.key,
                          })
                        }
                      >
                        {t(`${translationPath}pending-approvals`)}
                      </NavLink>
                    </NavItem>
                  </>
                )}
                {currentTab !== 'approved' && currentTab !== 'pending' && (
                  <NavItem className="ml-auto mt-auto mb-auto">
                    <span className="mr-2 font-14">
                      <span>
                        {sizePerPage * page + 1 >= total
                          ? total
                          : sizePerPage * page + 1}
                        <span>-</span>
                        {sizePerPage * (page + 1) >= total
                          ? total
                          : sizePerPage * (page + 1)}
                      </span>
                      <span className="px-1">{t(`${translationPath}of`)}</span>
                      <span>{total}</span>
                    </span>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        id="pageNumber"
                        className="btn btn-link bg-transparent border-0 rounded-circle"
                        style={{
                          color: '#6d737a',
                          width: 30,
                          height: 30,
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        <i className="fa fa-ellipsis-v" />
                      </DropdownToggle>
                      <Tooltip
                        placement="right"
                        isOpen={tooltipOpen}
                        target="pageNumber"
                        toggle={toggle}
                      >
                        <span>{t(`${translationPath}page-count`)}</span>
                      </Tooltip>
                      <DropdownMenu end>
                        {[10, 25, 50, 100].map((size) => (
                          <DropdownItem
                            key={size}
                            onClick={() => {
                              setPage(0);
                              setSizePerPage(size);
                              setFilter({ ...filter,limit: size })
                            }}
                          >
                            {size}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </NavItem>
                )}
              </Nav>
              <div className="d-inline-flex-center">
                <ButtonBase
                  onClick={() => {
                    setModalFilters({
                      ...filter.filters,
                    });
                    setShowFilterModal(true);
                  }}
                  className="btns-icon theme-transparent"
                >
                  <i className="fas fa-filter" />
                </ButtonBase>
              </div>
              <div className="d-inline-flex-center mx-2">
                <ButtonBase
                  onClick={() => resetFilter()}
                  className="btns-icon theme-transparent"
                >
                  <i className="fas fa-backspace" />
                </ButtonBase>
              </div>
            </div>
            {loading && (
              <CardBody className="text-center">
                <Row>
                  <Col xl="12" lg="12" sm="12" xs="12">
                    <Loader />
                  </Col>
                </Row>
              </CardBody>
            )}
            {!loading
              && currentTab !== 'approved'
              && currentTab !== 'pending'
              && currentTab !== 'archive' && (
              <>

                <TableColumnsPopoverComponent
                  columns={tableColumns}
                  onReloadData={onReloadDataHandlerActiveJob}
                  onColumnsChanged={onActiveColumnsChanged}
                  feature_name={TablesNameEnum.Ats_Job.key}
                  wrapperClasses="w-100 d-flex justify-content-end pr-2-reversed"
                />
                <TablesComponent
                  isDynamicDate
                  isWithTableActions
                  isWithoutBoxWrapper
                  uniqueKeyInput="uuid"
                  pageSize={filter.limit}
                  headerData={tableColumns}
                  pageIndex={filter.page - 1}
                  data={dispatchers.results || []}
                  onActionClicked={onActionClickedActiveJobs}
                  themeClasses={"theme-strip"}
                  totalItems={dispatchers.totalCount}
                  onPageSizeChanged={onPageSizeChanged}
                  onPageIndexChanged={onPageIndexChanged}
                  tableActions={[
                    SystemActionsEnum.edit,
                    SystemActionsEnum.note,
                    SystemActionsEnum.archive,
                    SystemActionsEnum.view,
                    SystemActionsEnum.update,
                    SystemActionsEnum.applicationLink,
                  ]}
                  tableActionsOptions={{
                    // eslint-disable-next-line max-len
                    getDisabledAction: (item, rowIndex, action) => {
                      if (action.key === SystemActionsEnum.note.key)
                        return !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                              ManageApplicationsPermissions.NotesEvaRecApplication
                                .key,
                        });
                      if (action.key === SystemActionsEnum.edit.key)
                        return (
                          item?.vacancy_status
                              === JobHiringStatusesEnum.Canceled.key
                            || !getIsAllowedPermissionV2({
                              permissions,
                              permissionId:
                                ManageApplicationsPermissions.UpdateVacancyStatus
                                  .key,
                            })
                        );
                      if (action.key === SystemActionsEnum.archive.key)
                        return !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                              ManageApplicationsPermissions.ReActivateJob.key,
                        });
                      if (action.key === SystemActionsEnum.view.key)
                        return item && !item?.job_requisition_uuid;
                      if (action.key === SystemActionsEnum.update.key)
                        return (
                          item?.vacancy_status
                              === JobHiringStatusesEnum.Canceled.key
                            || !getIsAllowedPermissionV2({
                              permissions,
                              permissionId:
                                ManageApplicationsPermissions.UpdateVacancyStatus
                                  .key,
                            })
                        );

                      if (action.key === SystemActionsEnum.applicationLink.key)
                        return (
                          (!selectedRows?.is_published === false
                              || !selectedRows?.is_published)
                            && !getIsAllowedPermissionV2({
                              permissions,
                              permissionId:
                                CreateAnApplicationPermissions?.AddEvaRecApplication
                                  ?.key,
                            })
                        );
                      return true;
                    },
                  }}
                  selectedRows={selectedRows}
                  isWithCheckAll
                  isWithCheck
                  onSelectAllCheckboxChanged={() => {
                    setSelectedRows((items) =>
                      globalSelectedRowsHandler(items, dispatchers.results),
                    );
                  }}
                  onSelectCheckboxChanged={({ selectedRow }) => {
                    if (!selectedRow) return;
                    setSelectedRows((items) =>
                      globalSelectedRowHandler(items, selectedRow),
                    );
                  }}
                />
              </>
            )}
            {/*Archive Job Table*/}
            {!loading
              && currentTab !== 'approved'
              && currentTab !== 'pending'
              && currentTab !== 'active' && (
              <ManageJobTable
                {...props}
                data={data}
                type={currentTab}
                onChangeTableType={getAllActiveJob}
                searchProps={searchProps}
                sizePerPage={sizePerPage}
                onPageChange={setPage}
                getAllActive={getAllActiveJob}
                page={page}
                handlePageClick={handlePageClick}
                total={total}
                isBulkArchive={isBulkArchive}
                setIsBulkArchive={setIsBulkArchive}
                handleStatusToggle={handleStatusToggle}
                handleExternalInternalToggle={handleExternalInternalToggleArchive}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                openRequisitionDialog={openRequisitionDialog}
                onChangeVacancyStatus={onChangeArchiveVacancyStatus}
                appliedFilters={filter.filters}
              />
            )}
            {currentTab === 'approved'
              && !loading
              && (getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageApplicationsPermissions.ApprovedVacancies.key,
              }) ? (
                  <div className="px-4">
                    <TableColumnsPopoverComponent
                      columns={tableColumns}
                      onReloadData={onReloadDataHandler}
                      onColumnsChanged={onColumnsChanged}
                      feature_name={TablesNameEnum.JobRequisition.key}
                      wrapperClasses="w-100 d-flex justify-content-end pr-2-reversed"
                    />
                    <TablesComponent
                      isDynamicDate
                      isWithTableActions
                      isWithoutBoxWrapper
                      uniqueKeyInput="uuid"
                      pageSize={filter.limit}
                      headerData={tableColumns}
                      themeClasses={"theme-strip"}
                      pageIndex={filter.page - 1}
                      tableActionsOptions={{
                        component: (row) => (
                          <>
                            <ButtonBase
                              className="btns theme-primary"
                              onClick={() =>
                                onActionClicked(
                                  SystemActionsEnum.assignToRecruiter,
                                  row,
                                )
                              }
                              disabled={
                                !getIsAllowedPermissionV2({
                                  permissions,
                                  permissionId:
                                  ManageApplicationsPermissions.RecruiterManager.key,
                                })
                              }
                            >
                              <span
                                className={SystemActionsEnum.assignToRecruiter.icon}
                              />
                              <span className="px-1">
                                {t(SystemActionsEnum.assignToRecruiter.value)}
                              </span>
                            </ButtonBase>
                            <ButtonBase
                              className="btns theme-primary"
                              onClick={() =>
                                onActionClicked(SystemActionsEnum.view, row)
                              }
                            >
                              <span className={SystemActionsEnum.view.icon} />
                              <span className="px-1">
                                {t(SystemActionsEnum.view.value)}
                              </span>
                            </ButtonBase>
                            <ButtonBase
                              className="btns theme-primary"
                              onClick={() =>
                                onActionClicked(SystemActionsEnum.postJob, row)
                              }
                            >
                              <span className={SystemActionsEnum.postJob.icon} />
                              <span className="px-1">
                                {t(SystemActionsEnum.postJob.value)}
                              </span>
                            </ButtonBase>
                          </>
                        ),
                      }}
                      data={dispatchers.results || []}
                      onActionClicked={onActionClicked}
                      totalItems={dispatchers.totalCount}
                      onPageSizeChanged={onPageSizeChanged}
                      onPageIndexChanged={onPageIndexChanged}
                      tableActions={[
                        SystemActionsEnum.assignToRecruiter,
                        SystemActionsEnum.postJob,
                      ]}
                    />
                  </div>
                ) : (
                  <Error401 />
                ))}
            {currentTab === 'pending'
              && !loading
              && (getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageApplicationsPermissions.ApprovedVacancies.key,
              }) ? (
                  <div className="px-4">
                    <TablesComponent
                      isDynamicDate
                      isWithoutBoxWrapper
                      uniqueKeyInput="uuid"
                      pageSize={filter.limit}
                      headerData={pendingTableColumns}
                      themeClasses={"theme-strip"}
                      pageIndex={filter.page - 1}
                      data={pendingVacancies.results || []}
                      totalItems={pendingVacancies.totalCount}
                      onPageSizeChanged={onPageSizeChanged}
                      onPageIndexChanged={onPageIndexChanged}
                      isDisabledActions={
                        !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                          ManageApplicationsPermissions.ApprovedVacancies.key,
                        })
                      }
                    />
                  </div>
                ) : (
                  <Error401 />
                ))}
          </TabPane>
        </div>
        {isOpenAssignDialog && (
          <AssignToUsersDialog
            onSave={() => {
              setFilter((items) => ({ ...items, page: 1 }));
            }}
            activeItem={activeItem}
            isOpenChanged={() => {
              setIsOpenAssignDialog(false);
              if (activeItem) setActiveItem(null);
            }}
            isOpen={isOpenAssignDialog}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        <NoPermissionComponent
          anchorEl={anchorEl}
          popperOpen={popperOpen}
          setAnchorEl={setAnchorEl}
          setPopperOpen={setPopperOpen}
        />
        {showFilterModal && (
          <DialogComponent
            maxWidth="sm"
            titleText="filter-dialog"
            dialogContent={
              // team: [], // array of user uuid in strings
              <div className="d-flex flex-wrap">
                {/* Title */}
                {(currentTab === 'active'
                  || currentTab === 'archive'
                  || currentTab === 'pending') && (
                  <SharedAutocompleteControl
                    editValue={modalFilters.title || []}
                    placeholder="press-enter-to-add"
                    title="title"
                    isFreeSolo
                    stateKey="title"
                    errorPath="title"
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        title: e.value,
                      }))
                    }
                    isDisabled={loading}
                    type={DynamicFormTypesEnum.array.key}
                    parentTranslationPath={parentTranslationPath}
                    isFullWidth
                    sharedClassesWrapper="px-2"
                  />
                )}
                {/* Position Title */}
                {currentTab === 'approved' && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    searchKey="search"
                    title="position-title"
                    stateKey="position_title"
                    errorPath="position_title"
                    editValue={
                      modalFilters.position_title?.map((it) => it.uuid) || []
                    }
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        position_title: e.value,
                      }))
                    }
                    placeholder="position-title"
                    getDataAPI={GetAllSetupsPositionsTitle}
                    extraProps={{
                      with_than:
                        (modalFilters?.position_title?.length
                          && modalFilters.position_title?.map((item) => item.uuid))
                        || null,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {currentTab === 'approved' && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    searchKey="search"
                    title="organization"
                    stateKey="organization"
                    errorPath="organization"
                    editValue={modalFilters.organization?.map((it) => it.uuid) || []}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        organization: e.value,
                      }))
                    }
                    placeholder="organization"
                    getDataAPI={getSetupsHierarchy}
                    extraProps={{
                      with_than:
                        (modalFilters?.organization?.length
                          && modalFilters.organization?.map((item) => item.uuid))
                        || null,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Job family - Category */}
                {(currentTab === 'active'
                  || currentTab === 'archive'
                  || currentTab === 'approved'
                  || currentTab === 'pending') && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    searchKey="search"
                    title="category"
                    stateKey="category"
                    errorPath="category"
                    editValue={modalFilters.category?.map((it) => it.uuid) || []}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        category: e.value,
                      }))
                    }
                    placeholder="category"
                    getDataAPI={GetAllSetupsCategories}
                    extraProps={{
                      with_than:
                        (modalFilters?.category?.length
                          && modalFilters.category?.map((item) => item.uuid))
                        || null,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.title[i18next.language] || option.title.en
                    }
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Pipeline */}
                {currentTab === 'active' && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    searchKey="search"
                    title="pipeline"
                    stateKey="pipeline"
                    errorPath="pipeline"
                    editValue={modalFilters.pipeline?.map((it) => it.uuid) || []}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        pipeline: e.value,
                      }))
                    }
                    placeholder="pipeline"
                    getDataAPI={GetAllEvaRecPipelines}
                    extraProps={{
                      with_than:
                        (modalFilters?.pipeline?.length
                          && modalFilters.pipeline?.map((item) => item.uuid))
                        || null,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Team */}
                {currentTab === 'active' && (
                  <SharedAPIAutocompleteControl
                    title="employee"
                    isHalfWidth
                    placeholder="select-users"
                    stateKey="team"
                    isEntireObject
                    onValueChanged={({ value }) => {
                      setModalFilters((items) => ({
                        ...items,
                        team: value,
                      }));
                    }}
                    idRef="team-autocomplete-ref"
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }${
                        (!option.has_access
                          && ` ${t('Shared:dont-have-permissions')}`)
                        || ''
                      }`
                    }
                    type={DynamicFormTypesEnum.array.key}
                    getDataAPI={GetAllSetupsUsers}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    searchKey="search"
                    editValue={modalFilters.team.map((it) => it.uuid) || []}
                    extraProps={{
                      committeeType: 'all',
                      with_than:
                        (modalFilters?.team?.length
                          && modalFilters.team?.map((item) => item.uuid))
                        || null,
                    }}
                    getDisabledOptions={(option) => !option.has_access}
                  />
                )}
                {/* Date of posting */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <div className="w-50 px-2">
                    <Datepicker
                      value={modalFilters.date_of_posting || ''}
                      label={t('date-of-posting')}
                      inputPlaceholder="YYYY-MM-DD"
                      onChange={(date) => {
                        if (date !== 'Invalid date')
                          setModalFilters((items) => ({
                            ...items,
                            date_of_posting: date,
                          }));
                        else
                          setModalFilters((items) => ({
                            ...items,
                            date_of_posting: null,
                          }));
                      }}
                    />
                  </div>
                )}
                {/* Status - Is published */}
                {currentTab === 'active' && (
                  <SharedAutocompleteControl
                    isHalfWidth
                    searchKey="search"
                    initValuesKey="value"
                    isDisabled={loading}
                    initValuesTitle="label"
                    initValues={[
                      { label: t('published'), value: '1' },
                      { label: t('not-published'), value: '0' },
                    ]}
                    stateKey="is_published"
                    errorPath="is_published"
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        is_published: e.value || null,
                      }))
                    }
                    title="status"
                    editValue={modalFilters.is_published}
                    placeholder="status"
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                )}
                {/* Internal - External */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <div className="w-50 px-3">
                    <CheckboxesComponent
                      idRef="internalRef"
                      onSelectedCheckboxChanged={(e, value) =>
                        setModalFilters((items) => ({
                          ...items,
                          internal: (value && 1) || null,
                        }))
                      }
                      label={t(`${translationPath}internal-filter`)}
                      singleChecked={(modalFilters.internal && true) || false}
                      translationPath={translationPath}
                    />
                    <CheckboxesComponent
                      wrapperClasses="mx-2"
                      idRef="externalRef"
                      onSelectedCheckboxChanged={(e, value) =>
                        setModalFilters((items) => ({
                          ...items,
                          external: (value && 1) || null,
                        }))
                      }
                      label={t(`${translationPath}external-filter`)}
                      singleChecked={(modalFilters.external && true) || false}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                  </div>
                )}
                {/* Candidate Name */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <SharedInputControl
                    title="candidate-name"
                    wrapperClasses="px-2"
                    isHalfWidth
                    placeholder="candidate-name"
                    stateKey="candidate_name"
                    editValue={modalFilters.candidate_name || ''}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        candidate_name: e.value,
                      }))
                    }
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isDisabled={loading}
                  />
                )}
                {/* Position Name */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <SharedInputControl
                    title="position-name"
                    wrapperClasses="px-2"
                    isHalfWidth
                    placeholder="position-name"
                    stateKey="position"
                    editValue={modalFilters.position || ''}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        position: e.value,
                      }))
                    }
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isDisabled={loading}
                  />
                )}
                {/* Candidate Number */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <SharedInputControl
                    title="candidate-number"
                    wrapperClasses="px-2"
                    isHalfWidth
                    placeholder="candidate-number"
                    stateKey="candidate_reference_number"
                    editValue={modalFilters.candidate_reference_number || ''}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        candidate_reference_number: e.value,
                      }))
                    }
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isDisabled={loading}
                  />
                )}

                {/* Application Number */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <SharedInputControl
                    title="applicant-number"
                    wrapperClasses="px-2"
                    isHalfWidth
                    placeholder="applicant-number"
                    stateKey="applicant_reference_number"
                    editValue={modalFilters.applicant_reference_number || ''}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        applicant_reference_number: e.value,
                      }))
                    }
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isDisabled={loading}
                  />
                )}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <SharedAutocompleteControl
                    isHalfWidth
                    searchKey="search"
                    isDisabled={loading}
                    initValues={vacancyStatuses}
                    stateKey="vacancy_status"
                    errorPath="vacancy_status"
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        vacancy_status: e.value || [],
                      }))
                    }
                    title="job-hiring-status"
                    editValue={modalFilters.vacancy_status}
                    placeholder="job-hiring-status"
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Assigned to Agency  */}
                {(currentTab === 'active' || currentTab === 'archive') && (
                  <div className={'w-50 px-2'}>
                    <SwitchComponent
                      idRef={'isWithAgencyAssignRef'}
                      isChecked={modalFilters.assigned_to_agency ?? false} // Default to false if undefined
                      label={t(`${translationPath}assigned-to-agency`)}
                      isFlexStart
                      onChange={(event, isChecked) => {
                        setModalFilters((prevFilters) => ({
                          ...prevFilters,
                          assigned_to_agency: isChecked,
                          agency_uuid: isChecked ? prevFilters.agency_uuid : [],
                        }));
                      }}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                {(currentTab === 'active' || currentTab === 'archive')
                  && modalFilters.assigned_to_agency && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    idRef="agencies"
                    title="agencies"
                    errorPath="agencies"
                    editValue={modalFilters.agency_uuid?.map((it) => it.uuid) || []}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        agency_uuid: e.value,
                      }))
                    }
                    placeholder="select-agency"
                    stateKey="source"
                    getOptionLabel={(option) =>
                      `${option.first_name || ''}${option.last_name || ''}`
                        || 'N/A'
                    }
                    getDataAPI={GetAllSetupsProviders}
                    getItemByIdAPI={getSetupsProvidersById}
                    parentTranslationPath={parentTranslationPath}
                    searchKey="search"
                    extraProps={{
                      type: ProfileSourcesTypesEnum.Agency.userType,
                      with_than:
                        (modalFilters?.agency_uuid?.length
                          && modalFilters.agency_uuid?.map((item) => item.user_uuid))
                        || null,
                    }}
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Priority */}
                {currentTab === 'approved' && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    searchKey="search"
                    title="priority"
                    stateKey="priority"
                    errorPath="priority"
                    editValue={modalFilters.priority?.map((it) => it.uuid) || []}
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        priority: e.value,
                      }))
                    }
                    placeholder="priority"
                    getDataAPI={GetAllSetupsPriority}
                    extraProps={{
                      with_than:
                        (modalFilters?.priority?.length
                          && modalFilters.priority?.map((item) => item.uuid))
                        || null,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Approval workflow */}
                {currentTab === 'approved' && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    searchKey="search"
                    title="approval-workflow-title"
                    stateKey="approval_workflow_title"
                    errorPath="approval_workflow_title"
                    editValue={
                      modalFilters.approval_workflow_title?.map((it) => it.uuid)
                      || []
                    }
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        approval_workflow_title: e.value,
                      }))
                    }
                    placeholder="approval-workflow-title"
                    getDataAPI={GetAllSetupsWorkflowsTemplates}
                    extraProps={{
                      type: WorkflowsTemplatesTypesEnum.JobRequisition.key,
                      with_than:
                        (modalFilters?.approval_workflow_title?.length
                          && modalFilters.approval_workflow_title?.map(
                            (item) => item.uuid,
                          ))
                        || null,
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.title[i18next.language] || option.title.en
                    }
                    type={DynamicFormTypesEnum.array.key}
                  />
                )}
                {/* Approved date */}
                {currentTab === 'approved' && (
                  <div className="w-50 px-2">
                    <Datepicker
                      value={modalFilters.approved_date || ''}
                      label={t('approved-date')}
                      inputPlaceholder="YYYY-MM-DD"
                      onChange={(date) => {
                        if (date !== 'Invalid date')
                          setModalFilters((items) => ({
                            ...items,
                            approved_date: date,
                          }));
                        else
                          setModalFilters((items) => ({
                            ...items,
                            approved_date: null,
                          }));
                      }}
                    />
                  </div>
                )}
                {/* Request date */}
                {currentTab === 'pending' && (
                  <div className="w-50 px-2">
                    <Datepicker
                      value={modalFilters.request_date || ''}
                      label={t('request-date')}
                      inputPlaceholder="YYYY-MM-DD"
                      onChange={(date) => {
                        if (date !== 'Invalid date')
                          setModalFilters((items) => ({
                            ...items,
                            request_date: date,
                          }));
                        else
                          setModalFilters((items) => ({
                            ...items,
                            request_date: null,
                          }));
                      }}
                    />
                  </div>
                )}
                {/* Pending by */}
                {currentTab === 'pending' && (
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    title="pending-by"
                    placeholder="select-employee"
                    stateKey="pending_by"
                    onValueChanged={(e) =>
                      setModalFilters((items) => ({
                        ...items,
                        pending_by: e.value,
                      }))
                    }
                    idRef="pending_by"
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }`
                    }
                    type={DynamicFormTypesEnum.array.key}
                    getDataAPI={GetAllSetupsUsers}
                    getItemByIdAPI={getSetupsUsersById}
                    parentTranslationPath={parentTranslationPath}
                    searchKey="search"
                    editValue={modalFilters.pending_by?.map((it) => it.uuid) || []}
                    extraProps={{
                      committeeType: 'all',
                      ...(modalFilters.pending_by?.length && {
                        with_than:
                          modalFilters.pending_by?.map((it) => it.uuid) || null,
                      }),
                    }}
                    // getDisabledOptions={(option) => !option.has_access}
                  />
                )}
                {/* Requester */}
                {(currentTab === 'approved' || currentTab === 'pending') && (
                  <>
                    <SharedAutocompleteControl
                      isHalfWidth
                      searchKey="search"
                      initValuesKey="key"
                      initValues={assigneeTypes}
                      stateKey="filter_user_type_requested_by"
                      onValueChanged={(e) => {
                        if (modalFilters.requested_by?.map((it) => it.uuid) || [])
                          setModalFilters((items) => ({
                            ...items,
                            requested_by: [],
                          }));
                        setModalFilters((items) => ({
                          ...items,
                          filter_user_type_requested_by: e.value,
                        }));
                      }}
                      title="requested-by-type"
                      editValue={modalFilters.filter_user_type_requested_by}
                      placeholder="select-type"
                      parentTranslationPath={parentTranslationPath}
                    />
                    {modalFilters.filter_user_type_requested_by && (
                      <>
                        {modalFilters.filter_user_type_requested_by
                          === AssigneeTypesEnum.Employee.key && (
                          <SharedAPIAutocompleteControl
                            isEntireObject
                            isHalfWidth
                            title="requested-by"
                            placeholder="select-employee"
                            stateKey="requested_by"
                            onValueChanged={(e) =>
                              setModalFilters((items) => ({
                                ...items,
                                requested_by: e.value,
                              }))
                            }
                            idRef="requested_by"
                            getOptionLabel={(option) =>
                              `${
                                option.first_name
                                && (option.first_name[i18next.language]
                                  || option.first_name.en)
                              }${
                                option.last_name
                                && ` ${
                                  option.last_name[i18next.language]
                                  || option.last_name.en
                                }`
                              }`
                            }
                            type={DynamicFormTypesEnum.array.key}
                            getDataAPI={GetAllSetupsUsers}
                            getItemByIdAPI={getSetupsUsersById}
                            parentTranslationPath={parentTranslationPath}
                            searchKey="search"
                            editValue={
                              modalFilters.requested_by?.map((it) => it.uuid) || []
                            }
                            extraProps={{
                              committeeType: 'all',
                              ...(modalFilters.requested_by?.length && {
                                with_than:
                                  modalFilters.requested_by?.map((it) => it.uuid)
                                  || null,
                              }),
                            }}
                            // getDisabledOptions={(option) => !option.has_access}
                          />
                        )}
                        {modalFilters.filter_user_type_requested_by
                          === AssigneeTypesEnum.User.key && (
                          <SharedAPIAutocompleteControl
                            isEntireObject
                            isHalfWidth
                            title="requested-by"
                            stateKey="requested_by"
                            placeholder="select-user"
                            onValueChanged={(e) =>
                              setModalFilters((items) => ({
                                ...items,
                                requested_by: e.value,
                              }))
                            }
                            type={DynamicFormTypesEnum.array.key}
                            editValue={
                              modalFilters.requested_by?.map((it) => it.uuid) || []
                            }
                            searchKey="search"
                            getDataAPI={GetAllSetupsUsers}
                            parentTranslationPath={parentTranslationPath}
                            getOptionLabel={(option) =>
                              `${
                                option.first_name
                                && (option.first_name[i18next.language]
                                  || option.first_name.en)
                              }${
                                option.last_name
                                && ` ${
                                  option.last_name[i18next.language]
                                  || option.last_name.en
                                }`
                              }`
                            }
                            extraProps={{
                              ...(modalFilters.requested_by?.length && {
                                with_than:
                                  modalFilters.requested_by?.map((it) => it.uuid)
                                  || null,
                              }),
                            }}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            }
            wrapperClasses="approvals-tracking-dialog-wrapper"
            isSaving={loading}
            isOpen={showFilterModal}
            isEdit={!!activeItem}
            onSubmit={(e) => {
              e.preventDefault();
              setPage(0);
              setFilter((items) => {
                const agency_id=modalFilters?.agency_uuid
                const updatedFilters = {
                  ...modalFilters };

                if (!modalFilters.assigned_to_agency)
                  delete updatedFilters.agency_uuid;
                return {
                  ...items,
                  page: 1,
                  filters: updatedFilters,
                };
              });
              window?.ChurnZero?.push([
                'trackEvent',
                'EVA REC - Filter manage jobs',
                'Filter manage jobs from EVA REC',
                1,
                {},
              ]);
              setShowFilterModal(false);
            }}
            onCloseClicked={() => setShowFilterModal(false)}
            onCancelClicked={() => setShowFilterModal(false)}
            parentTranslationPath={parentTranslationPath}
            saveIsDisabled={loading}
          />
        )}
        {isOpenJobRequisitionDialog && activeItem && (
          <JobRequisitionDialog
            isOpen={isOpenJobRequisitionDialog}
            onCloseClicked={() => setIsOpenJobRequisitionDialog(false)}
            onCancelClicked={() => setIsOpenJobRequisitionDialog(false)}
            parentTranslationPath={parentTranslationPath}
            requisitionDetails={activeItem}
          />
        )}
      </div>
    </>
  );
}

// React and reactstrap
import React, { useState, useMemo, useEffect } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
} from 'reactstrap';

// React boostrap
import ReactBSAlert from 'react-bootstrap-sweetalert';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ScheduleMeeting from '../../components/Views/ScheduleMeeting';
import LetterAvatar from '../../components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from '../../utils/constants/colorMaps';

// ToolTip From Material UI
import Tooltip from '@mui/material/Tooltip';

// Toast Notifications
import { useToasts } from 'react-toast-notifications';

// API url and functions
import { evameetAPI } from '../../api/evameet';

// Linkiing
import { Link, NavLink } from 'react-router-dom';

// Components
import Empty from '../../pages/recruiter-preference/components/Empty';
import TeamsModal from '../../components/Views/TeamsModal/TeamsModal';
import AddNoteModal from '../../components/Views/NotesModal/AddNoteModal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAllowedPermissionV2, showError } from '../../helpers';
import { EvaMeetPermissions } from '../../permissions';

const translationPath = '';
const parentTranslationPath = 'EvaMeet';

/**
 * ManageMeetingsTable is the main table where applications are listed upon clicking
 * the 'Manage an application' link in the sidebar
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManageMeetingsTable(props) {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const classes = useOverlayedAvatarStyles();
  const { type: tableType } = props;
  const [notesModal, setNotesModal] = useState(null);
  const [teamsModal, setTeamsModal] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [scheduleMeeting, setScheduleMeeting] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [load, setLoad] = useState(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const { paths, history } = props;

  /**
   * Cancel meeting Function
   */
  const cancelInterview = (e, row) => {
    evameetAPI
      .cancelScheduleInterview(row.uuid)
      .then(() => {
        addToast(t(`${translationPath}interview-cancelled-successfully`), {
          appearance: 'success',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        });
        // window.location.reload();
        props.getInterviewData();
      })
      .catch((error) => {
        showError(t(`${translationPath}canceled-interview-failed`), error);
      });
  };

  useEffect(() => {
    if (load)
      // addToast(t(`${translationPath}interview-updated-successfully`),
      //   {
      //   appearance: 'success',
      //   autoDismissTimeout: 7000,
      //   autoDismiss: true,
      // });
      props.getInterviewData();
  }, [load]);

  const confirmDelete = (e, row) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => {
          setDeleteAlert(null);
          cancelInterview(e, row);
        }}
        onCancel={() => setDeleteAlert(null)}
        showCancel
        confirmBtnBsStyle="danger"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="success"
        confirmBtnText={t(`${translationPath}yes-delete-it`)}
        btnSize=""
      >
        {t(`${translationPath}you-wont-be-able-to-revert-this`)}
      </ReactBSAlert>,
    );
  };

  /**
   * Defines how the columns are generated and their formats
   * @type {unknown}
   */
  const tableColumns = useMemo(
    () => [
      {
        dataField: 'title',
        text: t(`${translationPath}topic`),
        sort: true,
        formatter: (cellContent, row) => (
          <div>
            {props.type === 'upcoming' ? (
              <>
                {row?.media?.uuid ? (
                  <Link
                    to={`/recruiter/previous_meeting/${row.uuid}`}
                    className="text-gray"
                  >
                    {row.title}
                  </Link>
                ) : (
                  row.title
                )}
              </>
            ) : (
              <div>
                {row?.media?.uuid ? (
                  <Link
                    to={`/recruiter/previous_meeting/${row.uuid}`}
                    className="text-gray"
                  >
                    {row.title}
                  </Link>
                ) : (
                  row.title
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        dataField: 'recruiters',
        text: t(`${translationPath}team-members`),
        sort: true,
        formatter: (cellContent, row) => (
          <div className={classes.root}>
            {row.recruiters?.length > 0
              && row.recruiters.map((recruiter, i) => (
                <LetterAvatar
                  key={`recruiters${i + 1}`}
                  name={`${recruiter?.first_name} ${recruiter?.last_name}`}
                />

                // <img
                //   key={i}
                //   alt={recruiter?.first_name}
                //   className="avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
                //   src={
                //     recruiter?.profile_image?.url
                //     || require('assets/img/theme/team-1.jpg')
                //   }
                // />
              ))}
            {/* <div
                className="avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
                key="add"
                onClick={() => setTeamsModal(row.uuid)}
              >
                <i className="fa fa-plus" />
              </div> */}
          </div>
        ),
      },
      {
        dataField: 'guests',
        text: t(`${translationPath}guests`),
        sort: true,
        formatter: (cellContent, row) => (
          <div className="avatar-group">
            {row.new_candidates?.length > 0
              && row.new_candidates.map((guest, i) => (
                <img
                  key={`newCandidatesKey${i + 1}`}
                  alt={guest?.first_name}
                  className="avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
                  src={
                    guest?.profile_image?.url
                    || require('assets/img/theme/team-1.jpg')
                  }
                />
              ))}
          </div>
        ),
      },
      {
        dataField: 'created_at',
        text: t(`${translationPath}date-time`),
        sort: true,
        editable: false,
      },
      {
        dataField: 'id',
        text: t(`${translationPath}recorded-meeting`),
        sort: true,
        editable: false,
        headerAlign: 'center',
        hidden: props.type === 'upcoming',
        formatter: (cellContent, row) => (
          <>
            <div className="align-items-center text-center">
              {row?.media?.uuid ? (
                <Tooltip title="Recorded Meeting">
                  <div>
                    {getIsAllowedPermissionV2({
                      permissions,
                      defaultPermissions: EvaMeetPermissions,
                    }) ? (
                        <NavLink
                          to={`/recruiter/previous_meeting/${row.uuid}`}
                          className="text-gray"
                        >
                          <i className="fas fa-video fa-2x" />
                        </NavLink>
                      ) : (
                        <div>
                          <i
                            className="fas fa-video fa-2x"
                            style={{ cursor: 'not-allowed' }}
                          />
                        </div>
                      )}
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="No Recorded Meeting">
                  <i className="fas fa-video-slash fa-2x" />
                </Tooltip>
              )}
            </div>
          </>
        ),
      },
      {
        editable: false,
        dataField: 'actions',
        text: t(`${translationPath}actions`),
        headerClasses: 'text-right pr-5',
        isDummyField: true,
        align: 'right',
        formatter: (cellContent, row) => (
          <div className="d-flex justify-content-end align-items-center pr-4">
            <UncontrolledDropdown>
              <DropdownToggle className="btn btn-link bg-transparent border-0 rounded-circle ellipsis-icon-button">
                <i className="fa fa-ellipsis-h" />
              </DropdownToggle>
              <DropdownMenu end>
                {/* <DropdownItem
                    className="dropdown-item shadow-none"
                    disabled={!Can('edit', 'meetings')}
                    onClick={() => setTeamsModal(row.uuid)}
                  >
                    <i className="fas fa-plus-circle mr-3" />
                    Add Team
                  </DropdownItem>
                  <DropdownItem
                    className="dropdown-item shadow-none"
                    disabled={!Can('edit', 'meetings')}
                    onClick={() => setGuestsModal(row.uuid)}
                  >
                    <i className="fas fa-plus-circle mr-3" />
                    Add Guest
                  </DropdownItem> */}
                <div>
                  <DropdownItem
                    className="dropdown-item shadow-none"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId: EvaMeetPermissions.UpdateEvaMeet.key,
                      })
                    }
                    onClick={() => setScheduleMeeting(row.uuid)}
                  >
                    <i className="fa fa-edit mr-3" />
                    {t(`${translationPath}edit`)}
                  </DropdownItem>
                </div>
                <DropdownItem
                  className="dropdown-item shadow-none"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: EvaMeetPermissions.DeleteEvaMeet.key,
                    })
                  }
                  onClick={(e) => confirmDelete(e, row)}
                >
                  <i className="fas fa-trash mr-3" />
                  {t(`${translationPath}cancel-meeting`)}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        ),
      },
    ],
    [tableType],
  );

  /**
   * Return JSX
   */
  return (
    <Row>
      {deleteAlert}
      {dialog}
      {notesModal && (
        <AddNoteModal
          type_panel="ats"
          isOpen={notesModal}
          onClose={() => {
            setNotesModal(null);
            history.replace({ ...history.location, state: {} });
          }}
          uuid={notesModal}
          paths={paths}
          {...props}
        />
      )}
      {scheduleMeeting && (
        <ScheduleMeeting
          // relation_uuid={props.match.params.id}
          relation={1}
          timezones={props.timezones || []}
          data={{}}
          isOpen
          closeModal={() => {
            setScheduleMeeting(null);
          }}
          toggle={props.closeDialog}
          // We only schedule a meeting for the selected candidate
          selectedCandidates={[]}
          evaMeet
          uuid={scheduleMeeting}
          getData={props.getInterviewData}
          load={() => setLoad(true)}
          from_feature={props?.from_feature || ''}
        />
      )}
      {teamsModal && (
        <TeamsModal
          {...props}
          isOpen={teamsModal}
          onClose={() => {
            setTeamsModal(null);
          }}
          match={{ params: { id: teamsModal } }}
          uuid={teamsModal}
          type="ATS"
        />
      )}
      <div className="col">
        <div>
          {props.data.length > 0 ? (
            <ToolkitProvider
              data={props.data}
              keyField="id"
              columns={tableColumns}
              search
            >
              {(tableProps) => (
                <div className="table-responsive list-template-table">
                  {!props.data.length ? (
                    <Empty />
                  ) : (
                    <BootstrapTable
                      {...tableProps.baseProps}
                      bootstrap4
                      striped
                      bordered={false}
                      remote
                      onTableChange={() => {}}
                      pagination={paginationFactory({
                        page: props.page,
                        prePageText: (
                          <span style={{ width: 'fit-content' }}>
                            <i className="fa fa-angle-double-left" />
                            {t(`${translationPath}previous-page`)}
                          </span>
                        ),
                        nextPageText: (
                          <span style={{ width: 'fit-content' }}>
                            {t(`${translationPath}next-page`)}
                            <i className="fa fa-angle-double-right" />
                          </span>
                        ),
                        alwaysShowAllBtns: true,
                        showTotal: true,
                        totalSize: props.totalSize,
                        withFirstAndLast: false,
                        sizePerPage: props.sizePerPage,
                        onPageChange: (page) => {
                          if (props.onPageChange) props.onPageChange(page);
                        },
                      })}
                    />
                  )}
                </div>
              )}
            </ToolkitProvider>
          ) : (
            <Empty message={t(`${translationPath}no-meetings-found`)} />
          )}
        </div>
      </div>
    </Row>
  );
}

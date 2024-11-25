// React and reactstrap
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'reactstrap';

// React boostrap
import ReactBSAlert from 'react-bootstrap-sweetalert';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { ToastProvider } from 'react-toast-notifications';
import LabeledCheckbox from 'components/Inputs/LabeledCheckbox';

// import avatar for teams portrait

// Linking
import { Link } from 'react-router-dom';

import LetterAvatar from 'components/Elevatus/LetterAvatar';
// Axios

// API url and functions
import urls from 'api/urls';
import ReactPaginate from 'react-paginate';
import { Checkbox } from '@mui/material';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { SharedAutocompleteControl } from '../../setups/shared/controls';
import { DeleteJob } from '../services/api/manageJob';

// Components
import CopyModal from '../../../components/Elevatus/CopyModal';
import Empty from '../../recruiter-preference/components/Empty';
import TeamsModal from '../../../components/Views/TeamsModal/TeamsModal';
import AddNoteModal from '../../../components/Views/NotesModal/AddNoteModal';
import { useOverlayedAvatarStyles } from '../../../utils/constants/colorMaps';
import { JobHiringStatusesEnum, PostVacancyEnum } from '../../../enums';
import ButtonBase from '@mui/material/ButtonBase';
import { PopoverComponent, TooltipsComponent } from '../../../components';
import { getIsAllowedPermissionV2, GlobalHistory } from '../../../helpers';
import { useSelector } from 'react-redux';
import {
  CreateAnApplicationPermissions,
  ManageApplicationsPermissions,
} from 'permissions';
import { JobVacancyStatusDialog } from './dialogs/JobVacancyStatus.Dialog';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';

/**
 * ManageJobTable is the main table where applications are listed upon clicking
 * the 'Manage an application' link in the sidebar
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManageJobTable(props) {
  const { t } = useTranslation(parentTranslationPath);
  const classes = useOverlayedAvatarStyles();
  const { type: tableType, onChangeTableType } = props;
  const [selectedRow, setSelectedRow] = useState(null);
  const [postVacancyEnum] = useState(() =>
    Object.values(PostVacancyEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [loading, setLoading] = useState(false);
  const [notesModal, setNotesModal] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [teamsModal, setTeamsModal] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [copyModal, showCopyModal] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [copyLink, setCopyLink] = useState(null);
  const [jobVacancyState, setJobVacancyState] = useState({ isOpenDialog: false });
  const { paths, history } = props;
  const userReducer = useSelector((state) => state?.userReducer);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  /**
   * @param event - the event of attached item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the popover
   */
  const popoverToggleHandler = useCallback(
    (row) => (event) => {
      setSelectedRow(row);
      setPopoverAttachedWith((event && event.currentTarget) || null);
    },
    [],
  );

  /** Confirm delete/archive/active item */
  const confirmToggleType = (uuid) => {
    const selectedUuid = props.isBulkArchive ? uuid : [uuid];

    setDialog(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() =>
          deleteJob(
            selectedUuid,
            `${
              tableType === 'active'
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
          tableType === 'active'
            ? t(`${translationPath}archive`)
            : t(`${translationPath}active`)
        }`}
        btnSize=""
      >
        {t(`${translationPath}this-job-will-be`)}{' '}
        {tableType === 'active'
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
            tableType === 'active'
              ? t(`${translationPath}archived`)
              : t(`${translationPath}activated`)
          }
          onConfirm={() => {
            props.setSelectedRows([]);
            props.setIsBulkArchive(false);
            onChangeTableType();
          }}
          onCancel={closeDialog}
          confirmBtnBsStyle="primary"
          confirmBtnText={t(`${translationPath}ok`)}
          btnSize=""
        >
          {tableType === 'active'
            ? t(`${translationPath}archived-successfully`)
            : t(`${translationPath}activated-successfully`)}
        </ReactBSAlert>,
      );
    });
  };

  const closeDialog = () => {
    props.setIsBulkArchive(false);
    setDialog(null);
  };

  const handleCheckBoxChange = useCallback(
    (rowUuid) => {
      props.setSelectedRows((items) => {
        const rowIndex = items.findIndex((el) => el === rowUuid);

        if (rowIndex !== -1) items.splice(rowIndex, 1);
        else items.push(rowUuid);

        return [...items];
      });
    },
    [props],
  );
  const jobHiringStatus = useCallback((status) => {
    const localeStatus = Object.values(JobHiringStatusesEnum).find(
      (item) => item.key === status,
    );
    return localeStatus;
  }, []);
  /**
   * Defines how the columns are generated and their formats
   * @type {unknown}
   */
  const tableColumns = useMemo(
    () => [
      tableType === 'active' && {
        text: t(`${translationPath}select`),
        sort: false,
        formatExtraData: props.selectedRows.length,
        formatter: (cellContent, row) => (
          <div className="eva-rec-table-checkbox-wrapper">
            <Checkbox
              onChange={() => handleCheckBoxChange(row.uuid)}
              checked={
                (props.selectedRows.find((el) => el === row.uuid) && true) || false
              }
            />
          </div>
        ),
      },
      {
        dataField: 'title',
        text: t(`${translationPath}title`),
        sort: true,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => (
          <TooltipsComponent
            title={row.title}
            translationPath=""
            contentComponent={
              <span>
                <Link
                  to={`/recruiter/job/manage/pipeline/${row.uuid}`}
                  className="text-gray"
                >
                  {row.title.length > 19
                    ? `${row.title.substring(0, 20)}...`
                    : row.title}
                </Link>
              </span>
            }
          />
        ),
      },
      {
        text: t(`${translationPath}location`),
        sort: false,
        formatExtraData: props.selectedRows.length,
        formatter: (cellContent, row) =>
          row.location ? <span>{row.location}</span> : '-',
      },
      {
        text: t(`${translationPath}salary-range`),
        sort: false,
        formatExtraData: props.selectedRows.length,
        formatter: (cellContent, row) =>
          row.salary_range ? <span>{row.salary_range}</span> : '-',
      },
      {
        text: t(`${translationPath}position-code`),
        sort: true,
        formatExtraData: props.selectedRows.length,
        formatter: (cellContent, row) =>
          row.position_code ? <span>{row.position_code}</span> : '-',
      },
      {
        text: t(`${translationPath}position-code-alias`),
        sort: true,
        formatExtraData: props.selectedRows.length,
        formatter: (cellContent, row) =>
          row.position_code ? <span>{row.position_code_alias}</span> : '-',
      },
      {
        dataField: 'position_name',
        text: t(`${translationPath}position-name`),
        sort: true,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) =>
          (row?.position_name?.[i18next.language] || row?.position_name?.en) && (
            <TooltipsComponent
              title={
                row?.position_name?.[i18next.language] || row?.position_name?.en
              }
              translationPath=""
              contentComponent={
                <span>
                  {(row?.position_name[i18next.language] || row.position_name.en)
                    .length > 19
                    ? `${(
                      row?.position_name[i18next.language] || row.position_name.en
                    ).substring(0, 20)}...`
                    : row?.position_name[i18next.language] || row.position_name.en}
                </span>
              }
            />
          ),
      },
      {
        text: t(`${translationPath}job-hiring-status`),
        sort: false,
        formatExtraData: props.selectedRows.length,
        formatter: (cellContent, row) =>
          row?.vacancy_status ? (
            <span className={jobHiringStatus(row?.vacancy_status)?.color || ''}>
              {t(`${translationPath}${jobHiringStatus(row?.vacancy_status)?.value}`)}
            </span>
          ) : (
            '-'
          ),
      },
      {
        dataField: 'recruiters',
        text: t(`${translationPath}team`),
        sort: true,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => (
          <div className={classes.root}>
            {row.recruiters?.length > 0
              && row.recruiters.map((recruiter, i) => (
                <LetterAvatar
                  key={i}
                  name={`${recruiter?.first_name} ${recruiter?.last_name}`}
                />
                // <Avatar>{recruiter?.first_name[0]}</Avatar>
              ))}
            {tableType === 'active' && (
              <div
                className="avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
                // style={{ zIndex: 1000 }}
                key="add"
                role="button"
                tabIndex={0}
                onKeyUp={() => {}}
                onClick={() => setTeamsModal(row.uuid)}
                style={{
                  pointerEvents: !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageApplicationsPermissions.MangeTeams.key,
                  })
                    ? 'none'
                    : '',
                }}
              >
                <i className="fa fa-plus" style={{ zIndex: 0 }} />
              </div>
            )}
          </div>
        ),
      },
      {
        dataField: 'created_at',
        text: t(`${translationPath}date-posted`),
        sort: true,
        editable: false,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) =>
          moment(row.created_at).locale(i18next.language).fromNow(),
      },
      {
        dataField: 'category',
        text: t(`${translationPath}category`),
        sort: true,
        editable: false,
        formatExtraData: i18next.language,
      },
      {
        dataField: 'new_candidates',
        text: t(`${translationPath}new`),
        sort: true,
        editable: false,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => <>{row?.new_candidates || 0}</>,
      },
      {
        dataField: 'total_candidates',
        text: t(`${translationPath}total`),
        sort: true,
        editable: false,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => <>{row?.total_candidates || 0}</>,
      },
      ...(userReducer
      && userReducer.results
      && userReducer.results.user
      && !userReducer.results.user.is_provider
        ? [
          {
            dataField: 'status',
            text: t(`${translationPath}status`),
            isDummyField: true,
            editable: false,
            hidden: tableType !== 'active',
            formatExtraData: i18next.language,
            formatter: (cellContent, row, rowIndex) => (
              <LabeledCheckbox
                id={`status-${rowIndex}`}
                ats
                checked={row.is_published}
                onChange={() =>
                  props.handleStatusToggle(row.uuid, !row.is_published, rowIndex)
                }
              />
            ),
          },
          {
            dataField: 'is_external',
            text: t(`${translationPath}internal-external`),
            isDummyField: false,
            editable: false,
            formatExtraData: i18next.language,
            formatter: (cellContent, row, rowIndex) => (
              <SharedAutocompleteControl
                editValue={
                  row.is_external && row.is_internal
                    ? PostVacancyEnum.both.key
                    : !row.is_external && row.is_internal
                      ? PostVacancyEnum.internal.key
                      : PostVacancyEnum.external.key
                }
                placeholder={t(`${translationPath}internal-and-external`)}
                stateKey="internal-and-external"
                onValueChanged={(value) =>
                  props.handleExternalInternalToggle(
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
                disabledOptions={(option) =>
                  option.key === PostVacancyEnum.both.key
                }
              />
            ),
          },
          {
            editable: false,
            dataField: 'actions',
            text: t(`${translationPath}action`),
            isDummyField: true,
            align: 'right',
            formatExtraData: i18next.language,
            formatter: (cellContent, row) => (
              <div className="d-flex align-items-center">
                <ButtonBase
                  className="btns-icon theme-transparent"
                  onClick={popoverToggleHandler(row)}
                >
                  <span className="fas fa-ellipsis-h" />
                </ButtonBase>
              </div>
            ),
          },
        ]
        : []),
    ],
    [
      tableType,
      t,
      props,
      handleCheckBoxChange,
      classes.root,
      postVacancyEnum,
      popoverToggleHandler,
      userReducer,
    ],
  );
  const onChangeJobVacancyStatus = (vacancy_status, job_uuid) => {
    const rowIndex = (props.data || []).findIndex((el) => el.uuid === job_uuid);
    if (rowIndex !== -1 && props?.onChangeVacancyStatus) {
      props?.onChangeVacancyStatus(rowIndex, vacancy_status);
      popoverToggleHandler(null)();
    }
  };

  useEffect(() => {
    if (props.isBulkArchive) confirmToggleType(props.selectedRows);
  }, [props.isBulkArchive, props.selectedRows]);
  /**
   * Return JSX
   */
  return (
    <>
      <ToastProvider placement="top-center">
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
            paths={paths}
            {...props}
          />
        )}
        {!!teamsModal && (
          <TeamsModal
            {...props}
            isOpen={!!teamsModal}
            onClose={() => {
              setTeamsModal(null);
            }}
            match={{ params: { id: teamsModal } }}
            uuid={teamsModal}
            getAllActive={props.getAllActive}
            type="ATS"
          />
        )}
        <CopyModal
          {...props}
          url={copyLink}
          discription=""
          isOpen={copyModal}
          onClose={() => showCopyModal(false)}
          title={t(`${translationPath}copy-application-link`)}
        />
        {jobVacancyState.isOpenDialog && (
          <JobVacancyStatusDialog
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            isOpen={jobVacancyState.isOpenDialog}
            jobData={selectedRow}
            onSave={onChangeJobVacancyStatus}
            isOpenChanged={() => {
              setJobVacancyState({ isOpenDialog: false });
            }}
          />
        )}
        <PopoverComponent
          idRef="tableActionsPopoverRef"
          attachedWith={popoverAttachedWith}
          handleClose={() => popoverToggleHandler(null)()}
          popoverClasses="stages-display-popover"
          component={
            <div className="d-flex-column p-2">
              {tableType === 'active' && (
                <>
                  <ButtonBase
                    className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          ManageApplicationsPermissions.NotesEvaRecApplication.key,
                      })
                    }
                    onClick={() => {
                      setNotesModal(selectedRow?.uuid);
                      setShowNotesModal(true);
                    }}
                  >
                    <span className="fas fa-notes-medical" />
                    <span className="px-2">{t(`${translationPath}note`)}</span>
                  </ButtonBase>
                  <ButtonBase
                    className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          CreateAnApplicationPermissions.DeleteEvaRecApplication.key,
                      })
                    }
                    onClick={() => {
                      confirmToggleType(selectedRow?.uuid);
                    }}
                  >
                    <span className="fas fa-paste" />
                    <span className="px-2">{t(`${translationPath}archive`)}</span>
                  </ButtonBase>
                </>
              )}
              {tableType === 'archive' && (
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageApplicationsPermissions.ReActivateJob.key,
                    })
                  }
                  onClick={() => {
                    confirmToggleType(selectedRow?.uuid);
                  }}
                >
                  <span className="fas fa-paste" />
                  <span className="px-2">{t(`${translationPath}activate`)}</span>
                </ButtonBase>
              )}
              {tableType === 'active' && (
                <>
                  <ButtonBase
                    className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId: ManageApplicationsPermissions.MangeTeams.key,
                      })
                    }
                    onClick={() => {
                      setTeamsModal(selectedRow?.uuid);
                    }}
                  >
                    <span className="fas fa-plus-circle" />
                    <span className="px-2">{t(`${translationPath}add-team`)}</span>
                  </ButtonBase>
                  <ButtonBase
                    className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          CreateAnApplicationPermissions.UpdateEvaRecApplication.key,
                      })
                    }
                    onClick={() => {
                      localStorage.setItem('job_uuid', selectedRow?.uuid);
                      GlobalHistory.push(
                        `/recruiter/job/manage/edit/${selectedRow?.uuid}`,
                      );
                    }}
                  >
                    <span className="fas fa-edit" />
                    <span className="px-2">{t(`${translationPath}edit`)}</span>
                  </ButtonBase>
                  <ButtonBase
                    className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                    disabled={
                      !selectedRow?.is_published
                      || !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          CreateAnApplicationPermissions.AddEvaRecApplication.key,
                      })
                    }
                    onClick={() => {
                      showCopyModal(true);
                      setCopyLink(selectedRow?.job_url);
                    }}
                  >
                    <span className="fas fa-briefcase" />
                    <span className="px-2">
                      {t(`${translationPath}application-link`)}
                    </span>
                  </ButtonBase>
                  <ButtonBase
                    className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                    disabled={selectedRow && !selectedRow?.job_requisition_uuid}
                    onClick={() => {
                      if (props?.openRequisitionDialog)
                        props.openRequisitionDialog(selectedRow);
                    }}
                  >
                    <span className="far fa-eye" />
                    <span className="px-2">{t(`Shared:view`)}</span>
                  </ButtonBase>
                </>
              )}
              <ButtonBase
                className="btns theme-transparent mx-0 miw-0 fj-start c-gray-primary"
                disabled={
                  selectedRow?.vacancy_status
                    === JobHiringStatusesEnum.Canceled.key
                  || !getIsAllowedPermissionV2({
                    permissions,
                    permissionId:
                      ManageApplicationsPermissions.UpdateVacancyStatus.key,
                  })
                }
                onClick={() => {
                  setJobVacancyState({ isOpenDialog: true });
                }}
              >
                <span className="fas fa-edit" />
                <span className="px-2">{t(`${translationPath}update-status`)}</span>
              </ButtonBase>
            </div>
          }
        />
        <Row>
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
                    <>
                      <div className="table-responsive list-template-table">
                        {!props.data.length ? (
                          <Empty />
                        ) : (
                          <Col xl={12} className="my-4 pr-lg-2 pr-md-2">
                            <BootstrapTable
                              {...tableProps.baseProps}
                              bootstrap4
                              striped
                              bordered={false}
                              // pagination={paginationFactory({
                              //   page: 1,
                              //   prePageText: (
                              //     <span style={{ width: 'fit-content' }}>
                              //       <i className="fa fa-angle-double-left" />
                              //       Previous Page
                              //     </span>
                              //   ),
                              //   nextPageText: (
                              //     <span style={{ width: 'fit-content' }}>
                              //       Next Page
                              //       <i className="fa fa-angle-double-right" />
                              //     </span>
                              //   ),
                              //   alwaysShowAllBtns: true,
                              //   showTotal: true,
                              //   withFirstAndLast: false,
                              //   sizePerPage: props.sizePerPage,
                              //   onPageChange: (page) => {
                              //     if (props.onPageChange) props.onPageChange(page);
                              //   },
                              // })}
                            />

                            <ReactPaginate
                              previousLabel={t(`${translationPath}previous-page`)}
                              nextLabel={t(`${translationPath}next-page`)}
                              breakLabel="..."
                              breakClassName="break-me"
                              pageCount={Math.ceil(props.total / props.sizePerPage)}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={props.handlePageClick}
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
                              forcePage={props.page}
                            />
                          </Col>
                        )}
                      </div>
                    </>
                  )}
                </ToolkitProvider>
              ) : (
                <Empty message="No Jobs Found" />
              )}
            </div>
          </div>
        </Row>
      </ToastProvider>
    </>
  );
}

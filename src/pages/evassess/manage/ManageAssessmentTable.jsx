/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
import React, { useMemo, useState, useCallback } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { ToastProvider } from 'react-toast-notifications';

import { Link } from 'react-router-dom';

// this should be removed, cause there is laredy
// inline style and Actions should be just a regular div.
// but first it has to be tested on the table full of data
import styled from 'styled-components';
import LetterAvatar from 'components/Elevatus/LetterAvatar';

// Permissions
import { Can } from 'utils/functions/permissions';
import urls from 'api/urls';
import ReactPaginate from 'react-paginate';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import Empty from '../../recruiter-preference/components/Empty';
import TeamsModal from '../../../components/Views/TeamsModal/TeamsModal';
import AddNoteModal from '../../../components/Views/NotesModal/AddNoteModal';
import CopyModal from '../../../components/Elevatus/CopyModal';
import { useOverlayedAvatarStyles } from '../../../utils/constants/colorMaps';
import { EnToArUni, HttpServices, getIsAllowedPermissionV2 } from '../../../helpers';
import {
  ManageAssessmentsPermissions,
  CreateAssessmentPermissions,
} from '../../../permissions';

const Actions = styled.div`
  display: flex;
`;
const translationPath = 'ManageAssessmentTableComponent.';
const ManageAssessmentTable = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  const classes = useOverlayedAvatarStyles();
  const { type } = props;
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [loading, setLoading] = useState(false);
  const [notesModal, setNotesModal] = useState(null);
  const [teamsModal, setTeamsModal] = useState(null);
  const [copyModal, showCopyModal] = useState(false);
  const [copyLink, setCopyLink] = useState(null);

  const archivedAssessment = async (uuid) => {
    setLoading(true);
    await HttpServices.delete(`${urls.evassess.ASSESSMENT_WRITE}`, {
      data: {
        uuid,
      },
    }).then(() => {
      setDoneModal(true);
      setLoading(false);
      setUUID([]);
      props.setSureModal(false);
      props.setIsBulkArchived(false);
      props.setSelectedRows([]);
    });
  };

  const activateAssessment = async (uuid) => {
    setLoading(true);
    await HttpServices.put(`${urls.evassess.ACTIVE}`, {
      uuid,
    }).then(() => {
      setDoneModal(true);
      props.setSureModal(false);
      setLoading(false);
    });
  };

  const [openDoneModal, setDoneModal] = useState(false);
  const [uuid, setUUID] = useState([]);

  const cancelModal = () => {
    props.setSureModal(false);
    props.setIsBulkArchived(false);
    setDoneModal(false);
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

  const tableColumns = useMemo(
    () => [
      type === 'active' && {
        text: t(`${translationPath}select`),
        sort: false,
        formatter: (cellContent, row) => (
          <div className="eva-ssess-table-checkbox-wrapper">
            <Checkbox
              onChange={() => handleCheckBoxChange(row.uuid)}
              checked={props.selectedRows.find((item) => item === row.uuid)}
            />
          </div>
        ),
      },
      {
        dataField: 'title',
        text: t(`${translationPath}title`),
        sort: true,
        formatter: (cellContent, row) => (
          <Link
            to={`/recruiter/assessment/manage/pipeline/${row.uuid}`}
            className="text-gray"
          >
            {row.title}
          </Link>
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
                  key={`recruitersList${i + 1}`}
                  name={`${recruiter?.first_name} ${recruiter?.last_name}`}
                />
                // <Avatar>{recruiter?.first_name[0]}</Avatar>
              ))}
            {type === 'active' && (
              <ButtonBase
                className="btns-icon theme-transparent avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
                key="add"
                onClick={() => setTeamsModal(row.uuid)}
                style={{
                  pointerEvents: !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.MangeTeams.key,
                  })
                    ? 'none'
                    : '',
                }}
              >
                <i className="fa fa-plus" style={{ zIndex: 0 }} />
              </ButtonBase>
            )}
          </div>
        ),
      },
      {
        dataField: 'deadline',
        text: t(`${translationPath}deadline`),
        sort: true,
        editable: false,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => row.deadline,
      },
      {
        dataField: 'candidates',
        text: t(`${translationPath}total`),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <>
            {`${
              row && row.total_candidates
                ? EnToArUni(row.total_candidates)
                : EnToArUni(0)
            } `}
          </>
        ),
      },
      {
        dataField: 'category',
        text: t(`${translationPath}category`),
        sort: true,
        editable: false,
        // formatter: (cellContent, row) => (
        //   <React.Fragment>{`${
        //     row && row.new_candidates ? row.new_candidates : 0
        //   } `}</React.Fragment>
        // ),
      },
      {
        dataField: 'is_published',
        text: t(`${translationPath}privacy`),
        sort: true,
        editable: false,
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => (
          <>
            {`${
              row && row.privacy === 1
                ? t(`${translationPath}public`)
                : t(`${translationPath}private`)
            } `}
          </>
        ),
      },
      {
        editable: false,
        dataField: 'actions',
        text: t(`${translationPath}actions`),
        headerClasses: 'pl-7-reversed',
        isDummyField: true,
        align: 'right',
        formatExtraData: i18next.language,
        formatter: (cellContent, row) => (
          <Actions
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingRight: 20,
            }}
          >
            <UncontrolledDropdown>
              <DropdownToggle
                className="btn btn-link bg-transparent border-0 rounded-circle"
                style={{
                  color: '#6d737a',
                  width: 30,
                  height: 30,
                  fontSize: '20px',
                  margin: 0,
                  padding: 0,
                }}
              >
                <i className="fa fa-ellipsis-h" />
              </DropdownToggle>
              <DropdownMenu end>
                {type === 'active' && (
                  <DropdownItem
                    className="dropdown-item shadow-none"
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId:
                          ManageAssessmentsPermissions.NotesEvaSsessApplication.key,
                      })
                    }
                    onClick={() => setNotesModal(row.uuid)}
                  >
                    <i className="fas fa-notes-medical mr-3-reversed" />

                    {t(`${translationPath}note`)}
                  </DropdownItem>
                )}
                <DropdownItem
                  className="dropdown-item shadow-none"
                  disabled={
                    // !Can('edit', 'video_assessment')
                    // || !Can('create', 'video_assessment')
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        CreateAssessmentPermissions.UpdateEvaSsessApplication.key,
                    })
                  }
                  onClick={() => {
                    props.setSureModal(true);
                    setUUID([row.uuid]);
                  }}
                >
                  <i className="fas fa-paste mr-3-reversed" />
                  {type === 'active'
                    ? t(`${translationPath}archive`)
                    : t(`${translationPath}activate`)}
                </DropdownItem>
                {type === 'active' && (
                  <DropdownItem
                    className="dropdown-item shadow-none"
                    disabled={
                      // !Can('edit', 'video_assessment')
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId: ManageAssessmentsPermissions.MangeTeams.key,
                      })
                    }
                    onClick={() => setTeamsModal(row.uuid)}
                  >
                    <i className="fas fa-plus-circle mr-3-reversed" />
                    {t(`${translationPath}add-team`)}
                  </DropdownItem>
                )}
                {type === 'active' && (
                  <>
                    <DropdownItem
                      className="dropdown-item shadow-none"
                      disabled={
                        // !Can('edit', 'video_assessment')
                        !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                            CreateAssessmentPermissions.UpdateEvaSsessApplication
                              .key,
                        }) || +row.total_candidates
                      }
                      onClick={() => {
                        window.open(
                          `/recruiter/assessment/edit/${row.uuid}`,
                          '_self',
                        );
                      }}
                    >
                      <i style={{ margin: '0 !important' }} className="fa fa-edit" />
                      {t(`${translationPath}edit`)}
                    </DropdownItem>

                    <DropdownItem
                      className="dropdown-item shadow-none"
                      disabled={
                        !Can('edit', 'video_assessment')
                        || props.remainingCreditsLimit === 0
                      }
                      onClick={() => {
                        showCopyModal(true);
                        setCopyLink(row.invitation_url);
                      }}
                    >
                      <i
                        style={{
                          margin: '0 !important',
                          paddingRight: i18next.language === 'ar' ? '1rem' : '0',
                        }}
                        className="far fa-clone"
                      />
                      <span>{t(`${translationPath}invitation-link`)}</span>
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Actions>
        ),
      },
    ],
    [classes.root, handleCheckBoxChange, permissions, props, t, type],
  );

  return (
    <>
      <ToastProvider placement="top-center">
        {(props.openSureModal || props.isBulkArchived) && (
          <ReactBSAlert
            warning
            style={{ display: 'block' }}
            title={t(`${translationPath}confirm-description`)}
            onConfirm={() => {
              if (props.isBulkArchived) archivedAssessment(props.selectedRows);
              else if (props.type === 'active') archivedAssessment(uuid);
              else activateAssessment(uuid);
            }}
            onCancel={cancelModal}
            showCancel
            confirmBtnBsStyle="success"
            cancelBtnText={t(`${translationPath}cancel`)}
            cancelBtnBsStyle="danger"
            confirmBtnText={t(
              `${translationPath}yes-${
                props.type === 'active' ? 'archive' : 'active'
              }`,
            )}
            disabled={loading}
            btnSize=""
          >
            {t(
              `${translationPath}this-assessment-will-be-${
                props.type === 'active' ? 'archived' : 'active'
              }`,
            )}
            <br />
            {loading && <i className="fas fa-circle-notch fa-spin" />}
          </ReactBSAlert>
        )}
        {openDoneModal && (
          <ReactBSAlert
            success
            style={{ display: 'block' }}
            title={
              props.type === 'active'
                ? t(`${translationPath}archived`)
                : t(`${translationPath}activated`)
            }
            onConfirm={() => props.getAllActive()}
            onCancel={cancelModal}
            confirmBtnBsStyle="primary"
            confirmBtnText={t(`${translationPath}ok`)}
            btnSize=""
          >
            {props.type === 'active'
              ? t(`${translationPath}archived-successfully`)
              : t(`${translationPath}activated-successfully`)}
          </ReactBSAlert>
        )}
        {notesModal && (
          <AddNoteModal
            type_panel="prep_assessment"
            {...props}
            isOpen={notesModal}
            onClose={() => {
              setNotesModal(null);
            }}
            uuid={notesModal}
          />
        )}
        {teamsModal && (
          <TeamsModal
            {...props}
            isOpen={teamsModal}
            onClose={() => {
              setTeamsModal(null);
            }}
            getAllActive={props.getAllActive}
            match={{ params: { id: teamsModal } }}
          />
        )}
        <CopyModal
          {...props}
          isOpen={copyModal}
          onClose={() => showCopyModal(false)}
          title={t(`${translationPath}copy-assessment-invitation-link`)}
          discription=""
          url={copyLink}
        />
        <div className="px-2 eva-ssess-checkbox-wrapper">
          {props.data.length > 0 ? (
            <ToolkitProvider
              data={props.data}
              keyField="id"
              columns={tableColumns}
              search
            >
              {(tableProps) => (
                <>
                  {/* <div
                      id='datatable-basic_filter'
                      className='dataTables_filter px-4 float-right'
                    >
                      <SearchBar
                        className='form-control-sm'
                        placeholder='Search By Title'
                        {...tableProps.searchProps}
                      />
                    </div> */}

                  <div className="table-responsive overflow-visible list-assessment-table">
                    {!props.data.length ? (
                      <Empty />
                    ) : (
                      <div className="my-4 px-2">
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
                          //       &nbsp;&nbsp;Previous Page
                          //     </span>
                          //   ),
                          //   nextPageText: (
                          //     <span style={{ width: 'fit-content' }}>
                          //       Next Page&nbsp;&nbsp;
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
                          // sizePerPageRenderer: ({ onSizePerPageChange }) => (
                          //   <div
                          //     className='dataTables_length'
                          //     id='datatable-basic_length'
                          //   >
                          //     <label>
                          //       Show{' '}
                          //       {
                          //         <select
                          //           name='datatable-basic_length'
                          //           aria-controls='datatable-basic'
                          //           className='form-control form-control-alternative'
                          //           onChange={(e) =>
                          //             onSizePerPageChange(e.target.value)
                          //           }
                          //         >
                          //           <option value='10'>10</option>
                          //           <option value='25'>25</option>
                          //           <option value='50'>50</option>
                          //           <option value='100'>100</option>
                          //         </select>
                          //       }{' '}
                          //       entries.
                          //     </label>
                          //   </div>
                          // ),
                          // })}
                        />
                        <ReactPaginate
                          previousLabel={t(`${translationPath}prev`)}
                          nextLabel={t(`${translationPath}next`)}
                          breakLabel="..."
                          breakClassName="break-me"
                          pageCount={props.numberOfPages}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={props.handlePageClick}
                          containerClassName="pagination justify-content-center pb-3 px-3 mx-0"
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
                      </div>
                    )}
                  </div>
                </>
              )}
            </ToolkitProvider>
          ) : (
            <Empty message="No Assessments Found" />
          )}
        </div>
      </ToastProvider>
    </>
  );
};
export default ManageAssessmentTable;

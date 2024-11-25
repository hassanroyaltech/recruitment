import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import urls from 'api/urls';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ReactPaginate from 'react-paginate';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
  UncontrolledDropdown,
  Col,
} from 'reactstrap';
import ReactToPrint from 'react-to-print';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from 'utils/constants/colorMaps';
import { CheckboxesComponent } from 'components';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import Loader from '../../recruiter-preference/components/Loader';
import Empty from '../../recruiter-preference/components/Empty';
import { GlobalDisplayDateTimeFormat, showError } from '../../../helpers';

const translationPath = 'ActivityTabComponent.';

const ActivityTab = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  let ref = useRef(null);
  const [tableColumns] = useState([
    {
      dataField: 'user',
      text: t(`${translationPath}user-name`),
      sort: false,
      formatter: (cellContent, row) => (
        <div className="d-flex align-items-center">
          <div className={classes.root}>
            <LetterAvatar name={`${row.user?.first_name} ${row.user?.last_name}`} />
          </div>
          <div className="ml-2-reversed text-gray-dark">
            {`${row.user.first_name} ${row.user.last_name}`}
          </div>
        </div>
      ),
    },
    {
      dataField: 'email',
      text: t(`${translationPath}email`),
      sort: false,
      formatter: (cellContent, row) => row.user.email,
    },
    {
      dataField: 'deadline',
      text: t(`${translationPath}date-and-time`),
      sort: true,
      formatter: (cellContent, row) =>
        moment(row.deadline)
          .locale(i18next.language)
          .format(GlobalDisplayDateTimeFormat),
    },
    {
      dataField: 'action',
      text: t(`${translationPath}activity`),
      sort: false,
      editable: false,
      formatter: (cellContent, row) => row.action,
    },
  ]);
  const classes = useOverlayedAvatarStyles();
  const { match, ManageTabs } = props;
  const [users, setUsers] = useState([]);
  const [, setFilteredUsers] = useState([]);
  const [totalLogs, setTotalLogs] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const [userUuid, setUserUuid] = useState();
  const [allFlag, setAllFlag] = useState(false);

  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setCurrentPage(currentPage);
  };

  const getUsers = useCallback(() => {
    axios
      .get(urls.evassess.SUB_USERS, {
        params: {
          company_uuid:
            (selectedBranchReducer && selectedBranchReducer.uuid) || null,
          page: 0,
          limit: -1,
        },
      })
      .then((res) => {
        setUsers(res.data.results.users);
        setFilteredUsers(res.data.results.users?.map((u) => u.uuid));
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [selectedBranchReducer, t]);

  const getLogs = useCallback(async () => {
    setLoader(true);
    let results;

    if (props.job)
      results = await axios
        .get(urls.evarec.ats.LOGS, {
          params: {
            job_uuid: match.params.id,
            page: currentPage + 1,
            limit: sizePerPage,
            user_uuid: userUuid,
            // sort_by: sortBy,
            // sort_direction: sortDirection
          },
        })
        .then((res) => {
          setTotalLogs(
            res.data.results.log.map((log, index) => ({
              id: index + 1,
              user: log.user,
              deadline: log?.created_at,
              action: log.action,
            })),
          );
          setTotalSize(res.data.results.total);
          setLoader(false);
          // setCurrentPage((currentPage) => currentPage + 1);
        })
        .catch((error) => {
          setLoader(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    else
      results = await axios
        .get(urls.evassess.LOGS, {
          params: {
            prep_assessment_uuid: match.params.id,
            page: currentPage + 1,
            limit: sizePerPage,
            user_uuid: userUuid,
            // sort_by: sortBy,
            // sort_direction: sortDirection
          },
        })
        .then((res) => {
          setTotalLogs(
            res.data.results.log.map((log, index) => ({
              id: index + 1,
              user: log.user,
              deadline: log.created_at,
              action: log.action,
            })),
          );
          setTotalSize(res.data.results.total);
          setLoader(false);
          // setCurrentPage((currentPage) => currentPage + 1);
        })
        .catch((error) => {
          setLoader(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    return results;
  }, [props.job, match.params.id, currentPage, sizePerPage, userUuid, t]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return (
    <>
      <ManageTabs
        id={props?.match?.params?.id}
        isActive={props.isActive}
        rightTabs={
          <>
            <NavItem>
              <UncontrolledDropdown>
                <DropdownToggle
                  color=""
                  className="nav-link nav-link-shadow text-primary font-weight-normal"
                >
                  {t(`${translationPath}display-all`)}
                  <i className="fa fa-angle-down ml-2-reversed" />
                </DropdownToggle>
                <DropdownMenu
                  right
                  style={{ maxHeight: 500, overflow: 'auto', right: 0 }}
                >
                  <DropdownItem
                    toggle={false}
                    onClick={() => {
                      setUserUuid(null);
                      setAllFlag(false);
                    }}
                  >
                    <CheckboxesComponent
                      idRef="customCheck3"
                      singleChecked={!allFlag && !userUuid}
                      label={t(`${translationPath}all`)}
                      isDisabled
                    />
                  </DropdownItem>

                  {users?.map((userItem, i) => (
                    <DropdownItem
                      toggle={false}
                      key={`usersOptionsKey${i + 1}`}
                      onClick={() => {
                        setCurrentPage(0);
                        setUserUuid(userItem.uuid);
                      }}
                    >
                      <div className="mb-1">
                        <CheckboxesComponent
                          idRef={userItem.uuid}
                          singleChecked={userUuid === userItem.uuid}
                          label={[userItem.first_name, userItem.last_name].join(' ')}
                          isDisabled
                        />
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
            <NavItem className="float-right">
              <div>
                <ReactToPrint
                  trigger={() => (
                    <Button
                      id="toggler"
                      color="link"
                      className="btn nav-link nav-link-shadow nav-link-icon px-2 text-gray font-weight-normal"
                    >
                      <i className="fas fa-print" />
                    </Button>
                  )}
                  content={() => ref}
                />
              </div>
            </NavItem>
          </>
        }
      />
      <div className="w-100 mt-4 px-3 d-flex flex-row justify-content-between align-items-end mb-3">
        <div className="d-flex flex-column align-items-start">
          <div className="mb-1">
            <h5 className="h5 mb-0 d-inline-block mr-1-reversed float-left">
              {t(`${translationPath}recent-activity`)}
            </h5>
          </div>
          <p className="text-muted font-14 mb-0">
            {t(`${translationPath}team-members-activity-description`)}
          </p>
        </div>
      </div>
      <div className="video-activities">
        {loader ? (
          <Loader />
        ) : totalLogs && totalSize && totalSize > 0 ? (
          <ToolkitProvider
            data={totalLogs}
            keyField="id"
            columns={tableColumns}
            search
          >
            {(tableProps) => (
              <>
                <div className="table-responsive list-activity-table">
                  {!totalSize ? (
                    <Empty />
                  ) : (
                    <Col xl={12} className="my-4 pr-lg-2 pr-md-2 pb-1">
                      <div className="text-gray mt--3">
                        <div className="float-right">
                          <span className="font-14">
                            {sizePerPage * currentPage + 1 >= totalSize
                              ? totalSize
                              : sizePerPage * currentPage + 1}
                            <span>-</span>
                            <span>
                              {sizePerPage * (currentPage + 1) >= totalSize
                                ? totalSize
                                : sizePerPage * (currentPage + 1)}
                            </span>
                            <span className="px-1">{t(`${translationPath}of`)}</span>
                            {totalSize}
                          </span>
                          <UncontrolledDropdown>
                            <DropdownToggle
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
                            <DropdownMenu end>
                              {[10, 25, 50, 100].map((size) => (
                                <DropdownItem
                                  key={size}
                                  onClick={() => {
                                    setCurrentPage(0);
                                    setSizePerPage(size);
                                  }}
                                >
                                  {size}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                      <BootstrapTable
                        ref={(el) => (ref = el)}
                        {...tableProps.baseProps}
                        striped
                        bordered={false}
                        // bootstrap4
                        // remote
                        // onSort={(s) => {
                        //   setSort(s);
                        //   setCurrentPage(0);
                        // }}
                      />
                      <ReactPaginate
                        previousLabel={t(`${translationPath}prev`)}
                        nextLabel={t(`${translationPath}next`)}
                        breakLabel="..."
                        breakClassName="break-me"
                        pageCount={Math.ceil(totalSize / sizePerPage)}
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
                        forcePage={currentPage}
                      />
                    </Col>
                  )}
                </div>
              </>
            )}
          </ToolkitProvider>
        ) : (
          <Empty message={t(`${translationPath}no-logs-found`)} />
        )}
      </div>
    </>
  );
};

export default ActivityTab;

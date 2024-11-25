// React component
import React, { useCallback, useEffect, useRef, useState } from 'react';
// Classesnames for style
import classnames from 'classnames';
// React strap component
import {
  Button,
  CardBody,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabPane,
  UncontrolledDropdown,
} from 'reactstrap';
// React component for creating dynamic tables
import ReactBSAlert from 'react-bootstrap-sweetalert';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

import Loader from '../../../components/Elevatus/Loader';
// Permissions
import ReactPaginate from 'react-paginate';
import { evarecAPI } from '../../../api/evarec';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Actions } from '../../actionsStyle';
import Empty from '../../recruiter-preference/components/Empty';
import {
  getIsAllowedPermissionV2,
  GlobalDisplayDateTimeFormat,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../helpers';
import { useTitle } from '../../../hooks';
import { EvaRecTemplatesPermissions } from '../../../permissions';
import { SharedInputControl } from 'pages/setups/shared';
import ExportedJobTemplate from './ExportedJobTemplate';
import { DialogComponent } from '../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import {
  getSetupsPositionTitleStatus,
  UpdateSetupsPositionTitleStatus,
} from '../../../services';

const translationPath = '';
const parentTranslationPath = 'EvaRecTemplate';

export const TemplatesJob = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}templates-list`));
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((state) => state?.userReducer);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const isConnectedWithPositionTitleRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    user: userReducer?.results,
    loading: true,
    exampleModal: false,
    title: '',
    type: '',
    page: 0,
    sizePerPage: 10,
    total: 0,
    data: [],
    number_of_questions: 0,
    currentType: 'active',
    errors: null,
    query: '',
  });

  /**
   * Function to get templates data
   * @param {*} limit
   * @param {*} page
   */
  const getTemplates = useCallback(
    async (limit, page) => {
      evarecAPI
        .getTemplates(limit, page, state.query)
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            data: res?.data?.results?.templates,
            total: res?.data?.results?.total,
            loading: false,
          }));
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            type: 'error',
            alert: null,
            message: error?.response?.data?.message,
            errors: error?.response?.data?.errors,
          }));
        });
    },
    [state.query],
  );

  const handleEdit = (e, template) => {
    GlobalHistory.push(`/recruiter/job/template/edit/${template.uuid}`);
  };

  const handleAdd = () => {
    GlobalHistory.push('/recruiter/job/template/new');
  };

  const confirmAlert = (index, uuid) => {
    setState((items) => ({
      ...items,
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title={t(`${translationPath}are-you-sure`)}
          onConfirm={() => {
            confirmedAlert(index, uuid);
          }}
          onCancel={() => {
            setState((elements) => ({ ...elements, alert: null }));
            // const DATA = state.data;
            // DATA.splice(state.activeIndex, 1);
            // setState((items) => ({
            //       ...items, data: DATA }));
            // confirmedAlert();
          }}
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnText={t(`${translationPath}cancel`)}
          cancelBtnBsStyle="danger"
          confirmBtnText={t(`${translationPath}yes-delete-it`)}
          btnSize=""
        >
          {t(`${translationPath}you-wont-be-able-to-revert-this`)}!
        </ReactBSAlert>
      ),
    }));
  };

  const confirmedAlert = (index, uuid) => {
    handleDeleteTemplate(index, uuid);
  };

  /**
   * Function to delete template
   * @param {*} index
   * @param {*} UUID
   */

  const handleDeleteTemplate = (index, UUID) => {
    evarecAPI
      .deleteJobTemplate(UUID)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          type: 'success',
          message: res.message ? res.message : res.error,
          submitted: false,
          // errors: [],
        }));
        setState((prevState) => ({
          ...prevState,
          data: state.data.filter((p) => p.uuid !== UUID),
          total: prevState.total - 1,
          page: 0,
        }));
        setState((items) => ({
          ...items,
          alert: (
            <ReactBSAlert
              success
              style={{ display: 'block' }}
              title={t(`${translationPath}deleted`)}
              onConfirm={() =>
                setState((elements) => ({ ...elements, alert: null }))
              }
              onCancel={() => setState((elements) => ({ ...elements, alert: null }))}
              confirmBtnBsStyle="primary"
              confirmBtnText={t(`${translationPath}ok`)}
              btnSize=""
            >
              {t(`${translationPath}template-has-been-deleted`)}.
            </ReactBSAlert>
          ),
        }));
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          type: 'error',
          alert: null,
          submitted: false,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
        }));
      });
  };

  const handleSetCurrentType = (currentType) =>
    setState((items) => ({
      ...items,
      currentType,
    }));

  /**
   * Function to Handle changing page in pagination, then invoke getTemplates function.
   * @param {*} e
   */
  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setState((items) => ({
      ...items,
      page: currentPage,
    }));
    getTemplates(state.sizePerPage, currentPage + 1);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to update the position title status
   */
  const positionTitleStatusToggleHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await UpdateSetupsPositionTitleStatus();
    if (response && response.status === 200) {
      isConnectedWithPositionTitleRef.current = response.data?.status;
      setIsLoading(false);
      showSuccess(t(`${translationPath}position-title-status-updated-successfully`));
    } else {
      showError(
        t(`${translationPath}position-title-status-update-failed`),
        response,
      );
      setIsLoading(false);
    }
  }, [t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this custom hook is to get on event change like onScroll
   */
  const getPositionTitleStatus = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsPositionTitleStatus();
    if (response && response.status === 200)
      isConnectedWithPositionTitleRef.current = response.data?.status;
    else showError(t('Shared:failed-to-get-saved-data'), response);
    setIsLoading(false);
  }, [t]);

  const handleSetSizePerPage = (sizePerPage) => {
    // if (sizePerPage <= page * state.sizePerPage) return; // Don't fetch if we're going back
    setState((items) => ({
      ...items,
      page: 0,
      sizePerPage,
    }));
    getTemplates(sizePerPage, 1);
  };
  // Invoke getTemplates Data once the component render
  useEffect(() => {
    getTemplates(state.sizePerPage, state.page + 1);
  }, [getTemplates, state.page, state.sizePerPage, state.query]);
  // get the status of the position title on init
  useEffect(() => {
    void getPositionTitleStatus();
  }, [getPositionTitleStatus]);

  return (
    <Container fluid className="py-5" style={{ minHeight: 'calc(100vh - 78px)' }}>
      <Container fluid>
        <div className="d-flex-v-center-h-between flex-row mb-2">
          <h5 className="h5 mb-0 d-inline-flex">
            {t(`${translationPath}list-of-templates`)}
          </h5>
          {state.alert}
          <div className="d-inline-flex-v-center flex-wrap">
            <ButtonBase
              className={`btns theme-solid mb-3 ${
                isConnectedWithPositionTitleRef.current
                  ? 'bg-green-primary'
                  : 'bg-warning'
              }`}
              onClick={positionTitleStatusToggleHandler}
              disabled={isLoading}
            >
              <span
                className={`fas fa-${
                  isConnectedWithPositionTitleRef.current ? 'link' : 'unlink'
                }`}
              />
              <span className="px-1">
                {t(
                  `${translationPath}position-title-${
                    isConnectedWithPositionTitleRef.current
                      ? 'connected'
                      : 'disconnected'
                  }`,
                )}
              </span>
            </ButtonBase>
            <Button
              className="float-right mb-3 btn-evarec"
              color="primary"
              size="sm"
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: EvaRecTemplatesPermissions.AddTemplate.key,
                })
              }
              onClick={handleAdd}
              style={{ padding: '6px 22px' }}
            >
              <i className="fas fa-plus" /> {t(`${translationPath}create-template`)}
            </Button>
            <Button
              className="float-right mb-3 btn-evarec"
              color="primary"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              style={{ padding: '6px 22px' }}
            >
              <i className="fas fa-file-export pr-2" />{' '}
              {t(`${translationPath}export`)}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-muted font-14">
            {t(`${translationPath}template-description`)}.
          </p>
        </div>
      </Container>
      <div className="content-page">
        <TabPane tabId="1" className="jobs-templates-list">
          <Nav tabs className="d-flex-between mt-4 px-3 tabs-with-actions">
            <NavItem>
              <NavLink
                className={classnames({
                  'tab-link': true,
                  'active-tab': state.currentType === 'active',
                })}
                active={state.currentType === 'active'}
                onClick={() => handleSetCurrentType('active')}
              >
                {t(`${translationPath}active-templates`)}
              </NavLink>
            </NavItem>
            <NavItem className="mt-3 px-3">
              <SharedInputControl
                idRef="searchRef"
                title="search"
                placeholder="search"
                themeClass="theme-filled"
                stateKey="search"
                endAdornment={
                  <span className="end-adornment-wrapper">
                    <span className="fas fa-search" />
                  </span>
                }
                onValueChanged={(newValue) => {
                  setState((prev) => ({ ...prev, query: newValue.value }));
                }}
                parentTranslationPath={parentTranslationPath}
                editValue={state.query}
              />
            </NavItem>
            <NavItem className="ml-auto mt-auto mb-auto">
              <span className="mr-2 font-14">
                {state.sizePerPage * state.page + 1 >= state.total
                  ? state.total
                  : state.sizePerPage * state.page + 1}
                <span>-</span>
                <span>
                  {state.sizePerPage * (state.page + 1) >= state.total
                    ? state.total
                    : state.sizePerPage * (state.page + 1)}
                </span>
                <span className="px-1">{t(`${translationPath}of`)}</span>
                <span>{state.total}</span>
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
                      onClick={() => handleSetSizePerPage(size)}
                    >
                      {size}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
          </Nav>
          {(state.loading && <Loader />)
            || (state.errors && (
              <CardBody
                className="text-center"
                style={{
                  height: '60vh',
                }}
              >
                <Row>
                  <Col xl="12">
                    <div className="alert alert-danger">
                      {state.errors.join(', ')}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            )) || (
            <ToolkitProvider
              data={state.data}
              keyField="uuid"
              columns={[
                {
                  dataField: 'title',
                  text: t(`${translationPath}title`),
                  sort: true,
                  editable: false,
                },
                {
                  dataField: 'review_date',
                  text: t(`${translationPath}review-date`),
                  formatExtraData: i18next.language,
                  formatter: (cellContent, row) =>
                    (row.review_date
                        && moment(row.review_date, 'YYYY-MM-DD')
                          .locale(i18next.language)
                          .format('YYYY-MM-DD'))
                      || '',
                },
                {
                  dataField: 'created_at',
                  text: t(`${translationPath}created-at`),
                  formatExtraData: i18next.language,
                  formatter: (cellContent, row) =>
                    moment(row.created_at, 'YYYY-MM-DD hh:mm/A')
                      .locale(i18next.language)
                      .format(GlobalDisplayDateTimeFormat),
                },
                {
                  dataField: 'updated_at',
                  text: t(`${translationPath}updated-at`),
                  formatExtraData: i18next.language,
                  formatter: (cellContent, row) =>
                    moment(row.updated_at, 'YYYY-MM-DD hh:mm/A')
                      .locale(i18next.language)
                      .format(GlobalDisplayDateTimeFormat),
                },
                {
                  editable: false,
                  dataField: 'actions',
                  text: t(`${translationPath}action`),
                  isDummyField: true,
                  formatExtraData: i18next.language,
                  formatter: (cellContent, row, index) => (
                    <Actions>
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
                          <DropdownItem
                            className="dropdown-item shadow-none"
                            disabled={
                              !getIsAllowedPermissionV2({
                                permissions,
                                permissionId:
                                    EvaRecTemplatesPermissions.UpdateTemplate.key,
                              })
                            }
                            onClick={(e) => handleEdit(e, row)}
                            id="action-edit"
                          >
                            <span className="btn-inner--icon ">
                              <i className="fas fa-pen" />
                            </span>
                              &nbsp; {t(`${translationPath}edit-template`)}
                          </DropdownItem>
                          <DropdownItem
                            className="dropdown-item shadow-none"
                            disabled={
                              !getIsAllowedPermissionV2({
                                permissions,
                                permissionId:
                                    EvaRecTemplatesPermissions.DeleteTemplate.key,
                              })
                            }
                            onClick={() => confirmAlert(index, row.uuid)}
                            id="action-edit"
                          >
                            <span className="btn-inner--icon ">
                              <i className="fas fa-trash" />
                            </span>
                              &nbsp; {t(`${translationPath}delete-template`)}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Actions>
                  ),
                },
              ]}
              search
            >
              {(tableProps) => (
                <div className="table-responsive list-template-table">
                  {!state.total ? (
                    <Empty />
                  ) : (
                    <Col xl={12} className="my-4 pr-lg-2 pr-md-2">
                      <BootstrapTable
                        {...tableProps.baseProps}
                        bootstrap4
                        striped
                        bordered={false}
                        // pagination={pagination}
                      />
                      <ReactPaginate
                        previousLabel={t(`${translationPath}previous-page`)}
                        nextLabel={t(`${translationPath}next-page`)}
                        breakLabel="..."
                        breakClassName="break-me"
                        pageCount={Math.ceil(state.total / state.sizePerPage)}
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
                        forcePage={state.page}
                      />
                    </Col>
                  )}
                </div>
              )}
            </ToolkitProvider>
          )}
        </TabPane>
      </div>
      <DialogComponent
        titleText="export-job-template"
        maxWidth="lg"
        dialogContent={<ExportedJobTemplate />}
        isOpen={showExportDialog}
        saveType=""
        onCloseClicked={() => setShowExportDialog(false)}
        onCancelClicked={() => setShowExportDialog(false)}
        parentTranslationPath={parentTranslationPath}
      />
    </Container>
  );
};
export default TemplatesJob;

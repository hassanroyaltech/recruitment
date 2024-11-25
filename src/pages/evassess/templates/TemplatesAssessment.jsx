/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */
// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
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

// Classnames
import classnames from 'classnames';

// react component for creating dynamic tables
import ReactBSAlert from 'react-bootstrap-sweetalert';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { Can } from 'utils/functions/permissions';
import urls from 'api/urls';
import SimpleHeader from 'components/Elevatus/TimelineHeader';

import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Actions } from '../../actionsStyle';

import Loader from '../../../components/Elevatus/Loader';
// Permissions
import Empty from '../../recruiter-preference/components/Empty';
import { useTitle } from '../../../hooks';
import {
  HttpServices,
  showError,
  showSuccess,
  getIsAllowedPermissionV2,
} from '../../../helpers';
import { useSelector } from 'react-redux';
import { EvaSsessTemplatesPermissions } from 'permissions';

/**
 * Template list component
 */
const parentTranslationPath = 'EvaSSESSTemplates';
const translationPath = 'TemplatesAssessmentComponent.';
const TemplatesAssessment = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [templates, setTemplates] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    exampleModal: false,
    title: '',
    type: '',
    number_of_questions: 0,
    currentType: 'active',
    errors: null,
  });
  const handleEdit = (e, template) => {
    props.history.push(`/recruiter/assessment/template/edit/${template.uuid}`);
  };
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const hideAlert = () => {
    setState((items) => ({
      ...items,
      alert: null,
    }));
  };

  /**
   * Handler to delete a template
   * @param index
   * @param UUID
   */
  const handleDeleteTemplate = (index, UUID) => {
    setState((items) => ({ ...items, alert: null }));
    setIsLoading(true);
    HttpServices.delete(urls.evassess.template_WRITE, {
      params: {
        uuid: UUID,
      },
    })
      .then(() => {
        setFilter((items) => ({ ...items, page: 1 }));
        showSuccess(t(`${translationPath}template-deleted-successfully`));
      })
      .catch((error) => {
        setIsLoading(false);
        showError(t('Shared:failed-to-delete'), error);
      });
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
            handleDeleteTemplate(index, uuid);
          }}
          onCancel={() => {
            hideAlert();
          }}
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnText={t(`${translationPath}cancel`)}
          cancelBtnBsStyle="danger"
          confirmBtnText={t(`${translationPath}yes-delete-it`)}
          btnSize=""
        >
          {t(`${translationPath}revert-description`)}
        </ReactBSAlert>
      ),
    }));
  };

  useTitle(t(`${translationPath}templates-list`));

  /**
   * Get template list
   * @returns {Promise<void>}
   */
  const getTemplates = useCallback(() => {
    setIsLoading(true);
    HttpServices.get(urls.evassess.template_GET, {
      params: filter,
    })
      .then((response) => {
        setTemplates({
          results: response.data.results.template,
          totalCount: response.data.results.summary.total,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setTemplates({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), error);
        setIsLoading(false);
      });
  }, [filter]);

  /**
   * Function to handle changing page in pagination
   * @param {*} e
   */
  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setFilter((items) => ({ ...items, page: currentPage + 1 }));
  };

  const handleAdd = () => {
    props.history.push('/recruiter/assessment/template/new');
  };

  const handleSetCurrentType = (currentType) =>
    setState((items) => ({ ...items, currentType }));

  const handleSetSizePerPage = (sizePerPage) => {
    setFilter((items) => ({ ...items, page: 1, limit: sizePerPage }));
  };

  useEffect(() => {
    getTemplates();
  }, [getTemplates, filter]);

  return (
    <>
      <SimpleHeader
        parentName={t(`${translationPath}eva-ssess`)}
        name={t(`${translationPath}assessment-templates`)}
      />

      <div className="content-page bg-white mt--8">
        <div className="content">
          <Container
            fluid
            className="py-5"
            style={{ minHeight: 'calc(100vh - 78px)' }}
          >
            <Container fluid>
              <div className="d-flex flex-row align-items-end justify-content-between mb-2">
                <h5 className="h5 mb-0 d-inline-block mr-1-reversed float-left">
                  {t(`${translationPath}list-of-templates`)}
                </h5>
                <Button
                  className="float-right mb-3 btn-evassess"
                  color="primary"
                  size="sm"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        EvaSsessTemplatesPermissions.AddEvaSsessTemplates.key,
                    })
                  }
                  onClick={handleAdd}
                  style={{ padding: '6px 22px' }}
                >
                  <i className="fas fa-plus" />
                  <span className="px-1">
                    {t(`${translationPath}create-template`)}
                  </span>
                </Button>
              </div>
              <div>
                <p className="text-muted font-14">
                  {t(`${translationPath}template-description`)}
                </p>
              </div>
            </Container>
            <div className="content-page">
              <TabPane tabId="1" className="assessments-list">
                <Nav tabs className="mt-4 px-3 tabs-with-actions">
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
                  <NavItem className="ml-auto-reversed mt-auto mb-auto">
                    <span className="mr-2-reversed font-14">
                      {filter.limit * (filter.page - 1) + 1 >= templates.totalCount
                        ? templates.totalCount
                        : filter.limit * (filter.page - 1) + 1}
                      <span>-</span>
                      {filter.limit * filter.page >= templates.totalCount
                        ? templates.totalCount
                        : filter.limit * filter.page}
                      <span className="px-1">{t('Shared:of')}</span>
                      {templates.totalCount}
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
                              handleSetSizePerPage(size);
                            }}
                          >
                            {size}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </NavItem>
                </Nav>
                {isLoading ? (
                  <Loader />
                ) : state.errors ? (
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
                ) : (
                  <ToolkitProvider
                    data={templates.results}
                    keyField="uuid"
                    columns={[
                      {
                        dataField: 'title',
                        text: t(`${translationPath}title`),
                        sort: true,
                        editable: false,
                        formatter: (cellContent, row) => (
                          <Link
                            to={`/recruiter/assessment/template/edit/${row.uuid}`}
                            className="text-gray"
                          >
                            {row.title}
                          </Link>
                        ),
                      },
                      {
                        dataField: 'type.title',
                        text: t(`${translationPath}type`),
                        sort: true,
                        editable: false,
                      },
                      {
                        dataField: 'number_of_questions',
                        text: t(`${translationPath}number-of-questions`),
                        sort: true,
                        editable: false,
                      },
                      {
                        dataField: 'created_at',
                        text: t(`${translationPath}created-at`),
                        formatExtraData: i18next.language,
                        formatter: (cellContent, row) => row.created_at,
                      },
                      {
                        dataField: 'updated_at',
                        text: t(`${translationPath}updated-at`),
                        formatExtraData: i18next.language,
                        formatter: (cellContent, row) => row.updated_at,
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
                                        EvaSsessTemplatesPermissions
                                          .UpdateEvaSsessTemplates.key,
                                    })
                                  }
                                  onClick={(e) => handleEdit(e, row)}
                                  id="action-edit"
                                >
                                  <span className="btn-inner--icon ">
                                    <i className="fas fa-pen" />
                                  </span>
                                  <span className="px-1">
                                    {t(`${translationPath}edit-template`)}
                                  </span>
                                </DropdownItem>
                                <DropdownItem
                                  className="dropdown-item shadow-none"
                                  disabled={
                                    !getIsAllowedPermissionV2({
                                      permissions,
                                      permissionId:
                                        EvaSsessTemplatesPermissions
                                          .DeleteEvaSsessTemplates.key,
                                    })
                                  }
                                  onClick={() => confirmAlert(index, row.uuid)}
                                  id="action-edit"
                                >
                                  <span className="btn-inner--icon ">
                                    <i className="fas fa-trash" />
                                  </span>
                                  <span className="px-1">
                                    {t(`${translationPath}delete-template`)}
                                  </span>
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
                        {!templates.totalCount ? (
                          <Empty />
                        ) : (
                          <Col xl={12} className="my-4 px-2 pb-1">
                            <BootstrapTable
                              {...tableProps.baseProps}
                              bootstrap4
                              striped
                              bordered={false}
                            />
                            <ReactPaginate
                              previousLabel={t(`${translationPath}prev`)}
                              nextLabel={t(`${translationPath}next`)}
                              breakLabel="..."
                              breakClassName="break-me"
                              pageCount={Math.ceil(
                                templates.totalCount / filter.limit,
                              )}
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
                              forcePage={filter.page - 1}
                            />
                          </Col>
                        )}
                      </div>
                    )}
                  </ToolkitProvider>
                )}
              </TabPane>
              {state.alert && state.alert}
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};
export default TemplatesAssessment;

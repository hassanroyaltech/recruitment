/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  UncontrolledDropdown,
} from 'reactstrap';
import _ from 'lodash';
// import { Can } from '../../../utils/functions/permissions';
import urls from '../../../api/urls';
import { evassessAPI } from '../../../api/evassess';
import { commonAPI } from '../../../api/common';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import SimpleHeader from '../../../components/Elevatus/TimelineHeader';
import Loader from '../../../components/Elevatus/Loader';
import ManageAssessmentTable from './ManageAssessmentTable';
import { useTitle } from '../../../hooks';
import { getIsAllowedPermissionV2, showError } from '../../../helpers';
import {
  CreateAssessmentPermissions,
  ManageAssessmentsPermissions,
} from '../../../permissions';

const parentTranslationPath = 'EvaSSESS';
const translationPath = 'ManageAssessmentComponent.';
const ManageAssessment = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(true);
  useTitle(t(`${translationPath}manage-assessments`));
  const [error, setError] = useState('');
  const [newSearchProps, setNewSearch] = useState({});
  const [openSureModal, setSureModal] = useState(false);
  const [state, setState] = useState({
    active_data: [],
    type: 'active',
  });
  const [currentType, setCurrentType] = useState('active');
  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPage] = useState(0);
  const [providers, setProviders] = useState();
  const [DeleteAlert, setDeleteAlert] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkArchived, setIsBulkArchived] = useState(false);
  // const permissionsReducer = useSelector(
  //   // eslint-disable-next-line no-shadow
  //   (state) => state?.permissionsReducer?.permissions,
  // );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const handlePageClick = (e) => {
    const currentPage = e.selected;
    setPage(currentPage);
  };

  const getAllActiveAssessment = useCallback(async () => {
    const url
      = currentType === 'active'
        ? urls.evassess.ASSESSMENT_GET
        : urls.evassess.ARCHIVED;
    setLoading(true);
    evassessAPI
      .getAssessments(url, sizePerPage, page)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          active_data: res?.data?.results?.assessment?.map((assessment, index) => ({
            id: index + 1,
            uuid: assessment.uuid,
            title: assessment.title,
            category: assessment.category,
            privacy: assessment.is_public,
            question: assessment?.questions?.length.toString(),
            type: assessment?.type ? 'Open' : 'Hidden',
            deadline: assessment?.deadline,
            candidates: assessment?.teams.length,
            new_candidates: assessment.new_candidates,
            total_candidates: assessment.total_candidates,
            invitation_url: assessment.invitation_url,
            is_published: assessment.is_published,
            recruiters: assessment?.teams.length > 0 ? assessment?.teams : [],
          })),
        }));
        setLoading(false);
        setTotal(res?.data?.results?.total);
        setNumberOfPage(res?.data?.results?.number_of_pages);
      })
      .catch((resError) => {
        if (resError.message === 'Network Error') setError(resError.message);
        else showError(t('Shared:failed-to-get-saved-data'), error);

        setLoading(false);
      });
  }, [t, currentType, page, sizePerPage]);

  const checkProviders = async () => {
    commonAPI.getCompanyProvider('open_api').then((res) => {
      const data = res?.data?.results?.filter(
        (item) => item?.provider_name === 'sap',
      );
      setProviders(
        data?.map((element) => ({
          value: element.provider_uuid,
          icon: element.image,
          status: element.status,
          title: element.provider_name,
          description: element.content,
          sap: element.provider_name === 'sap' && element.status,
        })),
      );
      setWorking(false);
    });
  };

  useEffect(() => {
    getAllActiveAssessment();
  }, [currentType, getAllActiveAssessment, page]);

  useEffect(() => {
    checkProviders();
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, [i18next.language]);

  const searchProps = (newProps) => {
    if (!_.isEmpty(newProps) && _.isEmpty(newSearchProps)) setNewSearch(newProps);
  };

  const getSapAssessments = () => {
    evassessAPI
      .getSapAssessments()
      .then((response) => {
        setDeleteAlert(null);
        downloadCSV(response?.data?.results?.file_path);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  const confirmedAlert = () => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}generating-CSV-file`)}
        showConfirm={false}
        onConfirm={() => {}}
        showCancel={false}
      />,
    );
    getSapAssessments();
  };

  const downloadCSV = (filePath) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={
          <div className="h6 font-weight-normal text-gray">
            <span>{t(`${translationPath}file-ready-description`)}</span>
            <a
              download
              target="_blank"
              href={filePath}
              rel="noreferrer"
              className="px-1"
            >
              {t(`${translationPath}here`)}
            </a>
            <span>{t(`${translationPath}to-download-it`)}</span>
          </div>
        }
        showConfirm={false}
        onConfirm={() => {}}
        showCancel
        onCancel={() => setDeleteAlert(null)}
      />,
    );
  };

  const exportAllAssessments = () => {
    setIsDownloading(true);
    evassessAPI
      .ExportAllAssessments()
      .then((response) => {
        setIsDownloading(false);
        if (!response || !response.data) return;
        const { link } = response.data.results;

        const a = document.createElement('a');

        a.href = link;
        a.download = 'download';
        a.click();
      })
      .catch((error) => {
        setIsDownloading(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  const getRemainingCredits = useCallback(() => {
    evassessAPI
      .GetRemainingCredits()
      .then((response) => {
        if (!response || !response.data) return;
        const { results } = response.data;
        setRemainingCredits(results);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, []);

  useEffect(() => {
    getRemainingCredits();
  }, [getRemainingCredits]);

  return (
    <>
      <SimpleHeader
        name={t(`${translationPath}manage-assessments`)}
        parentName={t('eva-SSESS')}
      />
      {working ? (
        <Loader />
      ) : (
        <div className="content-page bg-white mt--8">
          {DeleteAlert}
          <div className="content">
            <div className="py-5 p-3" style={{ minHeight: 'calc(100vh - 78px)' }}>
              <div className="px-3">
                <div className="d-flex flex-wrap align-items-end justify-content-between mb-2">
                  <h5 className="h5 mb-0 d-inline-flex">
                    {t(`${translationPath}list-of-assessments`)}
                  </h5>
                  <div className="d-inline-flex align-items-center">
                    <div className="d-inline-flex flex-wrap">
                      {remainingCredits && remainingCredits.length > 0 && (
                        <div className="d-flex align-items-center">
                          {remainingCredits.map((item, index) => (
                            <div key={`${index + 1}`} className="pr-3-reversed">
                              <span className="font-weight-bold c-purple">
                                {`${t(
                                  `${translationPath}${item.title.replace(
                                    ' ',
                                    '-',
                                  )}`,
                                )} :`}
                              </span>
                              <span>{t(`${translationPath}${item.limit}`)}</span>
                              {item.limit !== 'Unlimited' && (
                                <span>{` / ${item.original_limit}`}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="d-inline-flex flex-wrap">
                      <ButtonBase
                        disabled={
                          selectedRows.length === 0
                          || !getIsAllowedPermissionV2({
                            permissionId:
                              CreateAssessmentPermissions.DeleteEvaSsessApplication
                                .key,
                            permissions,
                          })
                        }
                        className="btns theme-solid"
                        onClick={() => setIsBulkArchived(true)}
                      >
                        <i className="fas fa-archive pr-2" />
                        {t(`${translationPath}bulk-archive`)}
                      </ButtonBase>
                      {providers[0] && providers[0].sap && (
                        <ButtonBase
                          className="btns theme-solid"
                          onClick={() => confirmedAlert()}
                        >
                          {t(`${translationPath}export-assessments-(SAP)`)}
                        </ButtonBase>
                      )}
                      <ButtonBase
                        disabled={
                          isDownloading
                          || !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageAssessmentsPermissions
                                .DownloadAllAssessmentReport.key,
                          })
                        }
                        className="btns theme-solid"
                        onClick={exportAllAssessments}
                      >
                        {isDownloading ? (
                          <i className="fas fa-circle-notch fa-spin mr-2" />
                        ) : (
                          <i className="fas fa-file-export pr-2" />
                        )}
                        {`${
                          !isDownloading
                            ? t(`${translationPath}export-assessments`)
                            : t(`${translationPath}exporting-assessments`)
                        }`}
                      </ButtonBase>
                      <ButtonBase
                        className="btns theme-solid bg-brand-purple"
                        onClick={() =>
                          props.history.push('/recruiter/assessment/create')
                        }
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              CreateAssessmentPermissions.AddEvaSsessApplication.key,
                          })
                        }
                      >
                        <i className="fas fa-plus pr-2" />
                        <span>{t(`${translationPath}create-assessment`)}</span>
                      </ButtonBase>
                    </div>
                  </div>
                </div>
                <p className="text-muted font-14">
                  {t(`${translationPath}create-assessment-description`)}
                </p>
              </div>
              <div className="content-page">
                <TabPane tabId="1" className="assessments-list">
                  <Nav tabs className="mt-4 px-3 tabs-with-actions">
                    <NavItem>
                      <NavLink
                        className={classnames(
                          {
                            'tab-link': true,
                            'active-tab': currentType === 'active',
                          },
                          'nav-evassess',
                        )}
                        active={currentType === 'active'}
                        onClick={() => {
                          setState((items) => ({ ...items, type: 'active' }));
                          setPage(0);
                          setCurrentType('active');
                        }}
                      >
                        {t(`${translationPath}active-assessments`)}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          {
                            'tab-link': true,
                            'active-tab': currentType === 'archive',
                          },
                          'nav-evassess',
                        )}
                        active={currentType === 'archive'}
                        onClick={() => {
                          setState((items) => ({ ...items, type: 'archive' }));
                          setPage(0);
                          setCurrentType('archive');
                        }}
                      >
                        {t(`${translationPath}archived-assessments`)}
                      </NavLink>
                    </NavItem>
                    <NavItem className="ml-auto-reversed mt-auto mb-auto">
                      <span className="mr-2 font-14">
                        <span>
                          {sizePerPage * page + 1 >= total
                            ? total
                            : sizePerPage * page + 1}
                          <span>-</span>
                          <span>
                            {sizePerPage * (page + 1) >= total
                              ? total
                              : sizePerPage * (page + 1)}
                          </span>
                        </span>
                        <span className="px-1">{t(`${translationPath}of`)}</span>
                        <span>{total}</span>
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
                                setPage(0);
                                setSizePerPage(size);
                              }}
                            >
                              {size}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </NavItem>
                  </Nav>
                  {loading ? (
                    <Loader />
                  ) : error ? (
                    <div
                      className="text-center"
                      style={{
                        height: '60vh',
                      }}
                    >
                      <div className="alert alert-danger">{error}</div>
                    </div>
                  ) : (
                    <ManageAssessmentTable
                      {...props}
                      data={state.active_data}
                      type={state.type}
                      setState={setState}
                      setCurrentType={(type) => setCurrentType(type)}
                      searchProps={searchProps}
                      sizePerPage={sizePerPage}
                      onPageChange={setPage}
                      getAllActive={getAllActiveAssessment}
                      page={page}
                      handlePageClick={handlePageClick}
                      total={total}
                      numberOfPages={numberOfPages}
                      parentTranslationPath={parentTranslationPath}
                      selectedRows={selectedRows}
                      setSureModal={setSureModal}
                      openSureModal={openSureModal}
                      isBulkArchived={isBulkArchived}
                      setSelectedRows={setSelectedRows}
                      setIsBulkArchived={setIsBulkArchived}
                    />
                  )}
                </TabPane>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ManageAssessment;

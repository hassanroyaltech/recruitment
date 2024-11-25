// React and reactstrap
import React, { useState, useEffect, useCallback } from 'react';
import {
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  CardBody,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Container,
} from 'reactstrap';

// Classnames
import classnames from 'classnames';

// Moment and lodash
import _ from 'lodash';

// Components
import Loader from '../../components/Elevatus/Loader';

// API urls and functions
import { evameetAPI } from '../../api/evameet';
import { commonAPI } from '../../api/common';

// The main table
import ScheduleMeeting from '../../components/Views/ScheduleMeeting';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { showError, getIsAllowedPermissionV2 } from '../../helpers';
import ManageMeetingsTable from './ManageMeetingsTable';
import { useTitle } from '../../hooks';

import { EvaMeetPermissions } from '../../permissions';
import { MeetingFromFeaturesEnum } from '../../enums';

const translationPath = '';
const parentTranslationPath = 'EvaMeet';

/**
 * Function that returns the ManageMeetings component, which renders in part the
 * ManageMeetingsTable, as well as some other elements.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManageMeetings(props) {
  const { t } = useTranslation(parentTranslationPath);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error] = useState('');
  const [newSearchProps, setNewSearch] = useState({});
  const [data, setData] = useState([]);
  const [currentTab, setCurrentTab] = useState('upcoming');
  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [scheduleMeeting, setScheduleMeeting] = useState(false);
  const [timezones, setTimezones] = useState([]);

  useTitle(t(`${translationPath}manage-meetings`));

  const closeDialog = () => {
    setScheduleMeeting(false);
    // window.location.reload();
  };
  const getInterviewData = useCallback(() => {
    setLoading(true);
    // eslint-disable-next-line no-unused-expressions
    currentTab === 'upcoming'
      ? evameetAPI
        .getAllInterviews(1, page, sizePerPage)
        .then((res) => {
          setData(
            res.data.results.interviews
              .filter((meeting) => meeting.status !== 'Cancelled')
              .map((meeting, index) => ({
                id: index + 1,
                uuid: meeting.uuid,
                title: meeting.title,
                created_at: `${meeting?.interview_Date} ${meeting?.from_time}`,
                new_candidates: meeting.candidates,
                total_candidates: meeting.candidates,
                recruiters: meeting.recruiters,
              })),
          );
          setTotalSize(res.data.results.total);
          setLoading(false);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);

          setLoading(false);
        })
      : evameetAPI
        .getAllInterviews(0, page, sizePerPage)
        .then((res) => {
          setData(
            res.data.results.interviews.map((meeting, index) => ({
              id: index + 1,
              uuid: meeting.uuid,
              title: meeting.title,
              created_at: `${meeting?.interview_Date} ${meeting?.from_time}`,
              new_candidates: meeting.candidates,
              total_candidates: meeting.candidates,
              recruiters: meeting.recruiters,
              media: meeting?.media,
            })),
          );
          setTotalSize(res.data.results.total);
          setLoading(false);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);

          setLoading(false);
        });
  }, [t, currentTab, page, sizePerPage]);

  useEffect(() => {
    getInterviewData();
  }, [getInterviewData, page]);

  // timezones for Modal
  useEffect(() => {
    /**
     * Returns the timezones
     * @returns {Promise<void>}
     */
    const getTimezones = () => {
      commonAPI
        .getTimeZones()
        .then((res) => {
          setTimezones(res.data.results);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    };
    getTimezones();
  }, []);

  /**
   * Search through props
   * @param props
   */
  const searchProps = (props) => {
    if (!_.isEmpty(props) && _.isEmpty(newSearchProps)) setNewSearch(props);
  };

  /**
   * Return JSX
   */
  return (
    <>
      <Container fluid className="py-5" style={{ minHeight: 'calc(100vh - 78px)' }}>
        <Container fluid>
          <div className="d-flex flex-row align-items-end justify-content-between mb-2">
            <h5 className="h5 mb-0 d-inline-block mr-1 float-left">
              {t(`${translationPath}list-of-meetings`)}
            </h5>
            <div>
              <Button
                className={`float-right mb-3 btn-evameet ${
                  getIsAllowedPermissionV2({
                    permissions,
                    permissionId: EvaMeetPermissions.AddEvaMeet.key,
                  })
                    ? ''
                    : 'is-disabled'
                }`}
                color="primary"
                size="sm"
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: EvaMeetPermissions.AddEvaMeet.key,
                  })
                }
                onClick={() => setScheduleMeeting(true)}
                style={{ padding: '6px 22px' }}
              >
                <i className="fas fa-plus" />{' '}
                {t(`${translationPath}schedule-a-meeting`)}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-muted font-14">
              {t(`${translationPath}meeting-description`)}
            </p>
          </div>
        </Container>
        <div className="content-page">
          <TabPane tabId="1" className="list-tab-header">
            <Nav tabs className="mt-4 px-3 tabs-with-actions">
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      'tab-link': true,
                      'active-tab': currentTab === 'upcoming',
                    },
                    'nav-evameet',
                  )}
                  active={currentTab === 'upcoming'}
                  onClick={() => {
                    setPage(1);
                    setCurrentTab('upcoming');
                  }}
                >
                  {t(`${translationPath}upcoming-meetings`)}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    {
                      'tab-link': true,
                      'active-tab': currentTab === 'previous',
                    },
                    'nav-evameet',
                  )}
                  active={currentTab === 'previous'}
                  onClick={() => {
                    setPage(1);
                    setCurrentTab('previous');
                  }}
                >
                  {t(`${translationPath}previous-meetings`)}
                </NavLink>
              </NavItem>
              <NavItem className="ml-auto mt-auto mb-auto">
                <span className="mr-2 font-14">
                  {sizePerPage * (page - 1) + 1 >= totalSize
                    ? totalSize
                    : sizePerPage * (page - 1) + 1}
                  <span>-</span>
                  {sizePerPage * page >= totalSize ? totalSize : sizePerPage * page}
                  <span className="px-1">{t('Shared:of')}</span>
                  {totalSize}
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
                        key={`pageSizeKey${size}`}
                        onClick={() => {
                          setPage(1);
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
              <CardBody className="text-center">
                <Row>
                  <Col xl="12" lg="12" sm="12" xs="12">
                    <Loader />
                  </Col>
                </Row>
              </CardBody>
            ) : error ? (
              <CardBody
                className="text-center"
                style={{
                  height: '60vh',
                }}
              >
                <Row>
                  <Col xl="12">
                    <div className="alert alert-danger">{error}</div>
                  </Col>
                </Row>
              </CardBody>
            ) : (
              <ManageMeetingsTable
                {...props}
                data={data}
                type={currentTab}
                onChangeTableType={setCurrentTab}
                searchProps={searchProps}
                sizePerPage={sizePerPage}
                onPageChange={setPage}
                page={page}
                totalSize={totalSize}
                closeModal={closeDialog}
                toggle={closeDialog}
                timezones={timezones || []}
                getInterviewData={getInterviewData}
                from_feature={MeetingFromFeaturesEnum.EvaMeet.key}
              />
            )}
          </TabPane>
        </div>
      </Container>
      {scheduleMeeting && (
        <ScheduleMeeting
          // relation_uuid={props.match.params.id}
          relation={1}
          timezones={timezones || []}
          data={{}}
          from_feature={MeetingFromFeaturesEnum.EvaMeet.key}
          isOpen
          closeModal={closeDialog}
          toggle={closeDialog}
          // We only schedule a meeting for the selected candidate
          selectedCandidates={[]}
          evaMeet
          getData={getInterviewData}
        />
      )}
    </>
  );
}

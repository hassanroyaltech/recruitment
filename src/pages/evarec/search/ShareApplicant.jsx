/**
 * This component will be removed after testing that everything is working fine
 */
import React, { useCallback, useEffect, useState } from 'react';
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
import { BoardsLoader } from 'shared/Loaders';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { sharedJobMockData } from '../services/mockData';
import ShareCard from './ShareCard';
import { useTitle } from '../../../hooks';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../helpers';
import { SubscriptionServicesEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageApplicationsPermissions } from '../../../permissions';
import { GetAllIntegrationsConnections } from '../../../services';

const translationPath = '';
const parentTranslationPath = 'EvarecRecSearch';

const ShareApplicant = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState({
    results: [],
    totalCount: 0,
  });
  const [filters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  useEffect(() => {
    const getSharedApplicants = async () => {
      setApplicants(sharedJobMockData.results.candidate);
    };
    getSharedApplicants();
  }, []);

  useTitle(t(`${translationPath}shared-applicants`));

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

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

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const getAllIntegrationsConnections = useCallback(async () => {
    setLoading(true);
    const response = await GetAllIntegrationsConnections(filters);
    setLoading(false);
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
    getAllIntegrationsConnections();
  }, [getAllIntegrationsConnections, filters]);

  return (
    <div className="content-page bg-white">
      <div className="content">
        <Container
          fluid
          className="py-4"
          style={{ minHeight: 'calc(100vh - 78px)' }}
        >
          <Nav
            tabs
            className="d-flex clearfix align-items-center justify-content-between position-relative tabs-with-actions py-4"
          >
            <div className="h6 text-primary ml-3">
              {t(`${translationPath}list-of-shared-applicants`)}
            </div>
            <Nav className="float-right d-flex align-items-center position-absolute right-0">
              <NavItem>
                <NavLink
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => {}}
                >
                  <i className="fas fa-link" /> {t(`${translationPath}share`)}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => {}}
                >
                  <i className="far fa-copy" /> {t(`${translationPath}compare`)}
                </NavLink>
              </NavItem>
              <NavItem className="float-right">
                <UncontrolledDropdown>
                  <DropdownToggle
                    color=""
                    className="nav-link nav-link-shadow text-gray font-weight-normal"
                  >
                    {t(`${translationPath}actions`)}
                    <i className="fas fa-angle-down pl-2" />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <div onMouseEnter={onPopperOpen}>
                      <DropdownItem
                        onClick={() => {}}
                        color="link"
                        className="btn-sm justfiy-self-end text-dark"
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.SendQuestionnaire.key,
                          })
                        }
                      >
                        {t(`${translationPath}send-questionnaire`)}
                      </DropdownItem>
                    </div>
                    <div onMouseEnter={onPopperOpen}>
                      <DropdownItem
                        onClick={() => {}}
                        color="link"
                        className="btn-sm justfiy-self-end text-dark"
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.SendOffer.key,
                          })
                        }
                      >
                        {t(`${translationPath}send-offer`)}
                      </DropdownItem>
                    </div>
                    <DropdownItem
                      onClick={() => {}}
                      color="link"
                      className="btn-sm justfiy-self-end text-dark"
                    >
                      {t(`${translationPath}send-reminders`)}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
              <NavItem
                color="link"
                className="btn nav-link nav-link-shadow px-2 float-right text-gray font-weight-normal"
                onClick={() => {}}
              >
                <i className="fas fa-sliders-h" />
              </NavItem>
            </Nav>
          </Nav>
          <div className="m-4 p-3 d-flex justify-content-center">
            {loading ? (
              <BoardsLoader />
            ) : (
              <div className="d-flex w-100 flex-wrap">
                {applicants.map((applicant, index) => (
                  <ShareCard
                    key={`applicationKey${index + 1}`}
                    connections={connections}
                    title={`${applicant.first_name} ${applicant.last_name}`}
                    subtitle={`${applicant.position} at ${applicant.company}`}
                    isSelected={applicant.isSelected}
                    tabs={applicant.skills}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </div>
  );
};

export default ShareApplicant;

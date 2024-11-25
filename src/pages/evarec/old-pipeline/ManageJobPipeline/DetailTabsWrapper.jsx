import React, { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
} from '../../../../helpers';
import { SubscriptionServicesEnum } from '../../../../enums';
import { NoPermissionComponent } from '../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageApplicationsPermissions } from '../../../../permissions';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';

const DetailTabsWrapper = ({ id, tab, rightTabs }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const { t } = useTranslation(parentTranslationPath);
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

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

  return (
    <>
      <Nav
        tabs
        className="d-flex clearfix align-items-center justify-content-between position-relative tabs-with-actions"
      >
        <Nav tabs className="d-flex clearfix border-0">
          <NavItem>
            <NavLink
              active={tab === 'pipeline'}
              to={`/recruiter/job/manage/pipeline/${id}`}
              tag={Link}
            >
              {t(`${translationPath}pipeline`)}
            </NavLink>
          </NavItem>
          <NavItem onMouseEnter={onPopperOpen}>
            <NavLink
              active={window.location.pathname.includes('logs')}
              to={`/recruiter/job/manage/logs/${id}`}
              tag={Link}
              style={{
                cursor: !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageApplicationsPermissions.ViewLogs.key,
                })
                  ? 'not-allowed'
                  : 'pointer',
              }}
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageApplicationsPermissions.ViewLogs.key,
                })
              }
            >
              {t(`${translationPath}logs`)}
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="float-right d-flex align-items-center position-absolute right-0 eva-rec-right-tabs-wrapper">
          {rightTabs}
        </Nav>
      </Nav>
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

export default DetailTabsWrapper;

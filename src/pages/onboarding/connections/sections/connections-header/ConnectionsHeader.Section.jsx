import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import './ConnectionsHeader.Style.scss';
import { OnboardingTypesEnum } from '../../../../../enums';
import { getIsAllowedPermissionV2 } from '../../../../../helpers';
import {
  ManageDirectoryPermissions,
  ManageFlowPermissions,
  ManageFolderPermissions,
} from '../../../../../permissions';
import { useSelector } from 'react-redux';

export const ConnectionsHeaderSection = ({
  activeConnections,
  onConnectionsClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  return (
    <div className="connections-header-actions-wrapper actions-wrapper pt-3">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-inline-flex mb-1">
          <span>
            <div className="d-inline-flex-center p-2 bg-gray-light br-1rem">
              <span
                className={
                  (activeConnections.space && OnboardingTypesEnum.Spaces.icon)
                  || activeConnections.folder.icon
                }
              />
            </div>
            <span className="px-2">
              {(activeConnections.space && activeConnections.space.title)
                || activeConnections.folder.title}
            </span>
          </span>
        </span>
        <div className="d-inline-flex flex-wrap px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-2 mb-3 c-gray-primary"
            onClick={onConnectionsClicked({
              key: OnboardingTypesEnum.Flows.key,
              flowCreateLocation: 'outer',
              isSurvey: true,
            })}
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: ManageFlowPermissions.CreateFlow.key,
                permissions: permissionsReducer,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}survey`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent miw-0 mx-2 mb-3 c-gray-primary"
            onClick={onConnectionsClicked({
              key: OnboardingTypesEnum.Flows.key,
              flowCreateLocation: 'outer',
            })}
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: ManageFlowPermissions.CreateFlow.key,
                permissions: permissionsReducer,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-2">{t(`${translationPath}add-flow-header`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent miw-0 mx-2 mb-3 c-gray-primary"
            disabled={
              !activeConnections.space
              || !getIsAllowedPermissionV2({
                permissionId: ManageFolderPermissions.CreateFolder.key,
                permissions: permissionsReducer,
              })
            }
            onClick={onConnectionsClicked({
              key: OnboardingTypesEnum.Folders.key,
            })}
          >
            <span className="fas fa-folder-plus" />
            <span className="px-2">{t(`${translationPath}folder`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent miw-0 mx-2 mb-3 c-gray-primary"
            onClick={onConnectionsClicked({
              inviteLocation: 'outer',
            })}
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: ManageDirectoryPermissions.ManageSendInvitation.key,
                permissions: permissionsReducer,
              })
            }
          >
            <span className="fas fa-user-plus" />
            <span className="px-2">{t(`${translationPath}invite`)}</span>
          </ButtonBase>
        </div>
      </div>
      <div></div>
    </div>
  );
};

ConnectionsHeaderSection.propTypes = {
  activeConnections: PropTypes.shape({
    space: PropTypes.instanceOf(Object),
    folder: PropTypes.instanceOf(Object),
  }).isRequired,
  onConnectionsClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

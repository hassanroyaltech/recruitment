import React from 'react';
import PropTypes from 'prop-types';
import { OnboardingTypesEnum } from '../../../../../../../enums';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  getIsAllowedPermissionV2,
  GlobalDisplayDateTimeFormat,
} from '../../../../../../../helpers';
import { useSelector } from 'react-redux';
import {
  ManageFlowPermissions,
  ManageFolderPermissions,
} from '../../../../../../../permissions';

export const ConnectionsCardSection = ({
  items,
  isFolder,
  onConnectionsClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  return (
    <div className="connections-card-section section-wrapper">
      {items.map((item, index) => (
        <ButtonBase
          key={`connectionsCardKey${item.uuid}-${index + 1}`}
          disabled={
            !getIsAllowedPermissionV2({
              permissionId:
                (isFolder && ManageFolderPermissions.ViewFolder.key)
                || ManageFlowPermissions.ViewFlow.key,
              permissions: permissionsReducer,
            })
          }
          className="connections-card-wrapper"
          onClick={onConnectionsClicked({
            key:
              (isFolder && OnboardingTypesEnum.Folders.key)
              || OnboardingTypesEnum.Flows.key,
            selectedItem: item,
            isNavigate: true,
          })}
        >
          <div className="connections-card-body">
            <div className="connections-card-row mb-3">
              <span
                className={`fz-before-18px ${
                  isFolder ? item.icon : OnboardingTypesEnum.Flows.icon
                }`}
              />
            </div>
            <div className="connections-card-row title-wrapper">
              <span className="header-text">{item.title}</span>
            </div>
            <div className="connections-card-row">
              <span>{t(`${translationPath}created-at`)}</span>
              <span className="px-1">
                {moment(item.created_at)
                  .locale(i18next.language)
                  .format(GlobalDisplayDateTimeFormat)}
              </span>
            </div>
          </div>
          <div className="connections-card-footer">
            <div className="connections-card-row fj-end">
              <span className="fas fa-arrow-right" />
            </div>
          </div>
        </ButtonBase>
      ))}
    </div>
  );
};

ConnectionsCardSection.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  isFolder: PropTypes.bool,
  onConnectionsClicked: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

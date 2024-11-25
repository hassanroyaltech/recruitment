import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SystemActionsEnum } from '../../../../../../../enums';
import { getIsAllowedPermissionV2 } from '../../../../../../../helpers';
import { useSelector } from 'react-redux';
import { CampaignsPermissions } from '../../../../../../../permissions';

export const CardActionsComponent = ({
  isDeletable,
  defaultActions,
  onActionsClicked,
}) => {
  const { t } = useTranslation('Shared');
  const actionsClickHandler = useCallback(
    (action) => () => {
      if (onActionsClicked) onActionsClicked(action);
    },
    [onActionsClicked],
  );
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  return (
    <div className="card-actions-wrapper sub-childs-wrapper">
      {defaultActions.map((item, index) => (
        <React.Fragment key={`campaignCardActionsKeys${item.key}`}>
          <ButtonBase
            className="btns theme-transparent theme-solid-hover fj-start mx-0 br-0 w-100"
            disabled={
              !isDeletable
              || !getIsAllowedPermissionV2({
                permissionId:
                  item.key === SystemActionsEnum.edit.key
                    ? CampaignsPermissions.UpdateCampaigns.key
                    : item.key === SystemActionsEnum.delete.key
                      ? CampaignsPermissions.DeleteCampaigns.key
                      : '',
                permissions: permissionsReducer,
              })
            }
            onClick={actionsClickHandler(item)}
          >
            <span className={`px-2 ${item.icon}`} />
            <span className="px-2">{t(item.value)}</span>
          </ButtonBase>
          {index < defaultActions.length - 1 && (
            <div className="px-2">
              <div className="separator-h" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

CardActionsComponent.propTypes = {
  defaultActions: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(SystemActionsEnum).map((item) => item)),
  ),
  onActionsClicked: PropTypes.func,
  isDeletable: PropTypes.bool,
};
CardActionsComponent.defaultProps = {
  defaultActions: [SystemActionsEnum.edit, SystemActionsEnum.delete],
  onActionsClicked: undefined,
  isDeletable: false,
};

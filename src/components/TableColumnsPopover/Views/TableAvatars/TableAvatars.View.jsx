import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import {
  getDataFromObject,
  getIsAllowedPermissionV2,
  StringToColor,
} from '../../../../helpers';
import i18next from 'i18next';
import { ManageApplicationsPermissions } from '../../../../permissions';
import { useSelector } from 'react-redux';
import TeamsModal from '../../../Views/TeamsModal/TeamsModal';
import ButtonBase from '@mui/material/ButtonBase';
import { TablesViewActionsEnum } from '../../../../enums';
import LetterAvatar from '../../../Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from '../../../../utils/constants/colorMaps';
const TableAvatarsView = ({
  row,
  rowIndex,
  columnKey,
  isWithText,
  maxAvatars,
  idRef,
  viewItem,
  onReloadData,
  columnName,
}) => {
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [teamsModal, setTeamsModal] = useState(null);
  const handleInvite = useCallback(() => {
    if (onReloadData)
      onReloadData({
        row,
        viewItem,
      });
  }, [columnName, onReloadData, row, rowIndex, viewItem]);
  const classes = useOverlayedAvatarStyles();

  return (
    <>
      {!!teamsModal && (
        <TeamsModal
          isOpen={!!teamsModal}
          onClose={() => {
            setTeamsModal(null);
          }}
          match={{ params: { id: teamsModal } }}
          uuid={teamsModal}
          getAllActive={handleInvite}
          type="ATS"
        />
      )}
      <div className={`table-avatars-wrapper table-view-wrapper d-inline-flex ${classes.root}`}>
        {(isWithText
          && ((Array.isArray(getDataFromObject(row, columnKey, true))
            && getDataFromObject(row, columnKey, true).map((item, index) => (
              <div
                className="d-inline-flex-v-center"
                key={`${idRef}${index + 1}-${rowIndex + 1}`}
              >
                <Avatar style={{ backgroundColor: StringToColor(item) }}>
                  {item && item.split(' ').map((word) => word[0])}
                </Avatar>
                {isWithText ? (
                  viewItem.is_link && row[viewItem.url_key] ? (
                    <a
                      href={row[viewItem.url_key]}
                      target={viewItem.is_new_tab && '_blank'}
                    >
                      <span className="px-2">{item}</span>
                    </a>
                  ) : (
                    <span className="px-2">{item}</span>
                  )
                ) : (
                  ''
                )}
              </div>
            )))
            || (typeof getDataFromObject(row, columnKey, true) === 'string' && (
              <div className="d-inline-flex-v-center">
                <Avatar
                  style={{
                    backgroundColor: StringToColor(
                      getDataFromObject(row, columnKey),
                    ),
                  }}
                >
                  {getDataFromObject(row, columnKey, true)
                    && getDataFromObject(row, columnKey, true)
                      .split(' ')
                      .map((word) => word[0])}
                </Avatar>
                {isWithText ? (
                  viewItem.is_link && row[viewItem.url_key] ? (
                    <a
                      href={row[viewItem.url_key]}
                      target={viewItem.is_new_tab && '_blank'}
                    >
                      <Typography className="px-2">
                        {getDataFromObject(row, columnKey, true)}
                      </Typography>
                    </a>
                  ) : (
                    <Typography className="px-2">
                      {getDataFromObject(row, columnKey, true)}
                    </Typography>
                  )
                ) : (
                  ''
                )}
              </div>
            )))) || (
          <AvatarGroup max={maxAvatars}>
            {(Array.isArray(getDataFromObject(row, columnKey, true))
              && getDataFromObject(row, columnKey, true).map((item, index) => (
                <>
                  <LetterAvatar
                    key={`${idRef}${index + 1}-${rowIndex + 1}`}
                    name={
                      item
                        && (item?.[i18next.language]
                          || item.en
                          || (item.first_name
                            && `${item.first_name}${
                              (item.last_name && ` ${item.last_name}`) || ''
                            }`)
                          || item
                          || '')
                    }
                  />
                </>
              )))
              || (typeof getDataFromObject(row, columnKey, true) === 'string' && (
                <Avatar
                  style={{
                    backgroundColor: StringToColor(
                      getDataFromObject(row, columnKey),
                    ),
                  }}
                  title={getDataFromObject(row, columnKey, true)}
                >
                  {getDataFromObject(row, columnKey, true)
                    && getDataFromObject(row, columnKey, true)
                      .split(' ')
                      .map((word) => word[0])}
                </Avatar>
              ))}
          </AvatarGroup>
        )}
        {viewItem?.action === TablesViewActionsEnum.InviteTeamMembers.key && (
          <div
            className="avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
            key="add"
            role="button"
            tabIndex={0} // Make element focusable
            onClick={() => setTeamsModal(row.uuid)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setTeamsModal(row.uuid); // Trigger on key press
            }}
            style={{
              pointerEvents: !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageApplicationsPermissions.MangeTeams.key,
              })
                ? 'none'
                : '',
            }}
          >
            <i className="fa fa-plus" />
          </div>
        )}
      </div>
    </>
  );
};

TableAvatarsView.propTypes = {
  columnKey: PropTypes.string.isRequired,
  row: PropTypes.instanceOf(Object).isRequired,
  rowIndex: PropTypes.number.isRequired,
  maxAvatars: PropTypes.number,
  isWithText: PropTypes.bool,
  idRef: PropTypes.string,
  viewItem: PropTypes.instanceOf(Object).isRequired,
  onReloadData: PropTypes.func,
  columnName: PropTypes.string,
};

TableAvatarsView.defaultProps = {
  maxAvatars: 5,
  isWithText: false,
  idRef: 'TableAvatarsViewRef',
};

export default TableAvatarsView;

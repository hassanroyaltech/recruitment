import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import { LoadableImageComponant, TooltipsComponent } from '../../../../components';
import defaultUserImage from '../../../../assets/icons/user-avatar.svg';
import { StringToColor } from '../../../../helpers';
import './Avatar.List.Style.scss';
import AvatarGroup from '@mui/material/AvatarGroup';

// eslint-disable-next-line react/display-name
export const AvatarList = memo(({ members, max, dimension }) => {
  const dimensions = {
    height: `${dimension}px !important`,
    width: `${dimension}px !important`,
  };
  return (
    <div className="avatars-list section-wrapper" dir="ltr">
      <AvatarGroup max={max}>
        {members
          && members.slice(0, max).map((item, index) => (
            <TooltipsComponent
              key={`invitedTeamsKeys${index + 1}`}
              contentComponent={
                item.url || !item.name ? (
                  <Avatar
                    className="user-avatar-item"
                    src={item.url || defaultUserImage}
                    sx={{
                      backgroundColor: StringToColor(item.name),
                      ...dimensions,
                    }}
                  />
                ) : (
                  <Avatar
                    className="user-avatar-item"
                    sx={{
                      backgroundColor: StringToColor(item.name),
                      ...dimensions,
                    }}
                  >
                    {(item.name && item.name.split(' ').map((word) => word[0]))
                      || ''}
                  </Avatar>
                )
              }
              title={item.name}
            />
          ))}
      </AvatarGroup>
    </div>
  );
});

AvatarList.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  max: PropTypes.number,
  dimension: PropTypes.number,
};
AvatarList.defaultProps = {
  members: undefined,
  max: 3,
  dimension: 30,
};

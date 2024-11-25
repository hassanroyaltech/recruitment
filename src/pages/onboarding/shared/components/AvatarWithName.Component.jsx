import Avatar from '@mui/material/Avatar';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { AvatarList } from './AvatarsList.Component';

export const AvatarWithName = memo(({ member, dimension }) => {
  const avatarStyles = {
    height: `${dimension}px !important`,
    width: `${dimension}px !important`,
    marginInlineStart: '0px',
    marginInlineEnd: '7px',
  };
  return (
    <div className="avatar-with-name  ">
      <Avatar className="user-avatar-item " src={member?.url} sx={avatarStyles} />
      <span> {member?.name}</span>
    </div>
  );
});
AvatarWithName.displayName = 'AvatarWithName';
AvatarWithName.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  dimension: PropTypes.number,
};
AvatarWithName.defaultProps = {
  members: undefined,
  dimension: 30,
};

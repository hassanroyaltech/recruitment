import * as React from 'react';
import PT from 'prop-types';
import { Box, Avatar, Typography } from '@mui/material';
import { AvatarIcon } from '../../form-builder/icons';

export default function Person({ name, avatar }) {
  return (
    <Box display="flex" sx={{ mr: 2 }}>
      <Box display="flex" alignitems="center" sx={{ mr: 2 }}>
        {!avatar ? (
          <AvatarIcon />
        ) : (
          <Avatar alt={name} src={avatar} sx={{ width: 20, height: 20 }} />
        )}
      </Box>
      <Typography>{name}</Typography>
    </Box>
  );
}

Person.propTypes = {
  name: PT.string,
  avatar: PT.string,
};

Person.defaultProps = {
  name: '',
  avatar: '',
};

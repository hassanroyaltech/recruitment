import * as React from 'react';
import { Box } from '@mui/material';
import FullTextLogo from '../form-builder/icons/fullTextLogo';

export default function LoginHeader() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        py: 2.5,
        bgcolor: 'light.main',
        boxShadow: (theme) => theme.shadow.divider.bottom,
      }}
    >
      <FullTextLogo />
    </Box>
  );
}

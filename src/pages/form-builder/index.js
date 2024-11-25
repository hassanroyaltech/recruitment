import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import Layout from './features/Layout';
import './styles/index.scss';

// this is the entry ponint for the form-builder module
// you'll find routing in /features/EditorPanel/routes.js
export default function FormBuilder() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

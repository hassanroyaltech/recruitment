import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import FormBuilderTheme from './theme/FormBuilder.Theme';
import moment from 'moment';
import './FormBuilder.Style.scss';
import { SwitchRouteComponent } from '../../components';
import { FormBuilderLayoutRoute } from '../../routes';

const FormBuilderLayout = () => {
  moment.locale('en');
  return (
    <div className="forms-layout-wrapper layout-wrapper">
      <ThemeProvider theme={FormBuilderTheme}>
        <SwitchRouteComponent routes={FormBuilderLayoutRoute} />;
      </ThemeProvider>
    </div>
  );
};

export default FormBuilderLayout;

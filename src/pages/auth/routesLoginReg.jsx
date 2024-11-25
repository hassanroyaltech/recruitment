// React
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Components
import Login from './Login';
import Registration from './Registration';
import RegistrationEmailConfirm from './RegistrationEmailConfirm';
import RegisterSubUser from './RegisterSubuserConfirm';
import ForgetPassword from './ForgetPassword';
import ConfirmPassword from './ConfirmPassword';
import LoginThirdPartiesPage from './LoginThirdParties.Page';
// const LoginThirdPartiesPage = lazy(() => import('./LoginThirdParties.Page'));

// Main class component
const LoginRegisterRouter = () => (
  <div>
    {/* Render JSX */}
    <Switch>
      <Route exact path="/el/login" component={Login} />
      <Route exact path="/el/change-password/:token" component={ConfirmPassword} />
      <Route exact path="/el/registration-y" component={Registration} />
      <Route exact path="/el/forget-password" component={ForgetPassword} />
      <Route
        exact
        path="/el/login-third-parties"
        component={LoginThirdPartiesPage}
      />
      <Route
        exact
        path="/el/login-third-parties/:providerKey"
        component={LoginThirdPartiesPage}
      />
      <Route
        exact
        path="/oauth/web/adfs/authhandler"
        component={LoginThirdPartiesPage}
      />
      <Route
        exact
        path="/el/registration/:token"
        component={RegistrationEmailConfirm}
      />
      <Route exact path="/el/registersubuser/:token" component={RegisterSubUser} />
      <Route strict path="/el/*" component={Login} />
    </Switch>
  </div>
);
export default LoginRegisterRouter;

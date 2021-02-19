import React from 'react';
import { AuthorizationContext, DevSettings, DefaultRoles, User, ProvideAuth } from '../auth/auth';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { cloneDeep } from 'lodash';
import { MemoryRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from '../components/routes/PrivateRoute';

const DEFAULT_TEST_USER: User = {
  identityProvider: 'Bookface',
  userId: '42',
  userDetails: 'Unremarkable',
  userRoles: [],
};
const SUCCESS_MESSAGE = "Success; you're authorized!";
const LOGIN_MESSAGE = "You weren't logged in, so we redirected you!";
//const UNAUTHORIZED_MESSAGE = "You aren't authorized to view this page, so you've been sent to purgatory.";
const RENDER_ON_AUTH = () => <div>{SUCCESS_MESSAGE}</div>;
const RENDER_ON_LOGIN = () => <div>{LOGIN_MESSAGE}</div>;
//const RENDER_ON_UNAUTHORIZED = () => <div>{UNAUTHORIZED_MESSAGE}</div>;
const DEV_OVERRIDE_SETTINGS: DevSettings = {
  on: true,
  userOverride: cloneDeep(DEFAULT_TEST_USER),
};
const CUSTOM_CONTEXT: AuthorizationContext = {
  user: cloneDeep(DEFAULT_TEST_USER),
  loginPath: '/login',
  unauthorizedPath: '/unauthorized',
  devSettings: cloneDeep(DEV_OVERRIDE_SETTINGS),
};

describe('PrivateRoute correctly renders based on authorization', () => {
  test('PrivateRoute renders its children when user holds a role other than the roles listed in allowedRoles when allBut == true', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute
              exact
              path="/home"
              allowedRoles={[DefaultRoles.Anonymous]}
              allBut={true}
              unauthorizedRedirect={<Redirect to="/login" />}
            >
              <RENDER_ON_AUTH />
            </PrivateRoute>
            <Route path="/login">
              <RENDER_ON_LOGIN />
            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    );
    const hopefullySuccessDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullySuccessDiv).toBeInTheDocument();
    const hopefullyNotLoginDiv = screen.queryByText(LOGIN_MESSAGE);
    expect(hopefullyNotLoginDiv).not.toBeInTheDocument();
  });
  test('PrivateRoute renders its children when user holds a role other than the roles listed in allowedRoles when allBut == true, even when having a role listed in allowedRoles', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Authenticated, DefaultRoles.Anonymous];
    render(
      <ProvideAuth customContext={testContext}>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute
              exact
              path="/home"
              allowedRoles={[DefaultRoles.Anonymous]}
              allBut={true}
              unauthorizedRedirect={<Redirect to="/login" />}
            >
              <RENDER_ON_AUTH />
            </PrivateRoute>
            <Route path="/login">
              <RENDER_ON_LOGIN />
            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    );
    const hopefullySuccessDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullySuccessDiv).toBeInTheDocument();
    const hopefullyNotLoginDiv = screen.queryByText(LOGIN_MESSAGE);
    expect(hopefullyNotLoginDiv).not.toBeInTheDocument();
  });
  test('PrivateRoute renders its children when user holds a role included in the roles listed in allowedRoles when allBut == false', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute
              exact
              path="/home"
              allowedRoles={[DefaultRoles.Authenticated]}
              unauthorizedRedirect={<Redirect to="/login" />}
            >
              <RENDER_ON_AUTH />
            </PrivateRoute>
            <Route path="/login">
              <RENDER_ON_LOGIN />
            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    );
    const hopefullySuccessDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullySuccessDiv).toBeInTheDocument();
    const hopefullyNotLoginDiv = screen.queryByText(LOGIN_MESSAGE);
    expect(hopefullyNotLoginDiv).not.toBeInTheDocument();
  });
  test('PrivateRoute renders its redirect component when user does not hold any roles in allowedRoles when allBut == false', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute
              exact
              path="/home"
              allowedRoles={[DefaultRoles.Anonymous]}
              unauthorizedRedirect={<Redirect to="/login" />}
            >
              <RENDER_ON_AUTH />
            </PrivateRoute>
            <Route path="/login">
              <RENDER_ON_LOGIN />
            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    );
    const hopefullyLoginDiv = screen.queryByText(LOGIN_MESSAGE);
    expect(hopefullyLoginDiv).toBeInTheDocument();
    const hopefullyNotSuccessDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullyNotSuccessDiv).not.toBeInTheDocument();
  });
  test('PrivateRoute renders its redirect component when user holds only roles in allowedRoles when allBut == true', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Anonymous, DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute
              exact
              path="/home"
              allowedRoles={[DefaultRoles.Anonymous, DefaultRoles.Authenticated]}
              allBut={true}
              unauthorizedRedirect={<Redirect to="/login" />}
            >
              <RENDER_ON_AUTH />
            </PrivateRoute>
            <Route path="/login">
              <RENDER_ON_LOGIN />
            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    );
    const hopefullyLoginDiv = screen.queryByText(LOGIN_MESSAGE);
    expect(hopefullyLoginDiv).toBeInTheDocument();
    const hopefullyNotSuccessDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullyNotSuccessDiv).not.toBeInTheDocument();
  });
});

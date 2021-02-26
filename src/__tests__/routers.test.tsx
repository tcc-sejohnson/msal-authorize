import React from 'react';
import { Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import HiddenRoute from '../components/routes/HiddenRoute';
import ProtectedRoute from '../components/routes/ProtectedRoute';
import UnauthorizedRedirectRoute from '../components/routes/UnauthorizedRedirectRoute';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const SUCCESS_MESSAGE = "Success; you're authorized!";
const RENDER_ON_AUTH = () => <div>{SUCCESS_MESSAGE}</div>;
const AUTHENTICATING_MESSAGE = "You're authenticating, hold on!";
const RENDER_ON_AUTHENTICATING = () => <div>{AUTHENTICATING_MESSAGE}</div>;
const UNAUTHORIZED_MESSAGE = "You're not allowed. Go away.";
const RENDER_ON_UNAUTHORIZED = () => <div>{UNAUTHORIZED_MESSAGE}</div>;

describe('Randome AuthRouter features work correctly', () => {
  it('handles route bouncing like it should', async () => {
    const roles = ['anonymous', 'authenticated'];

    render(
      <MemoryRouter>
        <ProtectedRoute
          exact
          path="/"
          userRoles={roles}
          allowedRoles={['anonymous', 'authenticated']}
          allBut={true}
          isAuthenticating={false}
          redirect={<Redirect to="/redirect1" />}
        >
          <div>Shouldn&apos;t ever land here!</div>
        </ProtectedRoute>
        <ProtectedRoute
          path="/redirect1"
          userRoles={roles}
          allowedRoles={['anonymous', 'authenticated']}
          allBut={true}
          isAuthenticating={false}
          redirect={<Redirect to="/redirect2" />}
        >
          <div>Shouldn&apos;t ever land here!</div>
        </ProtectedRoute>
        <ProtectedRoute
          path="/redirect2"
          userRoles={roles}
          allowedRoles={['anonymous', 'authenticated']}
          allBut={true}
          isAuthenticating={false}
          redirect={<Redirect to="/redirect3" />}
        >
          <div>Shouldn&apos;t ever land here!</div>
        </ProtectedRoute>
        <ProtectedRoute
          path="/redirect3"
          userRoles={roles}
          allowedRoles={['anonymous', 'authenticated']}
          allBut={true}
          isAuthenticating={false}
          redirect={<Redirect to="/redirect4" />}
        >
          <div>Shouldn&apos;t ever land here!</div>
        </ProtectedRoute>
        <ProtectedRoute
          path="/redirect4"
          userRoles={roles}
          allowedRoles={['anonymous', 'authenticated']}
          isAuthenticating={false}
          redirect={<Redirect to="/redirect5" />}
        >
          <div>Should land here!</div>
        </ProtectedRoute>
        <ProtectedRoute
          path="/redirect5"
          userRoles={roles}
          allowedRoles={['anonymous', 'authenticated']}
          allBut={true}
          isAuthenticating={false}
          redirect={<Redirect to="/redirect6" />}
        >
          <div>Shouldn&apos;t ever land here!</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(await screen.findByText('Should land here!')).toBeInTheDocument();
    expect(screen.queryByText("Shouldn't ever land here!")).not.toBeInTheDocument();
  });
});

describe(`AuthRouter works correctly with all route components`, () => {
  describe("HiddenRoute hides when it should and doesn't when it shouldn't", () => {
    it('displays the children.', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
          >
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );

      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('briefly displays a custom authenticating message, then displays the children.', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
            authenticatingComponent={<RENDER_ON_AUTHENTICATING />}
          >
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );

      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders its children when the user holds a role other than the roles listed in allowedRoles and allBut == true', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
          >
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders its children when user holds a role other than the roles listed in allowedRoles when allBut == true, even when having a role listed in allowedRoles', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
          >
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders its children when user holds a role included in the roles listed in allowedRoles when allBut == false', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute exact path="/" userRoles={roles} allowedRoles={['authenticated']} isAuthenticating={false}>
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('does not render its children when user does not hold any roles in allowedRoles and allBut == false', () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute exact path="/" userRoles={roles} allowedRoles={['global_admin']} isAuthenticating={false}>
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );
      const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
      expect(hopefullyNotDiv).not.toBeInTheDocument();
    });
    it('does not render its children when user holds only roles in allowedRoles and allBut == true', () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <HiddenRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous', 'authenticated']}
            allBut={true}
            isAuthenticating={false}
          >
            <RENDER_ON_AUTH />
          </HiddenRoute>
        </MemoryRouter>
      );
      const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
      expect(hopefullyNotDiv).not.toBeInTheDocument();
    });
  });
  describe("ProtectedRoute renders its children when it should and doesn't when it shouldn't", () => {
    it('displays its children.', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );

      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('briefly displays a custom authenticating message, then displays its children.', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
            authenticatingComponent={<RENDER_ON_AUTHENTICATING />}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );

      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders children when user holds a role other than the roles listed in allowedRoles and allBut == true', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders children when user holds a role other than the roles listed in allowedRoles and allBut == true, even when having a role listed in allowedRoles', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous']}
            allBut={true}
            isAuthenticating={false}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders children when user holds a role included in the roles listed in allowedRoles and allBut == false', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['authenticated']}
            isAuthenticating={false}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders its redirect when user does not hold any roles in allowedRoles and allBut == false', () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['global_admin']}
            isAuthenticating={false}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );
      const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
      expect(hopefullyNotDiv).not.toBeInTheDocument();
    });
    it('renders its redirect when user holds only roles in allowedRoles and allBut == true', () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <ProtectedRoute
            exact
            path="/"
            userRoles={roles}
            allowedRoles={['anonymous', 'authenticated']}
            allBut={true}
            isAuthenticating={false}
            redirect={<RENDER_ON_UNAUTHORIZED />}
          >
            <RENDER_ON_AUTH />
          </ProtectedRoute>
        </MemoryRouter>
      );
      const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
      expect(hopefullyNotDiv).not.toBeInTheDocument();
    });
  });
  describe("UnauthorizedRedirectRoute renders its children when it should and redirects to the router's default unauthorized route when it shouldn't", () => {
    it('displays its children.', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['anonymous']}
              allBut={true}
              isAuthenticating={false}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );

      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('briefly displays a custom authenticating message, then displays its children.', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['anonymous']}
              allBut={true}
              isAuthenticating={false}
              authenticatingComponent={<RENDER_ON_AUTHENTICATING />}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );

      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders children when user holds a role other than the roles listed in allowedRoles and allBut == true', async () => {
      const roles = ['authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['anonymous']}
              allBut={true}
              isAuthenticating={false}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders children when user holds a role other than the roles listed in allowedRoles and allBut == true, even when having a role listed in allowedRoles', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['anonymous']}
              allBut={true}
              isAuthenticating={false}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders children when user holds a role included in the roles listed in allowedRoles and allBut == false', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['authenticated']}
              isAuthenticating={false}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
    });
    it('renders its redirect when user does not hold any roles in allowedRoles and allBut == false', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['global_admin']}
              isAuthenticating={false}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(UNAUTHORIZED_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
      const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
      expect(hopefullyNotDiv).not.toBeInTheDocument();
    });
    it('renders its redirect when user holds only roles in allowedRoles and allBut == true', async () => {
      const roles = ['anonymous', 'authenticated'];

      render(
        <MemoryRouter>
          <Switch>
            <UnauthorizedRedirectRoute
              exact
              path="/"
              userRoles={roles}
              allowedRoles={['anonymous', 'authenticated']}
              allBut={true}
              isAuthenticating={false}
            >
              <RENDER_ON_AUTH />
            </UnauthorizedRedirectRoute>
            <Route path="/unauthorized">
              <RENDER_ON_UNAUTHORIZED />
            </Route>
          </Switch>
        </MemoryRouter>
      );
      const hopefullyDiv = await screen.findByText(UNAUTHORIZED_MESSAGE);
      expect(hopefullyDiv).toBeInTheDocument();
      const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
      expect(hopefullyNotDiv).not.toBeInTheDocument();
    });
  });
});

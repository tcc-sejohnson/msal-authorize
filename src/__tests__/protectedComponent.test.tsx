import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedComponent from '../components/private_components/ProtectedComponent';

const SUCCESS_MESSAGE = "Success; you're authorized!";
const RENDER_ON_AUTH = () => <div>{SUCCESS_MESSAGE}</div>;
const UNAUTHORIZED_MESSAGE = "You're not allowed. Go away.";
const RENDER_ON_UNAUTHORIZED = () => <div>{UNAUTHORIZED_MESSAGE}</div>;

describe('ProtectedComponent correctly renders based on authorization', () => {
  it('briefly displays the default authenticating message, then displays its children.', async () => {
    const roles = ['authenticated'];

    render(
      <ProtectedComponent
        userRoles={roles}
        allowedRoles={['anonymous']}
        allBut={true}
        isAuthenticating={false}
        unauthorizedComponent={<RENDER_ON_UNAUTHORIZED />}
      >
        <RENDER_ON_AUTH />
      </ProtectedComponent>
    );
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();

    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();
  });
  it('renders children when user holds a role other than the roles listed in allowedRoles and allBut == true', async () => {
    const roles = ['authenticated'];

    render(
      <ProtectedComponent
        userRoles={roles}
        allowedRoles={['anonymous']}
        allBut={true}
        isAuthenticating={false}
        unauthorizedComponent={<RENDER_ON_UNAUTHORIZED />}
      >
        <RENDER_ON_AUTH />
      </ProtectedComponent>
    );
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();

    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();
  });
  it('renders children when user holds a role other than the roles listed in allowedRoles and allBut == true, even when having a role listed in allowedRoles', async () => {
    const roles = ['anonymous', 'authenticated'];

    render(
      <ProtectedComponent
        userRoles={roles}
        allowedRoles={['anonymous']}
        allBut={true}
        isAuthenticating={false}
        unauthorizedComponent={<RENDER_ON_UNAUTHORIZED />}
      >
        <RENDER_ON_AUTH />
      </ProtectedComponent>
    );
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();

    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();
  });
  it('renders children when user holds a role included in the roles listed in allowedRoles and allBut == false', async () => {
    const roles = ['anonymous', 'authenticated'];

    render(
      <ProtectedComponent
        userRoles={roles}
        allowedRoles={['authenticated']}
        isAuthenticating={false}
        unauthorizedComponent={<RENDER_ON_UNAUTHORIZED />}
      >
        <RENDER_ON_AUTH />
      </ProtectedComponent>
    );
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();

    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(UNAUTHORIZED_MESSAGE)).not.toBeInTheDocument();
  });
  it('renders its unauthorizedComponent when user does not hold any roles in allowedRoles and allBut == false', async () => {
    const roles = ['anonymous', 'authenticated'];

    render(
      <ProtectedComponent
        userRoles={roles}
        allowedRoles={['global_admin']}
        isAuthenticating={false}
        unauthorizedComponent={<RENDER_ON_UNAUTHORIZED />}
      >
        <RENDER_ON_AUTH />
      </ProtectedComponent>
    );
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument();

    expect(await screen.findByText(UNAUTHORIZED_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument();
  });
  it('renders its unauthorizedComponent when user holds only roles in allowedRoles and allBut == true', async () => {
    const roles = ['anonymous', 'authenticated'];

    render(
      <ProtectedComponent
        userRoles={roles}
        allowedRoles={['anonymous', 'authenticated']}
        allBut={true}
        isAuthenticating={false}
        unauthorizedComponent={<RENDER_ON_UNAUTHORIZED />}
      >
        <RENDER_ON_AUTH />
      </ProtectedComponent>
    );
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument();

    expect(await screen.findByText(UNAUTHORIZED_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HiddenComponent from '../components/private_components/HiddenComponent';

const SUCCESS_MESSAGE = "Success; you're authorized!";
const RENDER_ON_AUTH = () => <div>{SUCCESS_MESSAGE}</div>;

describe('HiddenComponent correctly renders based on authorization', () => {
  it('renders its children when the user holds a role other than the roles listed in allowedRoles and allBut == true', async () => {
    const roles = ['authenticated'];
    render(
      <HiddenComponent userRoles={roles} allowedRoles={['anonymous']} isAuthenticating={false} allBut={true}>
        <RENDER_ON_AUTH />
      </HiddenComponent>
    );
    const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
    expect(hopefullyDiv).toBeInTheDocument();
  });
  it('renders its children when user holds a role other than the roles listed in allowedRoles when allBut == true, even when having a role listed in allowedRoles', async () => {
    const roles = ['anonymous', 'authenticated'];
    render(
      <HiddenComponent userRoles={roles} allowedRoles={['anonymous']} isAuthenticating={false} allBut={true}>
        <RENDER_ON_AUTH />
      </HiddenComponent>
    );
    const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
    expect(hopefullyDiv).toBeInTheDocument();
  });
  it('renders its children when user holds a role included in the roles listed in allowedRoles when allBut == false', async () => {
    const roles = ['anonymous', 'authenticated'];
    render(
      <HiddenComponent userRoles={roles} allowedRoles={['authenticated']} isAuthenticating={false}>
        <RENDER_ON_AUTH />
      </HiddenComponent>
    );
    const hopefullyDiv = await screen.findByText(SUCCESS_MESSAGE);
    expect(hopefullyDiv).toBeInTheDocument();
  });
  it('does not render its children when user does not hold any roles in allowedRoles and allBut == false', () => {
    const roles = ['anonymous', 'authenticated'];
    render(
      <HiddenComponent userRoles={roles} allowedRoles={['global_admin']} isAuthenticating={false}>
        <RENDER_ON_AUTH />
      </HiddenComponent>
    );
    const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullyNotDiv).not.toBeInTheDocument();
  });
  it('does not render its children when user holds only roles in allowedRoles and allBut == true', () => {
    const roles = ['anonymous', 'authenticated'];
    render(
      <HiddenComponent
        userRoles={roles}
        allowedRoles={['anonymous', 'authenticated']}
        allBut={true}
        isAuthenticating={false}
      >
        <RENDER_ON_AUTH />
      </HiddenComponent>
    );
    const hopefullyNotDiv = screen.queryByText(SUCCESS_MESSAGE);
    expect(hopefullyNotDiv).not.toBeInTheDocument();
  });
});

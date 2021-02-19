import React from 'react';
import { AuthorizationContext, DevSettings, DefaultRoles, User, ProvideAuth } from '../auth';
import { render, screen } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import PrivateComponent from '../components/private_components/PrivateComponent';

const DEFAULT_TEST_USER: User = {
  identityProvider: 'Bookface',
  userId: '42',
  userDetails: 'Unremarkable',
  userRoles: [],
};
const SUCCESS_MESSAGE = "Success; you're authorized!";
const RENDER_ON_AUTH = () => <div>{SUCCESS_MESSAGE}</div>;
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

describe('PrivateComponent correctly renders based on authorization', () => {
  test('PrivateComponent renders component when user holds a role other than the roles listed in allowedRoles when allBut == true', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <PrivateComponent allowedRoles={[DefaultRoles.Anonymous]} allBut={true}>
          <RENDER_ON_AUTH />
        </PrivateComponent>
      </ProvideAuth>
    );
    const hopefullyDiv = screen.getByText(SUCCESS_MESSAGE);
    expect(hopefullyDiv).toBeTruthy();
  });
  test('PrivateComponent renders component when user holds a role other than the roles listed in allowedRoles when allBut == true, even when having a role listed in allowedRoles', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Anonymous, DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <PrivateComponent allowedRoles={[DefaultRoles.Anonymous]} allBut={true}>
          <RENDER_ON_AUTH />
        </PrivateComponent>
      </ProvideAuth>
    );
    const hopefullyDiv = screen.getByText(SUCCESS_MESSAGE);
    expect(hopefullyDiv).toBeTruthy();
  });
  test('PrivateComponent renders component when user holds a role included in the roles listed in allowedRoles when allBut == false', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Anonymous, DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <PrivateComponent allowedRoles={[DefaultRoles.Authenticated]}>
          <RENDER_ON_AUTH />
        </PrivateComponent>
      </ProvideAuth>
    );
    const hopefullyDiv = screen.getByText(SUCCESS_MESSAGE);
    expect(hopefullyDiv).toBeTruthy();
  });
  test('PrivateComponent does not render its component when user not holding any roles in allowedRoles when allBut == false', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Anonymous, DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <PrivateComponent allowedRoles={[DefaultRoles.GlobalAdmin]}>
          <RENDER_ON_AUTH />
        </PrivateComponent>
      </ProvideAuth>
    );
    const hopefullyNotDiv = () => screen.getByText(SUCCESS_MESSAGE);
    expect(hopefullyNotDiv).toThrow(/Unable to find an element with the text:/);
  });
  test('PrivateComponent does not render its component when user holds only roles in allowedRoles when allBut == true', () => {
    const testContext = cloneDeep(CUSTOM_CONTEXT);
    testContext.devSettings.userOverride.userRoles = [DefaultRoles.Anonymous, DefaultRoles.Authenticated];
    render(
      <ProvideAuth customContext={testContext}>
        <PrivateComponent allowedRoles={[DefaultRoles.Anonymous, DefaultRoles.Authenticated]} allBut={true}>
          <RENDER_ON_AUTH />
        </PrivateComponent>
      </ProvideAuth>
    );
    const hopefullyNotDiv = () => screen.getByText(SUCCESS_MESSAGE);
    expect(hopefullyNotDiv).toThrow(/Unable to find an element with the text:/);
  });
});
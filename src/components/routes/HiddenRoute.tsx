import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import HiddenComponent, { HiddenComponentProps } from '../private_components/HiddenComponent';

/**
 * Renders its children if the user is in one of the allowed roles,
 * else renders the unauthorizedRedirect ReactNode.
 */
const HiddenRoute: React.VFC<HiddenComponentProps & RouteProps> = ({
  userRoles,
  allowedRoles,
  allBut,
  isAuthenticating,
  authenticatingComponent,
  children,
  ...rest
}: HiddenComponentProps & RouteProps) => {
  return (
    <Route
      {...rest}
      render={() => (
        <HiddenComponent
          userRoles={userRoles}
          allowedRoles={allowedRoles}
          allBut={allBut}
          isAuthenticating={isAuthenticating}
          authenticatingComponent={authenticatingComponent}
        >
          {children}
        </HiddenComponent>
      )}
    />
  );
};

export default HiddenRoute;

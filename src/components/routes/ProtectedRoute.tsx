import React from 'react';
import { Roles } from '../../auth/auth';
import { Route, RouteProps } from 'react-router-dom';
import ProtectedComponent from '../private_components/ProtectedComponent';

export interface ProtectedRouteProps {
  userRoles: Roles;
  allowedRoles: Roles;
  allBut?: boolean;
  isAuthenticating: boolean;
  authenticatingComponent?: JSX.Element;
  redirect: JSX.Element;
  children: React.ReactNode;
}

/**
 * Renders its children if the user is in one of the allowed roles,
 * else renders the redirect element.
 */
const ProtectedRoute: React.VFC<ProtectedRouteProps & RouteProps> = ({
  userRoles,
  allowedRoles,
  allBut,
  isAuthenticating,
  authenticatingComponent,
  redirect,
  children,
  ...rest
}: ProtectedRouteProps & RouteProps) => {
  return (
    <Route
      {...rest}
      render={() => (
        <ProtectedComponent
          userRoles={userRoles}
          allowedRoles={allowedRoles}
          allBut={allBut}
          isAuthenticating={isAuthenticating}
          authenticatingComponent={authenticatingComponent}
          unauthorizedComponent={redirect}
        >
          {children}
        </ProtectedComponent>
      )}
    />
  );
};

export default ProtectedRoute;

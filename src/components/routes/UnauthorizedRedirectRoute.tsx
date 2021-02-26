import React from 'react';
import { Redirect, RouteProps } from 'react-router-dom';
import { Roles } from '../../auth/auth';
import ProtectedRoute from './ProtectedRoute';

export interface UnauthorizedRedirectRouteProps {
  userRoles: Roles;
  allowedRoles: Roles;
  allBut?: boolean;
  isAuthenticating: boolean;
  authenticatingComponent?: JSX.Element;
  children: React.ReactNode;
}

const UnauthorizedRedirectRoute: React.VFC<UnauthorizedRedirectRouteProps & RouteProps> = ({
  userRoles,
  allowedRoles,
  allBut,
  isAuthenticating,
  authenticatingComponent,
  children,
  ...rest
}: UnauthorizedRedirectRouteProps & RouteProps) => {
  return (
    <ProtectedRoute
      userRoles={userRoles}
      allowedRoles={allowedRoles}
      allBut={allBut}
      isAuthenticating={isAuthenticating}
      authenticatingComponent={authenticatingComponent}
      redirect={<Redirect to="/unauthorized" />}
      {...rest}
    >
      {children}
    </ProtectedRoute>
  );
};

export default UnauthorizedRedirectRoute;

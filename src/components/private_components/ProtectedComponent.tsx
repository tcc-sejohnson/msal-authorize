import React from 'react';
import { Roles, authorize } from '../../auth/auth';
export interface ProtectedComponentProps {
  userRoles: Roles;
  allowedRoles: Roles;
  allBut?: boolean;
  isAuthenticating: boolean;
  unauthorizedComponent: JSX.Element;
  authenticatingComponent?: JSX.Element;
  children: React.ReactNode;
}

/**
 * Renders its children if the user is in one of the allowed roles,
 * else renders an unauthorized component. Useful for contextually rendering objects for different
 * classes of user.
 */
const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  userRoles,
  allowedRoles,
  allBut,
  isAuthenticating,
  unauthorizedComponent,
  authenticatingComponent,
  children,
}) => {
  if (isAuthenticating) {
    return authenticatingComponent ?? <div>Authenticating, please wait...</div>;
  }
  const isAuthorized = authorize(allowedRoles, userRoles, allBut);
  return isAuthorized ? <>{children}</> : unauthorizedComponent;
};

export default ProtectedComponent;

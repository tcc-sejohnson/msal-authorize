import React from 'react';
import { Roles } from '../../auth/auth';
import ProtectedComponent from './ProtectedComponent';

export interface HiddenComponentProps {
  userRoles: Roles;
  allowedRoles: Roles;
  allBut?: boolean;
  isAuthenticating: boolean;
  authenticatingComponent?: JSX.Element;
  children: React.ReactNode;
}

/**
 * Renders its children if the user is in one of the allowed roles,
 * else does not render. Useful for contextually rendering objects for different
 * classes of user.
 */
const HiddenComponent = ({
  userRoles,
  allowedRoles,
  allBut,
  isAuthenticating,
  authenticatingComponent,
  children,
}: HiddenComponentProps): JSX.Element => {
  return (
    <ProtectedComponent
      userRoles={userRoles}
      allowedRoles={allowedRoles}
      allBut={allBut}
      isAuthenticating={isAuthenticating}
      authenticatingComponent={authenticatingComponent}
      unauthorizedComponent={<></>}
    >
      {children}
    </ProtectedComponent>
  );
};

export default HiddenComponent;

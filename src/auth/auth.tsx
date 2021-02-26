export type Roles = string[];

export const authorize = (allowedRoles: Roles, userRoles: Roles, allBut = false): boolean => {
  let authorized = false;
  if (allBut) {
    // Make sure the user has at least one role that is not included in the list of disallowed roles
    authorized = userRoles.some((role) => !allowedRoles.includes(role));
  } else {
    // Make sure the user has at least one role that is included in the list of allowed roles
    authorized = userRoles.some((role) => allowedRoles.includes(role));
  }
  return authorized;
};

import { authorize, Roles } from '../auth/auth';
import '@testing-library/jest-dom/extend-expect';

describe('authorize correctly authorizes users', () => {
  test('User is authorized when holding a role other than a role listed in allowedRoles when allBut == true', () => {
    const userRoles = ['authenticated'];
    const result = authorize(['anonymous'], userRoles, true);
    expect(result).toStrictEqual(true);
  });
  test('User is authorized when holding a role other than a role listed when allBut == true, even when holding a role listed in allowedRoles', () => {
    const userRoles = ['authenticated', 'anonymous'];
    const result = authorize(['anonymous'], userRoles, true);
    expect(result).toStrictEqual(true);
  });
  test("User is authorized when holding a role included in the allowedRoles when allBut == false'", () => {
    const userRoles = ['authenticated'];
    const result = authorize(['authenticated', 'global_admin'], userRoles);
    expect(result).toStrictEqual(true);
  });
  test('User is denied when not holding any roles in allowedRoles when allBut == false', () => {
    const userRoles = ['authenticated', 'anonymous'];
    const result = authorize(['global_admin', 'global_viewer'], userRoles);
    expect(result).toStrictEqual(false);
  });
  test('User is denied when holding only roles in allowedRoles when allBut == true', () => {
    const userRoles = ['authenticated', 'anonymous'];
    const result = authorize(['authenticated', 'anonymous'], userRoles, true);
    expect(result).toStrictEqual(false);
  });
  test('User is denied when holding any roles when allowedRoles is empty and allBut == false', () => {
    const userRoles = ['authenticated', 'anonymous'];
    const result = authorize([], userRoles, false);
    expect(result).toStrictEqual(false);
  });
  test('User is allowed when holding any roles when allowedRoles is empty and allBut == true', () => {
    const userRoles = ['authenticated', 'anonymous'];
    const result = authorize([], userRoles, true);
    expect(result).toStrictEqual(true);
  });
  test('User is denied when holding no roles when allowedRoles is empty and allBut == true', () => {
    const userRoles: Roles = [];
    const result = authorize([], userRoles, true);
    expect(result).toStrictEqual(false);
  });
  test('User is denied when holding no roles when allowedRoles is empty and allBut == false', () => {
    const userRoles: Roles = [];
    const result = authorize([], userRoles, false);
    expect(result).toStrictEqual(false);
  });
});

// const ContextRenderer = (): JSX.Element => {
//   const auth = useAuth();
//   return <div>{JSON.stringify(auth)}</div>;
// };

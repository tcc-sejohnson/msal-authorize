import { authorize } from './auth/auth';
import HiddenRoute from './components/routes/HiddenRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import UnauthorizedRedirectRoute from './components/routes/UnauthorizedRedirectRoute';
import HiddenComponent from './components/private_components/HiddenComponent';
import ProtectedComponent from './components/private_components/ProtectedComponent';

export type { Roles } from './auth/auth';
export type { HiddenComponentProps } from './components/private_components/HiddenComponent';
export type { ProtectedComponentProps as UnauthorizedComponentProps } from './components/private_components/ProtectedComponent';
export type { ProtectedRouteProps } from './components/routes/ProtectedRoute';
export type { UnauthorizedRedirectRouteProps } from './components/routes/UnauthorizedRedirectRoute';

export { authorize, HiddenComponent, ProtectedComponent, HiddenRoute, ProtectedRoute, UnauthorizedRedirectRoute };

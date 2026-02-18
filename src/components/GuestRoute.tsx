import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired, isAdmin } from '../lib/jwt';

/**
 * Wraps routes that should only be accessible to guests (unauthenticated users).
 * If the user is already logged in (valid JWT or admin session),
 * they are redirected to /dashboard.
 */
export default function GuestRoute() {
    const hasToken = !isTokenExpired();
    const adminAccess = isAdmin();

    if (hasToken || adminAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

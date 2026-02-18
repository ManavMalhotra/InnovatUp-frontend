import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired, isAdmin as checkIsAdmin } from '../lib/jwt';

/**
 * Protects routes that require authentication.
 * Allows access if:
 *   - A valid (non-expired) JWT exists in localStorage (regular users), OR
 *   - The user has an admin role (checked via JWT claim, with sessionStorage fallback)
 * Otherwise redirects to /login.
 */
export default function ProtectedRoute() {
    const hasToken = !isTokenExpired();
    const adminAccess = checkIsAdmin();

    if (!hasToken && !adminAccess) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}


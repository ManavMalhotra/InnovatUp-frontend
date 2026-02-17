import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired } from '../lib/jwt';

/**
 * Protects routes that require authentication.
 * Allows access if:
 *   - A valid (non-expired) JWT exists in localStorage (regular users), OR
 *   - An admin session exists in sessionStorage
 * Otherwise redirects to /login.
 */
export default function ProtectedRoute() {
    const hasToken = !isTokenExpired();
    const isAdmin = sessionStorage.getItem('is_admin') === 'true';

    if (!hasToken && !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

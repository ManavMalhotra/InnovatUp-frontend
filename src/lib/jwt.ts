import { type User } from '../types/auth';

// Re-export so existing consumers (e.g. DashboardPage) don't break
export type { User };

/**
 * Decode JWT payload without verification (client-side only).
 * The JWT is three base64url segments separated by dots — we only need the middle one (payload).
 */
export function decodeJwt<T = any>(token: string): T | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        // base64url → base64, then decode
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Read the stored JWT and decode its payload into a User object.
 * Returns null if no token exists or decode fails.
 */
export function getUser(): User | null {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    return decodeJwt<User>(token);
}

/**
 * Check if the stored JWT is expired.
 */
export function isTokenExpired(): boolean {
    const token = localStorage.getItem("auth_token");
    if (!token) return true;
    const payload = decodeJwt<{ exp?: number }>(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
}

/**
 * Clear auth data from both localStorage and sessionStorage.
 */
export function clearAuth(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
    sessionStorage.removeItem("is_admin");
    sessionStorage.removeItem("admin_email");
    sessionStorage.removeItem("admin_users");
}

/**
 * Read the user's role from the stored JWT.
 * Returns "admin" | "user" | null.
 */
export function getUserRole(): "admin" | "user" | null {
    const user = getUser();
    return user?.role ?? null;
}

/**
 * Check whether the current session has admin privileges.
 * Prefers the JWT `role` claim; falls back to the sessionStorage flag
 * for backward compatibility with backends that don't issue admin JWTs.
 */
export function isAdmin(): boolean {
    const role = getUserRole();
    if (role === "admin") return true;

    // Fallback: legacy sessionStorage flag (less secure — see architecture review)
    return sessionStorage.getItem("is_admin") === "true";
}


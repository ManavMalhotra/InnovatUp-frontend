export interface User {
    sub: string;
    email: string;
    name: string;
    mobile: string;
    teamName?: string;
    team_count?: number;
    team_members?: Array<{
        name: string;
        email: string;
        mobile: string;
    }>;
    institute?: string;
    idea_desc?: string;
    role?: "admin" | "user";
}

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
 * Clear auth data from localStorage.
 */
export function clearAuth(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
}

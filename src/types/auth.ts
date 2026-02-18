export interface TeamMember {
    name: string;
    email: string;
    mobile: string;
}

export interface User {
    sub: string;
    email: string;
    name: string;
    mobile: string;
    teamName?: string;
    team_count?: number;
    team_members?: TeamMember[];
    institute?: string;
    idea_desc?: string;
    role?: "admin" | "user";
}

/**
 * Shape of a participant record as returned by the admin endpoint.
 * Used in the admin dashboard table and Excel export.
 */
export interface AdminUser {
    _id?: string;
    username?: string;
    name?: string;
    email: string;
    mobile?: string;
    institute?: string;
    teamName?: string;
    team_count?: number;
    team_members?: TeamMember[];
    topic?: string;
    idea_desc?: string;
}

export interface AuthResponse {
    result: string;
    token: string;
    token_type: string;
    expires_in: number;
}


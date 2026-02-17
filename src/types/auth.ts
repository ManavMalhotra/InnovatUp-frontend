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

export interface AuthResponse {
    result: string;
    token: string;
    token_type: string;
    expires_in: number;
}

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
  role?: "admin" | "user"; // Derived or added from backend
}

export interface AuthResponse {
  result: string;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
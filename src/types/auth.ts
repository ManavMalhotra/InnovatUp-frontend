export interface TeamMember {
  name: string;
  email: string;
  mobile: string;
}

export interface UserData {
  sub: string;
  email: string;
  name: string;
  mobile: string;
  teamName: string;
  team_count: number;
  team_members: TeamMember[];
  institute: string;
  idea_desc: string;
  topic?: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  result: string;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface UserDashboardResponse {
  user: UserData;
}

export interface AdminDashboardResponse {
  result: string;
  users: UserData[];
}

export function isAdminResponse(
  data: UserDashboardResponse | AdminDashboardResponse
): data is AdminDashboardResponse {
  return "users" in data && 
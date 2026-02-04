import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TeamMember {
  name: string;
  email: string;
}

export interface UserData {
  teamName: string;
  members: TeamMember[];
  topic: string;
  brief: string;
  college: string;
}

interface UserContextType {
  user: UserData | null;
  registerTeam: (data: UserData) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const registerTeam = (data: UserData) => {
    setUser(data);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ user, registerTeam, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

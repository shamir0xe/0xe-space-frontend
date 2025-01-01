import createGuestUser from "@/actions/user/createGuestUser";
import User from "@/models/user";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(createGuestUser());
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

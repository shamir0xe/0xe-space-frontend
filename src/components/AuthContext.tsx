import createGuestUser from "@/actions/user/createGuestUser";
import User from "@/models/user";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

export interface AuthContextType {
  user: User;
  getUser: () => User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const randomUser = createGuestUser();
  const [stateUser, setStateUser] = useState<User>(randomUser);
  const user = useRef<User>(randomUser);
  const setUser = (newUser: User): void => {
    user.current = newUser;
    setStateUser(newUser);
  };
  const getUser = (): User => {
    return user.current;
  };
  return (
    <AuthContext.Provider
      value={{ user: stateUser, setUser: setUser, getUser: getUser }}
    >
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

import createGuestUser from "@/actions/user/createGuestUser";
import BaseAPI from "@/facades/apiCall/base";
import User from "@/models/user";
import postLoginProcess from "@/orchestrators/postLoginProcess";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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

  // Restore the session on every page (terminal and blog), and fall back to a
  // guest when the server rejects the stored token.
  useEffect(() => {
    BaseAPI.onSessionExpired = () => setUser(createGuestUser());
    postLoginProcess(setUser).catch(() => {});
    return () => {
      BaseAPI.onSessionExpired = null;
    };
  }, []);

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

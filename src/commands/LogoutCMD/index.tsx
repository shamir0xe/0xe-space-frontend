import createGuestUser from "@/actions/user/createGuestUser";
import { AuthAPI } from "@/facades/apiCall";
import CookiesFacade from "@/facades/cookiesFacade";
import User from "@/models/user";
import { useEffect, useState } from "react";

type LogoutProps = {
  setUser: (user: User) => void;
};

/** Revokes the token on the server, then forgets it locally. */
const Logout = ({ setUser }: LogoutProps): JSX.Element => {
  const [status, setStatus] = useState<string>("Logging out...");

  useEffect(() => {
    if (!CookiesFacade.readToken()) {
      setStatus("You are not logged in");
      return;
    }
    AuthAPI.logout()
      .catch(() => {
        // The token is forgotten locally even if the server is unreachable.
      })
      .finally(() => {
        CookiesFacade.removeToken();
        setUser(createGuestUser());
        setStatus("Successfully logged out");
      });
    // Run exactly once: a re-run would see no token and report "not logged in".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="text-left">{status}</div>;
};

const LogoutCMD = (setUser: (user: User) => void): JSX.Element => {
  return <Logout setUser={setUser} />;
};

export default LogoutCMD;

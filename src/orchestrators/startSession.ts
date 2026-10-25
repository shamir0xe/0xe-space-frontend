import { Session } from "@/facades/apiCall/auth";
import CookiesFacade from "@/facades/cookiesFacade";
import User from "@/models/user";

/** Stores the token of a fresh login and publishes the logged-in user. */
const startSession = (setUser: (user: User) => void, session: Session): void => {
  CookiesFacade.saveToken(session.token);
  setUser({ ...session.user, token: session.token });
};

export default startSession;

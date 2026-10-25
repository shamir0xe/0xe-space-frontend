import { UserAPI } from "@/facades/apiCall";
import CookiesFacade from "@/facades/cookiesFacade";
import User from "@/models/user";

/**
 * Restores the session from the token cookie, if any, by fetching the user.
 * @param setUser - Function to update the user state.
 * @param token - Optional token; read from the cookie when omitted.
 */
const postLoginProcess = async (
  setUser: (user: User) => void,
  token: string | null = null,
): Promise<void> => {
  token = token ?? CookiesFacade.readToken();
  if (!token) {
    return;
  }
  try {
    const fetchedUser = await UserAPI.me();
    setUser({ ...fetchedUser, token });
  } catch (error) {
    return Promise.reject(
      `Error occurred while trying to login the user: ${error}`,
    );
  }
};

export default postLoginProcess;

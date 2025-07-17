import { UserAPI } from "@/facades/apiCall";
import CookiesFacade from "@/facades/cookiesFacade";
import User from "@/models/user";

/**
 * Attempts to retrieve the user from cookies and login using the token.
 * @param setUser - Function to update the user state.
 * @param token - Optional token string to use for login. If not provided, will read from cookies.
 * @returns A promise that resolves when login is complete.
 */
const postLoginProcess = async (
  setUser: (user: User) => void,
  token: string | null = null,
): Promise<void> => {
  // Try to retrieve the token if not provided
  if (!token) {
    token = CookiesFacade.readToken();
  }
  if (!token) {
    // No token found, nothing to do
    return;
  }
  try {
    // Fetch user info from API
    const fetchedUser = await UserAPI.userInfo();
    console.log(`We already have a user: ${fetchedUser.username}`);
    // Assign token if needed
    fetchedUser.token = token;
    setUser(fetchedUser);
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(`Error occurred while trying to login the user: ${error}`)
  }
};

export default postLoginProcess;

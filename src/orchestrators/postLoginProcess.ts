import APICall from "@/facades/apiCall";
import CookiesFacade from "@/facades/cookiesFacade";
import User from "@/models/user";

const postLoginProcess = async (
  setUser: (user: User) => void,
  token: string | null = null,
) => {
  /**
   * Read cookies for retrieving the user
   * if the cookie have been found, try to
   * login using that token
   * **/
  if (token == null) {
    token = CookiesFacade.readToken();
  }
  if (token == null) {
    return;
  }
  // We have a token
  console.log(`Stored token: ${token}`);

  APICall.userInfo()
    .then((fetchedUser) => {
      console.log(`We already have a user: ${fetchedUser.username}`);
      fetchedUser.token = token;
      setUser(fetchedUser);
    })
    .catch((error) => {
      console.log(`error occurred while try to login the user: ${error}`);
    });
};

export default postLoginProcess;

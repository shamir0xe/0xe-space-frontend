import createGuestUser from "@/actions/user/createGuestUser";
import CookiesFacade from "@/facades/cookiesFacade";
import User from "@/models/user";

const LogoutCMD = (
  setUser: (user: User) => void,
  ...args: string[]
): JSX.Element => {
  console.log(args);
  try {
    CookiesFacade.removeToken();
  } catch (error) { }
  console.log("Inside the Logout");
  setUser(createGuestUser());
  return <div className="text-left">Successfully logged out</div>;
};

export default LogoutCMD;

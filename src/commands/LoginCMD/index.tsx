import User from "@/models/user";
import { LoginChat } from "./LoginChat";

const LoginCMD = (
  setUser: (user: User) => void,
  secretRef: React.MutableRefObject<boolean>,
  ...args: string[]
): [JSX.Element, LoginChat] => {
  console.log(args);
  const loginChat = new LoginChat(setUser, secretRef);
  return [loginChat.renderHistory(), loginChat];
};

export default LoginCMD;

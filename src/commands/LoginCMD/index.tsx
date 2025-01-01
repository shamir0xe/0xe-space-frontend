import User from "@/models/user";
import { LoginChat } from "./loginChat";

const LoginCMD = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  ...args: string[]
): [JSX.Element, LoginChat] => {
  console.log(args);
  const loginChat = new LoginChat(setUser);
  return [loginChat.renderHistory(), loginChat];
};

export default LoginCMD;

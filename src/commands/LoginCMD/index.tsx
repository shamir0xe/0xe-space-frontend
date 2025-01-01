import { useAuth } from "@/components/AuthContext";
import { LoginChat } from "./loginChat";

const LoginCMD = (...args: string[]): [JSX.Element, LoginChat] => {
  console.log(args);
  const { setUser } = useAuth();
  const loginChat = new LoginChat(setUser);
  return [loginChat.renderHistory(), loginChat];
};

export default LoginCMD;

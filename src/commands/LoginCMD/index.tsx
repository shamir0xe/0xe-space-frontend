import { LoginChat } from "./loginChat";

const LoginCMD = (...args: string[]): [JSX.Element, LoginChat] => {
  console.log(args);
  const loginChat = new LoginChat();
  return [loginChat.renderHistory(), loginChat];
};

export default LoginCMD;

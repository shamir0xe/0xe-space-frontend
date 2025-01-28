import User from "@/models/user";
import { RegisterChat } from "./registerChat";

const RegisterCMD = (
  setUser: (user: User) => void,
  ...args: string[]
): [JSX.Element, RegisterChat] => {
  console.log(args);
  const registerChat = new RegisterChat(setUser);
  return [registerChat.renderHistory(), registerChat];
};

export default RegisterCMD;

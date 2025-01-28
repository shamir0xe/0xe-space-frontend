import User from "@/models/user";
import { ResendCodeChat } from "./resendCodeChat";

const RegisterCMD = (
  setUser: (user: User) => void,
  ...args: string[]
): [JSX.Element, ResendCodeChat] => {
  console.log(args);
  const resendCodeChat = new ResendCodeChat(setUser);
  return [resendCodeChat.renderHistory(), resendCodeChat];
};

export default RegisterCMD;

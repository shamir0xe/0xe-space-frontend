import User from "@/models/user";
import { ConfirmCodeChat } from "./confirmCodeChat";

const ConfirmCMD = (
  setUser: (user: User) => void,
  ...args: string[]
): [JSX.Element, ConfirmCodeChat] => {
  console.log(args);
  const confirmCodeChat = new ConfirmCodeChat(setUser);
  return [confirmCodeChat.renderHistory(), confirmCodeChat];
};

export default ConfirmCMD;

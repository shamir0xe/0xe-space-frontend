import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import HelpCMD from "@/commands/HelpCMD";
import CommandNotFound from "@/commands/CommandNotFound";
import CommandTypes from "@/commands/types";
import LoginCMD from "@/commands/LoginCMD";
import LogoutCMD from "@/commands/LogoutCMD";
import WhoAmICMD from "@/commands/WhoAmICMD";
import User from "@/models/user";
import SetKeyCMD from "@/commands/SetKeyCMD";
import { Chat } from "@/helpers/chat/Chat";

type UserPropertyType = {
  getUser: () => User;
  setUser: (user: User) => void;
};
type CursorPropertyType = {
  getFocus: () => boolean;
  setFocus: (focus: boolean) => void;
};
const CommandMediator = (
  command: string,
  userProperty: UserPropertyType,
  cursorProperty: CursorPropertyType,
): [string, JSX.Element, Chat | null] => {
  const [cmd, args] = commandParser(command);
  const { getUser, setUser } = userProperty;
  const { getFocus, setFocus } = cursorProperty;
  if (cmd === "") return [cmd, ResponseTypes.BLANK(), null];
  let output = CommandNotFound(...args);
  let interactiveChat: Chat | null = null;
  switch (cmd as CommandTypes) {
    case CommandTypes.SET_KEY:
      [output, interactiveChat] = SetKeyCMD(setFocus, ...args);
      break;
    case CommandTypes.LOGIN:
      [output, interactiveChat] = LoginCMD(setUser, ...args);
      break;
    case CommandTypes.LOGOUT:
      output = LogoutCMD(setUser, ...args);
      break;
    case CommandTypes.WHOAMI:
      output = WhoAmICMD(getUser(), ...args);
      break;
    case CommandTypes.HELP:
    case CommandTypes.LS:
      output = HelpCMD(...args);
      break;
    case CommandTypes.CLEAR:
      output = ResponseTypes.CLEAR();
      break;
    default:
  }
  return [cmd, output, interactiveChat];
};

export default CommandMediator;

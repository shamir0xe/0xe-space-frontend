import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import HelpCMD from "@/commands/HelpCMD";
import CommandNotFound from "@/commands/CommandNotFound";
import CommandTypes from "@/commands/types";
import LoginCMD from "@/commands/LoginCMD";
import LogoutCMD from "@/commands/LogoutCMD";
import { LoginChat } from "@/commands/LoginCMD/loginChat";
import WhoAmICMD from "@/commands/WhoAmICMD";
import User from "@/models/user";

type userPropertyType = {
  getUser: () => User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};
const CommandMediator = (
  command: string,
  userProperty: userPropertyType,
): [string, JSX.Element, LoginChat | null] => {
  const [cmd, args] = commandParser(command);
  const { getUser, setUser } = userProperty;
  if (cmd === "") return [cmd, ResponseTypes.BLANK(), null];
  let output = CommandNotFound(...args);
  let interactiveChat = null;
  switch (cmd as CommandTypes) {
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

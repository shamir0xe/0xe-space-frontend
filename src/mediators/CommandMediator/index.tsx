import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import HelpCMD from "@/commands/HelpCMD";
import CommandNotFound from "@/commands/CommandNotFound";
import CommandTypes from "@/commands/types";
import LoginCMD from "@/commands/LoginCMD";
import LogoutCMD from "@/commands/LogoutCMD";
import { LoginChat } from "@/commands/LoginCMD/loginChat";
import { AuthContextType } from "@/components/AuthContext";

const CommandMediator = (
  command: string,
  useAuth: AuthContextType,
): [string, JSX.Element, LoginChat | null] => {
  const [cmd, args] = commandParser(command);
  const { user, setUser } = useAuth;
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

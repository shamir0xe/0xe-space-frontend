import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import HelpCMD from "@/commands/HelpCMD";
import CommandNotFound from "@/commands/CommandNotFound";
import CommandTypes from "@/commands/types";
import LoginCMD from "@/commands/LoginCMD";
import { LoginChat } from "@/commands/LoginCMD/loginChat";

const CommandMediator = (
  command: string,
): [string, JSX.Element, LoginChat | null] => {
  const [cmd, args] = commandParser(command);
  if (cmd === "") return [cmd, ResponseTypes.BLANK(), null];
  let output = CommandNotFound(...args);
  let interactiveChat = null;
  switch (cmd as CommandTypes) {
    case CommandTypes.LOGIN:
      [output, interactiveChat] = LoginCMD(...args);
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

import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import HelpCMD from "@/commands/HelpCMD";
import CommandNotFound from "@/commands/CommandNotFound";
import CommandTypes from "@/commands/types";

const CommandMediator = (command: string): [string, JSX.Element] => {
  const [cmd, args] = commandParser(command);
  if (cmd === "") return [cmd, ResponseTypes.BLANK()];
  let output = CommandNotFound(...args);
  switch (cmd as CommandTypes) {
    case CommandTypes.HELP:
    case CommandTypes.LS:
      output = HelpCMD(...args);
      break;
    case CommandTypes.CLEAR:
      output = ResponseTypes.CLEAR();
      break;
    default:
  }
  return [cmd, output];
};

export default CommandMediator;

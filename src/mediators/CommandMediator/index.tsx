import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import helpCMD from "@/commands/HelpCMD";
import CommandTypes from "@/commands/types";

const CommandMediator = (command: string): [string, JSX.Element] => {
  const [cmd, args] = commandParser(command);
  if (cmd === "") return [cmd, ResponseTypes.BLANK()];
  let output = ResponseTypes.COMMAND_NOT_FOUND();
  switch (cmd as CommandTypes) {
    case CommandTypes.HELP:
    case CommandTypes.LS:
      output = helpCMD(...args);
      break;
    case CommandTypes.CLEAR:
      output = ResponseTypes.CLEAR();
      break;
    default:
  }
  return [cmd, output];
};

export default CommandMediator;

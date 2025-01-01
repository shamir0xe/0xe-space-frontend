import classes from "./terminal.module.css";
import React from "react";
import User from "@/models/user";
import { appendConditionalClass } from "@/helpers/utils";

type CommandResponseType = {
  command: string;
  response: JSX.Element;
};

const CommandResponse = (props: CommandResponseType) => {
  return (
    <div>
      <div className={classes.Terminal}>
        <div className={classes.Leading}>&gt;&nbsp;</div>
        <div className={classes.Wrapper}>
          <div className={classes.CurrentLine}>{props.command}</div>
        </div>
      </div>
      <div className={classes.Response}>{props.response}</div>
    </div>
  );
};

type TerminalResponseType = {
  user: User;
  commands: string[];
  responses: JSX.Element[];
  containerRef: React.RefObject<HTMLElement>;
  terminal: React.RefObject<HTMLDivElement>;
  cursor: React.RefObject<HTMLDivElement>;
  showLeading: boolean;
  cursorStatus: boolean;
};

const Terminal = (props: TerminalResponseType) => {
  const renderHistory = () => {
    return props.commands.map((command, index) => (
      <CommandResponse
        key={`cmdres#${index}`}
        command={command}
        response={props.responses[index]}
      />
    ));
  };
  return (
    <section className={classes.Section} ref={props.containerRef}>
      {renderHistory()}
      <div className={classes.Terminal}>
        <div
          className={
            props.showLeading ? "table-cell align-bottom w-1 pr-1" : "hidden"
          }
        >
          @{props.user.username}
          {""}
        </div>
        <div className={props.showLeading ? classes.Leading : "hidden"}>
          &gt;&nbsp;
        </div>
        <div className={classes.Wrapper}>
          <div className={classes.CurrentLine} ref={props.terminal} />
          <div
            className={appendConditionalClass(
              !props.cursorStatus,
              classes.StopAnimation,
              classes.Cursor,
            )}
            ref={props.cursor}
          />
        </div>
      </div>
    </section>
  );
};

export default Terminal;

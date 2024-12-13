import classes from "./terminal.module.css";
import { appendConditionalClass } from "@/helpers/utils";

const CommandResponse = (props) => {
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

const Terminal = (props) => {
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
        <div className={classes.Leading}>&gt;&nbsp;</div>
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

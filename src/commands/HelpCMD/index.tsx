import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import contents from "./contents";
import classes from "./helpCMD.module.css";
import Button from "@/components/Button";

const HelpCMD = (...args: string[]): JSX.Element => {
  console.log(args);
  const commandList = () => {
    return contents.commands.map((command, index) => {
      return (
        <li key={`command${index}}`}>
          <strong>
            <Button onMouseDown={() => TypeSetterMediator.enter(command.name)}>
              {command.name}
            </Button>
          </strong>
          : {command.description}
        </li>
      );
    });
  };
  return (
    <div className={classes.Container}>
      <h1 className="text-left">
        Welcome to <span className={classes.Italic}>0xe's Space</span>
      </h1>
      <p>{contents.txts.body}</p>
      <p>{contents.txts.commandTitle}</p>
      <ul>{commandList()}</ul>
    </div>
  );
};

export default HelpCMD;

import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import classes from "./CommandNotFound.module.css";
import Button from "@/components/Button";
const CommandNotFound = (...args: string[]): JSX.Element => {
  console.log(args);
  return (
    <div className={classes.Container}>
      <p>
        <strong>command not found</strong>
      </p>
      <p>
        type or tap{" "}
        <strong>
          <Button
            onMouseDown={() => {
              TypeSetterMediator.enter("help");
            }}
          >
            help
          </Button>
        </strong>{" "}
        for more info
      </p>
    </div>
  );
};

export default CommandNotFound;

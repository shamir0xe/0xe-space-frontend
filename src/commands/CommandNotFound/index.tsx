import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import classes from "./CommandNotFound.module.css";
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
          <a
            className={classes.Link}
            onMouseDown={(e) => {
              if (e) e.preventDefault();
              TypeSetterMediator.enter("help");
            }}
          >
            help
          </a>
        </strong>{" "}
        for more info
      </p>
    </div>
  );
};

export default CommandNotFound;

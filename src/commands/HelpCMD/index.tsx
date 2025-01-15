import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import contents from "./contents";
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
          {command.options ? (
            <div className="pb-5">
              <p className="indent-4 italic text-sm">Available Options:</p>
              <ul className="list-inside list-disc">
                {Object.entries(command.options).map(([key, value]) => (
                  <li className="indent-8" key={`cmd${index}-opt${key}`}>
                    <p className="inline">
                      <strong>{key}:</strong> {value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div />
          )}
        </li>
      );
    });
  };
  return (
    <div className="relative px-4">
      <h1 className="text-left font-extrabold font-xl">
        Welcome to <span className="italic">0xe's Space</span>
      </h1>
      <p className="indent-0 text-justify">{contents.txts.body}</p>
      <p className="pb-5">{contents.txts.commandTitle}</p>
      <ul className="text-left">{commandList()}</ul>
    </div>
  );
};

export default HelpCMD;

import "./App.css";
import { useEffect, useRef, useState } from "react";
import classes from "@/app.module.css";
import CommandTypes from "@/commands/types";
import Terminal from "@/components/pages/Terminal";
import Console from "@/helpers/terminals/viTerminal";
import CommandMediator from "@/mediators/CommandMediator";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import ResponseTypes from "@/mediators/CommandMediator/responses";

function App() {
  const terminalRef = useRef(null);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const [animation, setAnimation] = useState(true);
  const [commands, setCommands] = useState<string[]>([]);
  const [responses, setResponses] = useState<JSX.Element[]>([]);
  useEffect(() => {
    let animationTimeout = null;
    const delayAnimation = () => {
      setAnimation(false);
      clearTimeout(animationTimeout);
      animationTimeout = setTimeout(() => setAnimation(true), 200);
    };
    const [closure, virtualKeyPress] = Console({
      ref: terminalRef,
      cursorRef: cursorRef,
      onClick: delayAnimation,
      onLineEnd: (command: string) => {
        console.log(`command: ${command}`);
        const [cmd, response] = CommandMediator(command);
        console.log(`cmd: ${cmd}`);
        if (cmd === CommandTypes.CLEAR) {
          setCommands(() => []);
          setResponses(() => []);
        } else {
          setCommands((commands) => [...commands, command]);
          setResponses((responses) => [...responses, response]);
        }
      },
    });
    TypeSetterMediator.initialize(virtualKeyPress);
    // TODO, remove this
    setTimeout(() => TypeSetterMediator.enter("help"), 500);
    return () => {
      return closure();
    };
  }, []);

  useEffect(() => {
    containerRef.current.scroll(0, containerRef.current.scrollHeight);
  }, [responses]);

  return (
    <div className={classes.Canvas}>
      <Terminal
        containerRef={containerRef}
        terminal={terminalRef}
        cursor={cursorRef}
        cursorStatus={animation}
        commands={commands}
        responses={responses}
      />
    </div>
  );
}

export default App;

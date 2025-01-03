import classes from "@/app.module.css";
import CommandTypes from "@/commands/types";
import Terminal from "@/components/pages/Terminal";
import Console from "@/helpers/terminals/viTerminal";
import CommandMediator from "@/mediators/CommandMediator";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import { useEffect, useRef, useState } from "react";
import "./home.css";
import postLoginProcess from "@/orchestrators/postLoginProcess";
import { useAuth } from "@/components/AuthContext";
import { Chat } from "@/helpers/chat/Chat";
import { useCursor } from "@/components/CursorContext";

const Home = () => {
  const terminalRef = useRef(null);
  const cursorRef = useRef(null);
  const containerRef = useRef<HTMLElement>(null);
  const [animation, setAnimation] = useState<boolean>(true);
  const [commands, setCommands] = useState<string[]>([]);
  const [responses, setResponses] = useState<JSX.Element[]>([]);
  const [showLeading, setShowLeading] = useState<boolean>(true);
  const chat = useRef<Chat | null>(null);
  const { user, setUser, getUser } = useAuth();
  const { focus, getFocus, setFocus } = useCursor();

  useEffect(() => {
    let animationTimeout: ReturnType<typeof setTimeout> | null = null;
    const delayAnimation = () => {
      setAnimation(false);
      if (animationTimeout) clearTimeout(animationTimeout);
      animationTimeout = setTimeout(() => setAnimation(true), 200);
    };
    const [closure, virtualKeyPress] = Console({
      ref: terminalRef,
      cursorRef: cursorRef,
      onClick: delayAnimation,
      getFocus: getFocus,
      onLineEnd: (command: string) => {
        if (chat.current == null) {
          console.log(`command: ${command}`);
          const [cmd, response, interactiveChat] = CommandMediator(
            command,
            {
              getUser,
              setUser,
            },
            { getFocus, setFocus },
          );
          console.log(`cmd: ${cmd}`);
          if (interactiveChat && !interactiveChat.isEnded()) {
            console.log("Enter the chat mode");
            chat.current = interactiveChat;
            setShowLeading(false);
          }
          if (cmd === CommandTypes.CLEAR) {
            setCommands(() => []);
            setResponses(() => []);
          } else {
            setCommands((commands) => [...commands, command]);
            setResponses((responses) => [...responses, response]);
          }
        } else {
          // in the interactive chat
          console.log("Chat Mode");
          let curChat = chat.current;
          curChat
            .recieve(command)
            .then((res) => {
              console.log(res);
              if (curChat.isEnded()) {
                chat.current = null;
                setShowLeading(true);
              }
              setResponses((responses) => [
                ...responses.slice(0, responses.length - 1),
                res,
              ]);
            })
            .catch((e) => {
              console.log(`exception: ${e}`);
              chat.current = null;
              setShowLeading(true);
              // TODO: Add some states to show/hide the terminal
              // line, more specific for passwords or other inputs
            });
        }
      },
    });

    postLoginProcess(setUser);

    TypeSetterMediator.initialize(virtualKeyPress);
    // TODO:, remove this
    setTimeout(() => TypeSetterMediator.enter("about_me"), 500);
    return () => {
      return closure();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scroll(0, containerRef.current.scrollHeight);
    }
  }, [responses]);

  useEffect(() => {
    console.log(`Updated User: ${user.name}`);
  }, [user]);

  return (
    <div className={classes.Canvas}>
      <Terminal
        showLeading={showLeading}
        containerRef={containerRef}
        terminal={terminalRef}
        cursor={cursorRef}
        cursorStatus={animation && focus}
        commands={commands}
        responses={responses}
      />
    </div>
  );
};

export default Home;

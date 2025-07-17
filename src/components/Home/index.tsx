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
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Button from "../Button";

const Home = () => {
  const terminalRef = useRef(null);
  const cursorRef = useRef(null);
  const containerRef = useRef<HTMLElement>(null);
  const secretRef = useRef<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(true);
  const [commands, setCommands] = useState<string[]>([]);
  const [responses, setResponses] = useState<JSX.Element[]>([]);
  const [showLeading, setShowLeading] = useState<boolean>(true);
  const chat = useRef<Chat | null>(null);
  const { user, setUser, getUser } = useAuth();
  const { focus, getFocus, setFocus } = useCursor();
  const navigate = useNavigate();
  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    let animationTimeout: ReturnType<typeof setTimeout> | null = null;
    const delayAnimation = () => {
      setAnimation(false);
      if (animationTimeout) clearTimeout(animationTimeout);
      animationTimeout = setTimeout(() => setAnimation(true), 200);
    };
    const [closure, virtualKeyPress, chatHistoryPush, chatHistoryPop] = Console(
      {
        secretRef: secretRef,
        ref: terminalRef,
        cursorRef: cursorRef,
        onClick: () => {
          scrollToBottom();

          delayAnimation();
        },
        getFocus: getFocus,
        onLineEnd: (command: string) => {
          if (chat.current == null) {
            console.log(`command: ${command}`);
            const [cmd, response, interactiveChat] = CommandMediator(
              command,
              navigate,
              {
                getUser,
                setUser,
              },
              { getFocus, setFocus },
              secretRef,
            );
            console.log(`cmd: ${cmd}`);
            if (interactiveChat && !interactiveChat.isEnded()) {
              console.log("Enter the chat mode");
              chat.current = interactiveChat;
              setShowLeading(false);
              chatHistoryPush();
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
            const curChat = chat.current;
            curChat
              .recieve(command)
              .then((res) => {
                console.log(res);
                if (curChat.isEnded()) {
                  chat.current = null;
                  setShowLeading(true);
                  chatHistoryPop();
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
                chatHistoryPop();
                // TODO: Add some states to show/hide the terminal
                // line, more specific for passwords or other inputs
              });
          }
        },
      },
    );

    postLoginProcess(setUser);

    TypeSetterMediator.initialize(virtualKeyPress);
    // TODO:, remove this
    setTimeout(() => TypeSetterMediator.enter("about_me"), 500);
    return () => {
      return closure();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  useEffect(() => {
    console.log(`Updated User: ${user.name}`);
  }, [user]);

  const TerminalHeader = ({ navigate }: { navigate: (path: string) => void }): JSX.Element => {
    return (
      <Header
        className="flex items-center w-full justify-between text-white"
        bgColor="bg-emerald-400"
      >
        <div className="flex-initial min-h-12 table z-20">
          <p className="table-cell align-middle text-left">
            <strong>&lt;Terminal&gt;</strong>
          </p>
        </div>
        <div className="z-20 text-sm">
          Go to &nbsp;
          <Button
            onMouseDown={() => {
              navigate("/blog");
            }}
            className="px-1 py-1.5 mr-1 bg-teal-800"
          >
            Blog
          </Button>
        </div>
      </Header>
    );
  };

  return (
    <div className="relative bg-[--background-color] min-h-screen mx-auto max-w-4xl">
      <TerminalHeader navigate={navigate} />
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

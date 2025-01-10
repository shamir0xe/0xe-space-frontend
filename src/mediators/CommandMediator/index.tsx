import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import HelpCMD from "@/commands/HelpCMD";
import CommandNotFound from "@/commands/CommandNotFound";
import CommandTypes from "@/commands/types";
import LoginCMD from "@/commands/LoginCMD";
import LogoutCMD from "@/commands/LogoutCMD";
import WhoAmICMD from "@/commands/WhoAmICMD";
import User from "@/models/user";
import SetKeyCMD from "@/commands/SetKeyCMD";
import { Chat } from "@/helpers/chat/Chat";
import AboutMeCMD from "@/commands/AboutMeCMD";
import LeetcodeCMD from "@/commands/LeetcodeCMD";
import TopcoderCMD from "@/commands/TopcoderCMD";
import SocialsCMD from "@/commands/SocialsCMD";
import TwitterCMD from "@/commands/TwitterCMD";
import YoutubeCMD from "@/commands/YoutubeCMD";
import GithubCMD from "@/commands/GithubCMD";
import CodeforcesCMD from "@/commands/CodeforcesCMD";
import { NavigateFunction } from "react-router-dom";
import PostCMD from "@/commands/PostCMD";
import CvCMD from "@/commands/CvCMD";

type UserPropertyType = {
  getUser: () => User;
  setUser: (user: User) => void;
};
type CursorPropertyType = {
  getFocus: () => boolean;
  setFocus: (focus: boolean) => void;
};
const CommandMediator = (
  command: string,
  navigate: NavigateFunction,
  userProperty: UserPropertyType,
  cursorProperty: CursorPropertyType,
): [string, JSX.Element, Chat | null] => {
  const [cmd, args] = commandParser(command);
  const { getUser, setUser } = userProperty;
  const { setFocus } = cursorProperty;
  if (cmd === "") return [cmd, ResponseTypes.BLANK(), null];
  let output = CommandNotFound(...args);
  let interactiveChat: Chat | null = null;
  switch (cmd as CommandTypes) {
    case CommandTypes.CV:
      output = <CvCMD subCommand={args[0] ?? null} />;
      break;
    case CommandTypes.POST:
      [output, interactiveChat] = PostCMD(setFocus, ...args);
      break;
    case CommandTypes.BLOG:
      navigate("/blog");
      break;
    case CommandTypes.SOCIALS:
      output = <SocialsCMD />;
      break;
    case CommandTypes.LEETCODE:
      output = <LeetcodeCMD />;
      break;
    case CommandTypes.TOPCODER:
      output = <TopcoderCMD />;
      break;
    case CommandTypes.CODEFORCES:
      output = <CodeforcesCMD />;
      break;
    case CommandTypes.GITHUB:
      output = <GithubCMD />;
      break;
    case CommandTypes.YOUTUBE:
      output = <YoutubeCMD />;
      break;
    case CommandTypes.TWITTER:
      output = <TwitterCMD />;
      break;
    case CommandTypes.ABOUT_ME:
      output = <AboutMeCMD />;
      break;
    case CommandTypes.SET_KEY:
      [output, interactiveChat] = SetKeyCMD(setFocus, ...args);
      break;
    case CommandTypes.LOGIN:
      [output, interactiveChat] = LoginCMD(setUser, ...args);
      break;
    case CommandTypes.LOGOUT:
      output = LogoutCMD(setUser, ...args);
      break;
    case CommandTypes.WHOAMI:
      output = WhoAmICMD(getUser(), ...args);
      break;
    case CommandTypes.HELP:
    case CommandTypes.LS:
      output = HelpCMD(...args);
      break;
    case CommandTypes.CLEAR:
      output = ResponseTypes.CLEAR();
      break;
    default:
  }
  return [cmd, output, interactiveChat];
};

export default CommandMediator;

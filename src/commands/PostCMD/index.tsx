import { PostChat } from "./PostChat";

const PostCMD = (
  setFocus: (focus: boolean) => void,
  ...args: string[]
): [JSX.Element, PostChat] => {
  console.log(args);
  const command: string = args[0];
  const postChat = new PostChat(setFocus, command, ...args.slice(1));
  return [postChat.renderHistory(), postChat];
};

export default PostCMD;

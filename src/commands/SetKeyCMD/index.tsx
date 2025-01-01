import { SetKeyChat } from "./SetKeyChat";

const SetKeyCMD = (
  setFocus: (focus: boolean) => void,
  ...args: string[]
): [JSX.Element, SetKeyChat] => {
  console.log(args);
  let key: string = args[0];
  const setKeyChat = new SetKeyChat(setFocus, key);
  return [setKeyChat.renderHistory(), setKeyChat];
};

export default SetKeyCMD;

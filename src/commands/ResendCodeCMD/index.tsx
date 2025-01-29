import { ResendCodeChat } from "./resendCodeChat";

const ResendCodeCMD = (...args: string[]): [JSX.Element, ResendCodeChat] => {
  console.log(args);
  const resendCodeChat = new ResendCodeChat();
  return [resendCodeChat.renderHistory(), resendCodeChat];
};

export default ResendCodeCMD;

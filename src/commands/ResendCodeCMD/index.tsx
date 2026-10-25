import { ResendCodeChat } from "./resendCodeChat";

const ResendCodeCMD = (): [JSX.Element, ResendCodeChat] => {
  const resendCodeChat = new ResendCodeChat();
  return [resendCodeChat.renderHistory(), resendCodeChat];
};

export default ResendCodeCMD;

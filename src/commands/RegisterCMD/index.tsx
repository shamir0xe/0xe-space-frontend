import { RegisterChat } from "./registerChat";

const RegisterCMD = (
  secretRef: React.MutableRefObject<boolean>,
): [JSX.Element, RegisterChat] => {
  const registerChat = new RegisterChat(secretRef);
  return [registerChat.renderHistory(), registerChat];
};

export default RegisterCMD;

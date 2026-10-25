import { AuthAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

/** Sets a new password with the code sent by forgot_password. */
export class ResetPasswordChat extends Chat {
  secretRef: React.MutableRefObject<boolean>;
  email: string | null = null;
  code: string | null = null;
  history: JSX.Element[] = [<div>Enter your email address:</div>];

  constructor(secretRef: React.MutableRefObject<boolean>) {
    super();
    this.secretRef = secretRef;
  }

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    if (line.length == 0) {
      this.history.push(<div>This field couldn't be empty</div>);
      return this.renderHistory();
    }
    if (this.state == 0) {
      this.email = line;
      this.state += 1;
      this.history.push(<div>{line}</div>);
      this.history.push(<div>Enter the received code:</div>);
      return this.renderHistory();
    } else if (this.state == 1) {
      this.code = line;
      this.state += 1;
      this.history.push(<div>{line}</div>);
      this.history.push(<div>New password (at least 8 characters):</div>);
      this.secretRef.current = true;
      return this.renderHistory();
    } else if (this.state == 2) {
      this.secretRef.current = false;
      try {
        await AuthAPI.resetPassword(this.email ?? "", this.code ?? "", line);
        this.state = ChatStates.SUCCESS;
        this.history.push(
          <div>
            Password changed and every device logged out. Run{" "}
            <strong>login</strong> to sign in.
          </div>,
        );
      } catch (error) {
        this.state = ChatStates.FAILURE;
        this.history.push(<div>{errorMessage(error)}</div>);
      }
      return this.renderHistory();
    }
    return <div></div>;
  }
}

const ResetPasswordCMD = (
  secretRef: React.MutableRefObject<boolean>,
): [JSX.Element, ResetPasswordChat] => {
  const chat = new ResetPasswordChat(secretRef);
  return [chat.renderHistory(), chat];
};

export default ResetPasswordCMD;

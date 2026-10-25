import { AuthAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class ForgotPasswordChat extends Chat {
  history: JSX.Element[] = [<div>Enter your email address:</div>];

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    if (line.length == 0) {
      this.history.push(<div>Email address couldn't be empty</div>);
      return this.renderHistory();
    }
    this.history.push(<div>{line}</div>);
    try {
      await AuthAPI.forgotPassword(line);
      this.state = ChatStates.SUCCESS;
      this.history.push(
        <div>
          If the address is registered, a reset code is on its way. Then run{" "}
          <strong>reset_password</strong>.
        </div>,
      );
    } catch (error) {
      this.state = ChatStates.FAILURE;
      this.history.push(<div>{errorMessage(error)}</div>);
    }
    return this.renderHistory();
  }
}

const ForgotPasswordCMD = (): [JSX.Element, ForgotPasswordChat] => {
  const chat = new ForgotPasswordChat();
  return [chat.renderHistory(), chat];
};

export default ForgotPasswordCMD;

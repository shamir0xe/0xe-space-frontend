import { AuthAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class ResendCodeChat extends Chat {
  history: JSX.Element[] = [<div>Enter your email address:</div>];

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    if (line.length == 0) {
      this.history.push(<div>Email address couldn't be empty</div>);
      return this.renderHistory();
    }
    this.history.push(<div>{line}</div>);
    try {
      await AuthAPI.resendCode(line);
      this.state = ChatStates.SUCCESS;
      this.history.push(
        <div>
          If the address is registered and not verified yet, a new code is on its
          way. Then run <strong>confirm_code</strong>.
        </div>,
      );
    } catch (error) {
      this.state = ChatStates.FAILURE;
      this.history.push(<div>{errorMessage(error)}</div>);
    }
    return this.renderHistory();
  }
}

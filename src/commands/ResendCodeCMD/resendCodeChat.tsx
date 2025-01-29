import { AuthAPI } from "@/facades/apiCall";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class ResendCodeChat extends Chat {
  username: string | null = null;
  email: string | null = null;
  history: JSX.Element[] = [<div>Enter your username:</div>];

  constructor() {
    super();
  }

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    console.log(`recieved ${line}`);
    if (this.state == 0) {
      // Username
      if (line.length == 0) {
        this.history.push(<div>Username couldn't be null</div>);
        return this.renderHistory();
      }
      this.username = line;
      this.state += 1;
      this.history.push(<div>{this.username}</div>);
      this.history.push(<div>Enter your email address:</div>);
      return this.renderHistory();
    } else if (this.state == 1) {
      // Email
      if (line.length == 0) {
        this.history.push(<div>Email address couldn't be null</div>);
        return this.renderHistory();
      }
      this.email = line;
      try {
        await AuthAPI.resendCode(this.username ?? "", this.email ?? "");
        this.history.push(
          <div>Successfully sent the code to your email address</div>,
        );
        this.state = ChatStates.SUCCESS;
      } catch (error: any) {
        this.history.push(<div>{String(error)}</div>);
        this.state = ChatStates.FAILURE;
      }
      return this.renderHistory();
    }
    return <div></div>;
  }
}

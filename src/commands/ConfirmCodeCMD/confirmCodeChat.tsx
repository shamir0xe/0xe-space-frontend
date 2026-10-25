import { AuthAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import startSession from "@/orchestrators/startSession";
import User from "@/models/user";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

/** Verifies the email address with the received code and logs the user in. */
export class ConfirmCodeChat extends Chat {
  setUser: (user: User) => void;
  login: string | null = null;
  history: JSX.Element[] = [<div>Enter your username or email:</div>];

  constructor(setUser: (user: User) => void) {
    super();
    this.setUser = setUser;
  }

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    if (this.state == 0) {
      if (line.length == 0) {
        this.history.push(<div>Username or email couldn't be empty</div>);
        return this.renderHistory();
      }
      this.login = line;
      this.state += 1;
      this.history.push(<div>{line}</div>);
      this.history.push(<div>Enter the received code:</div>);
      return this.renderHistory();
    } else if (this.state == 1) {
      if (line.length == 0) {
        this.history.push(<div>Received code couldn't be empty</div>);
        return this.renderHistory();
      }
      this.history.push(<div>{line}</div>);
      try {
        const session = await AuthAPI.verifyEmail(this.login ?? "", line);
        startSession(this.setUser, session);
        this.state = ChatStates.SUCCESS;
        this.history.push(<div>Email confirmed! You're logged in.</div>);
      } catch (error) {
        this.state = ChatStates.FAILURE;
        this.history.push(<div>{errorMessage(error)}</div>);
      }
      return this.renderHistory();
    }
    return <div></div>;
  }
}

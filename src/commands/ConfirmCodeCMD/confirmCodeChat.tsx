import CookiesFacade from "@/facades/cookiesFacade";
import { AuthAPI } from "@/facades/apiCall";
import postLoginProcess from "@/orchestrators/postLoginProcess";
import User from "@/models/user";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class ConfirmCodeChat extends Chat {
  setUser: (user: User) => void;
  username: string | null = null;
  code: string | null = null;
  password: string | null = null;
  history: JSX.Element[] = [<div>Enter your username:</div>];

  constructor(setUser: (user: User) => void) {
    super();
    this.setUser = setUser;
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
      this.history.push(<div>Enter the received code:</div>);
      return this.renderHistory();
    } else if (this.state == 1) {
      // Code
      if (line.length == 0) {
        this.history.push(<div>Received code couldn't be null</div>);
        return this.renderHistory();
      }
      this.code = line;
      this.state += 1;
      this.history.push(<div>{this.code}</div>);
      this.history.push(
        <div>
          Wanna change your password? If yes type your new password down below,
          otherwise just press enter (Optional)
        </div>,
      );
      return this.renderHistory();
    } else if (this.state == 2) {
      // Password (Optional)
      this.state += 1;
      if (line.length == 0) {
        return this.recieve("");
      }
      this.history.push(<div>Password will be changed</div>);
      this.password = line;
      return this.recieve("");
    } else if (this.state == 3) {
      // Submission(internal state)
      let token = "";
      try {
        token = await AuthAPI.confirmCode(
          this.username ?? "",
          this.code ?? "",
          this.password,
        );
        this.history.push(<div>Code confirmed! Logging in...</div>);
        this.state = ChatStates.SUCCESS;
      } catch (error: any) {
        this.history.push(<div>{String(error)}</div>);
        this.state = ChatStates.FAILURE;
        return this.renderHistory();
      }
      // Login
      CookiesFacade.saveToken(token);
      postLoginProcess(this.setUser, token);
      this.history.push(<div>Successfully logged in!</div>);
      return this.renderHistory();
    }
    return <div></div>;
  }
}

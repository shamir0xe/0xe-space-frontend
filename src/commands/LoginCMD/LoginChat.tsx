import CookiesFacade from "@/facades/cookiesFacade";
import { AuthAPI } from "@/facades/apiCall";
import postLoginProcess from "@/orchestrators/postLoginProcess";
import User from "@/models/user";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class LoginChat extends Chat {
  setUser: (user: User) => void;
  secretRef: React.MutableRefObject<boolean>;
  username: string | null = null;
  password: string | null = null;
  history: JSX.Element[] = [<div>Enter Username:</div>];

  constructor(
    setUser: (user: User) => void,
    secretRef: React.MutableRefObject<boolean>,
  ) {
    super();
    this.setUser = setUser;
    this.secretRef = secretRef;
  }

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    console.log(`recieved ${line}`);
    if (this.state == 0) {
      if (line.length == 0) {
        this.history.push(<div>Username couldn't be null</div>);
        return this.renderHistory();
      }
      this.username = line;
      this.state += 1;
      this.history.push(<div>{line}</div>);
      this.history.push(<div>Enter password:</div>);
      this.secretRef.current = true;
      return this.renderHistory();
    } else if (this.state == 1) {
      if (line.length == 0) {
        return <div>Password couldn't be null</div>;
      }
      this.password = line;
      this.state += 1;
      this.secretRef.current = false;
      if (this.username == null) {
        this.history.push(<div>Invalid Username</div>);
        return this.renderHistory();
      }
      const token = await AuthAPI.login(this.username, this.password);
      if (token == null) {
        this.state = ChatStates.FAILURE;
        this.history.push(<div>Incorrect, try again</div>);
        return this.renderHistory();
      }
      this.state = ChatStates.SUCCESS;

      CookiesFacade.saveToken(token);
      postLoginProcess(this.setUser, token);

      this.history.push(<div>Successfully logged in</div>);
      return this.renderHistory();
    }
    return <div></div>;
  }
}

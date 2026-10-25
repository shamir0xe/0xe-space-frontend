import { AuthAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import startSession from "@/orchestrators/startSession";
import User from "@/models/user";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class LoginChat extends Chat {
  setUser: (user: User) => void;
  secretRef: React.MutableRefObject<boolean>;
  login: string | null = null;
  history: JSX.Element[] = [<div>Enter username or email:</div>];

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
    if (this.state == 0) {
      if (line.length == 0) {
        this.history.push(<div>Username or email couldn't be empty</div>);
        return this.renderHistory();
      }
      this.login = line;
      this.state += 1;
      this.history.push(<div>{line}</div>);
      this.history.push(<div>Enter password:</div>);
      this.secretRef.current = true;
      return this.renderHistory();
    } else if (this.state == 1) {
      if (line.length == 0) {
        this.history.push(<div>Password couldn't be empty</div>);
        return this.renderHistory();
      }
      this.secretRef.current = false;
      try {
        const session = await AuthAPI.login(this.login ?? "", line);
        startSession(this.setUser, session);
        this.state = ChatStates.SUCCESS;
        this.history.push(<div>Successfully logged in</div>);
      } catch (error) {
        this.state = ChatStates.FAILURE;
        this.history.push(<div>{errorMessage(error)}</div>);
      }
      return this.renderHistory();
    }
    return <div></div>;
  }
}

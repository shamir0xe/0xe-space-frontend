import CookiesFacade from "@/facades/cookiesFacade";
import APICall from "@/facades/apiCall";
import postLoginProcess from "@/orchestrators/postLoginProcess";
import User from "@/models/user";

export enum ChatStates {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  SUCCESS = 12345,
  FAILURE = -1,
}

export class LoginChat {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  state: number = ChatStates.NOT_STARTED;
  username: string | null = null;
  password: string | null = null;
  history: JSX.Element[] = [<div>Enter Username:</div>];

  constructor(setUser: React.Dispatch<React.SetStateAction<User>>) {
    this.setUser = setUser;
  }

  isEnded(): boolean {
    return this.state == ChatStates.SUCCESS || this.state == ChatStates.FAILURE;
  }

  renderHistory(): JSX.Element {
    return (
      <div>
        {this.history.map((value, index) => {
          return (
            <div key={index} className="text-left">
              {value}
            </div>
          );
        })}
      </div>
    );
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
      return this.renderHistory();
    } else if (this.state == 1) {
      if (line.length == 0) {
        return <div>Password couldn't be null</div>;
      }
      this.password = line;
      this.state += 1;
      if (this.username == null) {
        this.history.push(<div>Invalid Username</div>);
        return this.renderHistory();
      }
      let token = await APICall.login(this.username, this.password);
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

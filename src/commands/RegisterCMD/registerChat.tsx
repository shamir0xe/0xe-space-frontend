import { AuthAPI } from "@/facades/apiCall";
import User from "@/models/user";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class RegisterChat extends Chat {
  setUser: (user: User) => void;
  username: string | null = null;
  password: string | null = null;
  name: string | null = null;
  email: string | null = null;
  history: JSX.Element[] = [<div>Username:</div>];

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
      this.history.push(<div>{line}</div>);
      this.history.push(<div>Password:</div>);
      return this.renderHistory();
    } else if (this.state == 1) {
      // Password
      if (line.length == 0) {
        this.history.push(<div>Password couldn't be null</div>);
        return this.renderHistory();
      }
      this.password = line;
      this.state += 1;
      this.history.push(<div>Email:</div>);
      return this.renderHistory();
    } else if (this.state == 2) {
      // Email
      if (line.length == 0) {
        this.history.push(<div>Email couldn't be null</div>);
        return this.renderHistory();
      }
      this.email = line;
      this.state += 1;
      this.history.push(<div>{this.email}</div>);
      this.history.push(<div>Full Name (Optional):</div>);
      return this.renderHistory();
    } else if (this.state == 3) {
      // Name
      console.log("in the name");
      this.name = line;
      if (this.name) {
        this.history.push(<div>{this.name}</div>);
      }

      // API call: Register
      try {
        const result = await AuthAPI.register(
          this.username ?? "",
          this.password ?? "",
          this.email ?? "",
          this.name,
        );
        this.history.push(
          <div>Successfully sent an email to {result.email}</div>,
        );
        this.state = ChatStates.SUCCESS;
        console.log(`result: ${result}`);
      } catch (error: any) {
        this.history.push(<div>{String(error)}</div>);
        this.state = ChatStates.FAILURE;
        console.log(`~~~~~ error: ${error}`);
      }
      return this.renderHistory();
    }

    return <div></div>;
  }
}

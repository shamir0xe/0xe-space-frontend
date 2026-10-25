import { AuthAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { Chat, ChatStates } from "@/helpers/chat/Chat";

export class RegisterChat extends Chat {
  secretRef: React.MutableRefObject<boolean>;
  username: string | null = null;
  password: string | null = null;
  email: string | null = null;
  history: JSX.Element[] = [
    <div>Username (8-20 letters, digits, '.' or '_'):</div>,
  ];

  constructor(secretRef: React.MutableRefObject<boolean>) {
    super();
    this.secretRef = secretRef;
  }

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    if (this.state == 0) {
      if (line.length == 0) {
        this.history.push(<div>Username couldn't be empty</div>);
        return this.renderHistory();
      }
      this.username = line;
      this.state += 1;
      this.history.push(<div>{line}</div>);
      this.history.push(<div>Password (at least 8 characters):</div>);
      this.secretRef.current = true;
      return this.renderHistory();
    } else if (this.state == 1) {
      if (line.length == 0) {
        this.history.push(<div>Password couldn't be empty</div>);
        return this.renderHistory();
      }
      this.password = line;
      this.secretRef.current = false;
      this.state += 1;
      this.history.push(<div>Email:</div>);
      return this.renderHistory();
    } else if (this.state == 2) {
      if (line.length == 0) {
        this.history.push(<div>Email couldn't be empty</div>);
        return this.renderHistory();
      }
      this.email = line;
      this.state += 1;
      this.history.push(<div>{this.email}</div>);
      this.history.push(<div>Full Name (Optional):</div>);
      return this.renderHistory();
    } else if (this.state == 3) {
      if (line) {
        this.history.push(<div>{line}</div>);
      }
      try {
        const result = await AuthAPI.register({
          username: this.username ?? "",
          password: this.password ?? "",
          email: this.email ?? "",
          name: line || null,
        });
        this.state = ChatStates.SUCCESS;
        this.history.push(
          result.verification_email_sent ? (
            <div>
              We sent a verification code to {result.user.email}. Run{" "}
              <strong>confirm_code</strong> to verify your account.
            </div>
          ) : (
            <div>
              Your account was created, but the email couldn't be sent. Run{" "}
              <strong>resend_code</strong> in a minute.
            </div>
          ),
        );
      } catch (error) {
        this.state = ChatStates.FAILURE;
        this.history.push(<div>{errorMessage(error)}</div>);
      } finally {
        this.password = null;
      }
      return this.renderHistory();
    }
    return <div></div>;
  }
}

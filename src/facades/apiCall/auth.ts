import User from "@/models/user";
import BaseAPI from "./base";

/** A successful login: the bearer token and the logged-in user. */
export type Session = {
  token: string;
  token_type: string;
  user: User;
};

export type RegisterInput = {
  username: string;
  password: string;
  email: string;
  name?: string | null;
};

export type RegisterResult = {
  user: User;
  verification_email_sent: boolean;
};

export class AuthAPI extends BaseAPI {
  /** login accepts a username or an email address. */
  static login(login: string, password: string): Promise<Session> {
    return this.post<Session>("/auth/login", { login, password });
  }

  static register(input: RegisterInput): Promise<RegisterResult> {
    return this.post<RegisterResult>("/auth/register", {
      ...input,
      name: input.name || undefined,
    });
  }

  /** Confirms the email with the received code and logs the user in. */
  static verifyEmail(login: string, code: string): Promise<Session> {
    return this.post<Session>("/auth/verify-email", { login, code });
  }

  /** Always succeeds; the server never reveals whether the email exists. */
  static async resendCode(email: string): Promise<void> {
    await this.post("/auth/resend-code", { email });
  }

  /** Revokes the current token on the server. */
  static async logout(): Promise<void> {
    await this.post("/auth/logout");
  }

  /** Always succeeds; the server never reveals whether the email exists. */
  static async forgotPassword(email: string): Promise<void> {
    await this.post("/auth/password/forgot", { email });
  }

  /** Sets a new password and logs out every device. */
  static async resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    await this.post("/auth/password/reset", { email, code, password });
  }
}

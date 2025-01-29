import User from "@/models/user";
import BaseAPI from "./base";
import ServerResponse from "@/models/serverResponse";

export class AuthAPI extends BaseAPI {
  static async login(
    username: string,
    password: string,
  ): Promise<string | null> {
    try {
      const response = await this.get("/auth/login", {
        username: username,
        password: password,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.text();
    } catch (error: any) {
      console.log(`error occurred: ${error}`);
      return null;
    }
  }

  static async register(
    username: string,
    password: string,
    email: string,
    name: string | null,
  ): Promise<User> {
    const response = await this.get("/auth/register", {
      username: username,
      password: password,
      email: email,
      name: name,
    });
    if (!response.ok) {
      throw new Error(`(${response.statusText}): ${await response.text()}`);
    }
    return (await response.json()) as User;
  }

  static async logout(): Promise<User> {
    const response = await this.get("/auth/logout");
    if (!response.ok) {
      throw new Error(`(${response.statusText}): ${await response.text()}`);
    }
    return (await response.json()) as User;
  }

  static async resendCode(username: string, email: string): Promise<User> {
    const response = await this.get("/auth/resend-code", {
      username: username,
      email: email,
    });
    if (!response.ok) {
      throw new Error(`(${response.statusText}): ${await response.text()}`);
    }
    return (await response.json()) as User;
  }

  static async confirmCode(
    username: string,
    code: string,
    password: string | null,
  ): Promise<string> {
    const response = await this.get("/auth/confirm-code", {
      username: username,
      code: code,
      password: password,
    });
    let res = (await response.json()) as ServerResponse;
    if (!response.ok) {
      res.status = response.status;
    }
    if (res.status != 200) {
      throw new Error(`(${res.status}): ${res.message}`);
    }
    return res.message;
  }
}

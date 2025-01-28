import User from "@/models/user";
import BaseAPI from "./base";

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
}

import User from "@/models/user";
import CookiesFacade from "../cookiesFacade";

class APICall {
  static baseURL: string = `http://127.0.0.1:8000/api/v0.0.1`;

  static async userInfo(): Promise<User> {
    try {
      let url = `${this.baseURL}/user/info`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CookiesFacade.readToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      let user = (await response.json()) as User;
      return Promise.resolve(user);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async login(
    username: string,
    password: string,
  ): Promise<string | null> {
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const loginURL = `${APICall.baseURL}/auth/login?username=${encodedUsername}&password=${encodedPassword}`;
    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.text();
    } catch (error: any) {
      return null;
    }
  }
}

export default APICall;

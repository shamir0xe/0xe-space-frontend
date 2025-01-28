import User from "@/models/user";
import BaseAPI from "./base";

export class UserAPI extends BaseAPI {
  static async userInfo(): Promise<User> {
    try {
      const response = await this.post("/user/info")
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      let user = (await response.json()) as User;
      return Promise.resolve(user);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }
}

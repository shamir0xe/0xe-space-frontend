import User from "@/models/user";
import BaseAPI from "./base";

export class UserAPI extends BaseAPI {
  static me(): Promise<User> {
    return this.get<User>("/users/me");
  }
}

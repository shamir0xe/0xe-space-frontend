import BaseAPI from "./base";

export class AuthAPI extends BaseAPI {
  static async login(
    username: string,
    password: string,
  ): Promise<string | null> {
    try {
      const response = await this.get("/auth/login", {
        username: username,
        password: password
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.text();
    } catch (error: any) {
      console.log(`error occurred: ${error}`)
      return null;
    }
  }
};


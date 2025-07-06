import BaseAPI from "./base";

export class GeneralAPI extends BaseAPI {
  static async getKey(key: string): Promise<string> {
    try {
      const response = await this.get("/general/get-key", { key: key });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return Promise.resolve(await response.json());
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  static async setKey(key: string, value: string): Promise<boolean> {
    try {
      const response = await this.post("/general/set-key", { key: key }, value);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return Promise.resolve(true);
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }
}

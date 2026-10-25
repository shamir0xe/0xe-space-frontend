import BaseAPI from "./base";

/** An entry of the site's key/value store (about_me, cv, socials, ...). */
export type KeyValueEntry = {
  key: string;
  value: string;
  public: boolean;
  updated_at: string;
};

export class GeneralAPI extends BaseAPI {
  static async getKey(key: string): Promise<string> {
    const entry = await this.get<KeyValueEntry>(
      `/kv/${encodeURIComponent(key)}`,
    );
    return entry.value;
  }

  /** Creates or updates a key. Omitting isPublic keeps its current visibility. */
  static async setKey(
    key: string,
    value: string,
    isPublic?: boolean,
  ): Promise<boolean> {
    await this.put<KeyValueEntry>(`/kv/${encodeURIComponent(key)}`, {
      value,
      public: isPublic,
    });
    return true;
  }

  /** Admin only. */
  static async listKeys(): Promise<KeyValueEntry[]> {
    const res = await this.get<{ items: KeyValueEntry[] }>("/kv");
    return res.items;
  }
}

import CookiesFacade from "../cookiesFacade";

export default class BaseAPI {
  static baseURL: string = import.meta.env.VITE_BASE_URL;

  protected static makeParams(
    url: string,
    params?: Record<string, any>,
  ): string {
    url = `${this.baseURL}${url}`;
    if (url[-1] == "/") url = url.slice(0, -1);
    if (params) {
      let first = true;
      for (const key in params) {
        if (params[key]) {
          if (first) {
            first = false;
            url += "?";
          } else {
            url += "&";
          }
          url += `${key}=${encodeURIComponent(params[key] ?? "")}`;
        }
      }
    }
    console.log(`created URL is: ${url}`);
    return url;
  }

  protected static makeHeaders(): Record<string, string> {
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    let token = CookiesFacade.readToken();
    if (typeof token == "string" && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  protected static async get(
    url: string,
    params?: Record<string, any>,
  ): Promise<Response> {
    url = this.makeParams(url, params);
    return fetch(url, {
      method: "GET",
      headers: this.makeHeaders(),
    });
  }

  protected static async post(
    url: string,
    params?: Record<string, any>,
    body: string = "",
  ): Promise<Response> {
    url = this.makeParams(url, params);
    return fetch(url, {
      method: "POST",
      headers: this.makeHeaders(),
      body: JSON.stringify(body),
    });
  }
}

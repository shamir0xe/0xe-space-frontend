import CookiesFacade from "../cookiesFacade";

type QueryValue = string | number | boolean | null | undefined;
type Query = Record<string, QueryValue>;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  query?: Query;
  body?: unknown;
};

/** An error returned by the API: `{"error": {"code": ..., "message": ...}}`. */
export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  toString(): string {
    return this.message;
  }
}

/** Human-readable message of anything thrown by an API call. */
export const errorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export default class BaseAPI {
  static baseURL: string = import.meta.env.VITE_BASE_URL ?? "";

  /** Called when the server rejects the stored token (expired or revoked). */
  static onSessionExpired: (() => void) | null = null;

  protected static makeURL(path: string, query?: Query): string {
    const base = this.baseURL.replace(/\/+$/, "");
    let url = `${base}${path}`;
    if (query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== null && value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }
    return url;
  }

  protected static makeHeaders(withToken: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = withToken ? CookiesFacade.readToken() : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Sends a JSON request and returns the decoded JSON response (undefined for
   * 204). Non-2xx responses throw an ApiError. If a GET is rejected because the
   * stored token is no longer valid, the token is dropped and the request is
   * retried anonymously, so public pages keep working after a session expires.
   */
  protected static async request<T>(
    method: Method,
    path: string,
    { query, body }: RequestOptions = {},
  ): Promise<T> {
    const send = (withToken: boolean) =>
      fetch(this.makeURL(path, query), {
        method,
        headers: this.makeHeaders(withToken),
        body: body === undefined ? undefined : JSON.stringify(body),
      });

    const hadToken = CookiesFacade.readToken() !== null;
    let response = await send(true);
    if (response.status === 401 && hadToken) {
      CookiesFacade.removeToken();
      this.onSessionExpired?.();
      if (method === "GET") {
        response = await send(false);
      }
    }
    return this.decode<T>(response);
  }

  private static async decode<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }
    const text = await response.text();
    let data: unknown = undefined;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = undefined;
      }
    }
    if (!response.ok) {
      const err = (data as { error?: { code?: string; message?: string } })
        ?.error;
      throw new ApiError(
        response.status,
        err?.code ?? "http_error",
        err?.message ??
          (response.statusText || `request failed (${response.status})`),
      );
    }
    return data as T;
  }

  protected static get<T>(path: string, query?: Query): Promise<T> {
    return this.request<T>("GET", path, { query });
  }

  protected static post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  protected static put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  protected static patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, { body });
  }

  protected static del<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}

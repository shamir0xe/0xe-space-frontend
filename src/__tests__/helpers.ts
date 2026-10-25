import { vi } from "vitest";

export type Call = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

/** Replaces fetch with a queue of canned responses and records every call. */
export const mockFetch = (
  ...responses: Array<{ status: number; body?: unknown }>
) => {
  const calls: Call[] = [];
  const queue = [...responses];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({
        url,
        method: init.method ?? "GET",
        headers: init.headers as Record<string, string>,
        body: init.body ? JSON.parse(init.body as string) : undefined,
      });
      const next = queue.shift() ?? { status: 500 };
      const text = next.body === undefined ? "" : JSON.stringify(next.body);
      return new Response(next.status === 204 ? null : text, {
        status: next.status,
      });
    }),
  );
  return calls;
};

export const clearCookies = () => {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
};

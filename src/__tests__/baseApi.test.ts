import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BaseAPI, { ApiError, errorMessage } from "@/facades/apiCall/base";
import { BlogAPI, GeneralAPI, UserAPI } from "@/facades/apiCall";
import CookiesFacade from "@/facades/cookiesFacade";
import { clearCookies, mockFetch } from "./helpers";

beforeEach(() => {
  clearCookies();
  BaseAPI.baseURL = "http://api.test/api/v1/";
  BaseAPI.onSessionExpired = null;
});
afterEach(() => vi.unstubAllGlobals());

describe("BaseAPI", () => {
  it("builds URLs without double slashes and skips empty query values", async () => {
    const calls = mockFetch({ status: 200, body: { items: [], page: 2, page_size: 5, total: 0 } });
    await BlogAPI.getPosts(2, 5);
    expect(calls[0].url).toBe("http://api.test/api/v1/posts?page=2&page_size=5");
  });

  it("sends JSON bodies and the bearer token", async () => {
    CookiesFacade.saveToken("tok");
    const calls = mockFetch({ status: 200, body: { key: "k", value: "v", public: false, updated_at: "" } });
    await GeneralAPI.setKey("about_me", "hello");
    expect(calls[0].method).toBe("PUT");
    expect(calls[0].url).toBe("http://api.test/api/v1/kv/about_me");
    expect(calls[0].headers["Authorization"]).toBe("Bearer tok");
    expect(calls[0].body).toEqual({ value: "hello" });
  });

  it("turns error bodies into ApiError with the server message", async () => {
    mockFetch({ status: 409, body: { error: { code: "username_taken", message: "username is already taken" } } });
    const err = await UserAPI.me().catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(409);
    expect(err.code).toBe("username_taken");
    expect(errorMessage(err)).toBe("username is already taken");
  });

  it("falls back to the status when the error body is not JSON", async () => {
    mockFetch({ status: 502 });
    const err = await UserAPI.me().catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(502);
  });

  it("resolves 204 responses with undefined", async () => {
    mockFetch({ status: 204 });
    await expect(BlogAPI.deletePost("3")).resolves.toBeUndefined();
  });

  it("drops a rejected token and retries public GETs anonymously", async () => {
    CookiesFacade.saveToken("stale");
    const expired = vi.fn();
    BaseAPI.onSessionExpired = expired;
    const calls = mockFetch(
      { status: 401, body: { error: { code: "unauthorized", message: "invalid or expired token" } } },
      { status: 200, body: { id: "1", title: "t", content: "c", created_at: "", updated_at: "" } },
    );
    const post = await BlogAPI.getPost("1");
    expect(post.title).toBe("t");
    expect(calls).toHaveLength(2);
    expect(calls[1].headers["Authorization"]).toBeUndefined();
    expect(CookiesFacade.readToken()).toBeNull();
    expect(expired).toHaveBeenCalledOnce();
  });

  it("does not retry writes after a 401", async () => {
    CookiesFacade.saveToken("stale");
    const calls = mockFetch({ status: 401, body: { error: { code: "unauthorized", message: "nope" } } });
    await expect(BlogAPI.ratePost("1", 5)).rejects.toThrow("nope");
    expect(calls).toHaveLength(1);
    expect(CookiesFacade.readToken()).toBeNull();
  });

  it("does not treat an anonymous 401 as an expired session", async () => {
    const expired = vi.fn();
    BaseAPI.onSessionExpired = expired;
    const calls = mockFetch({ status: 401, body: { error: { code: "invalid_credentials", message: "invalid login or password" } } });
    await expect(UserAPI.me()).rejects.toThrow("invalid login or password");
    expect(calls).toHaveLength(1);
    expect(expired).not.toHaveBeenCalled();
  });
});

describe("GeneralAPI", () => {
  it("getKey returns the plain value of the entry", async () => {
    const calls = mockFetch({ status: 200, body: { key: "github", value: "https://github.com/x", public: true, updated_at: "" } });
    await expect(GeneralAPI.getKey("github")).resolves.toBe("https://github.com/x");
    expect(calls[0].url).toBe("http://api.test/api/v1/kv/github");
  });
});

describe("BlogAPI", () => {
  it("maps paginated comments", async () => {
    mockFetch({
      status: 200,
      body: {
        items: [{ id: "C1", post_id: "1", content: "hi", author: { id: "U", username: "u", name: null }, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", rating_avg: null, rating_count: 0 }],
        page: 1, page_size: 20, total: 1,
      },
    });
    const page = await BlogAPI.getComments("1");
    expect(page.total).toBe(1);
    expect(page.items[0].created_at).toBeInstanceOf(Date);
    expect(page.items[0].my_rating).toBeNull();
  });

  it("rates with PUT and returns the new stats", async () => {
    const calls = mockFetch({ status: 200, body: { rating_avg: 4.5, rating_count: 2, my_rating: 5 } });
    const stats = await BlogAPI.ratePost("7", 5);
    expect(calls[0].method).toBe("PUT");
    expect(calls[0].url).toBe("http://api.test/api/v1/posts/7/rating");
    expect(calls[0].body).toEqual({ value: 5 });
    expect(stats).toEqual({ rating_avg: 4.5, rating_count: 2, my_rating: 5 });
  });
});

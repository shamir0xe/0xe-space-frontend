import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BaseAPI from "@/facades/apiCall/base";
import CookiesFacade from "@/facades/cookiesFacade";
import { LoginChat } from "@/commands/LoginCMD/LoginChat";
import { ConfirmCodeChat } from "@/commands/ConfirmCodeCMD/confirmCodeChat";
import { RegisterChat } from "@/commands/RegisterCMD/registerChat";
import { ResetPasswordChat } from "@/commands/ResetPasswordCMD";
import { ChatStates } from "@/helpers/chat/Chat";
import User from "@/models/user";
import { clearCookies, mockFetch } from "./helpers";

const session = {
  token: "new-token",
  token_type: "Bearer",
  user: { id: "U1", username: "jane.doe1", email: "jane@example.com", name: null, is_admin: false },
};

beforeEach(() => {
  clearCookies();
  BaseAPI.baseURL = "http://api.test/api/v1";
});
afterEach(() => vi.unstubAllGlobals());

describe("LoginChat", () => {
  it("logs in with username or email, hides the password and stores the token", async () => {
    const calls = mockFetch({ status: 200, body: session });
    const setUser = vi.fn<(u: User) => void>();
    const secret = { current: false };
    const chat = new LoginChat(setUser, secret);

    await chat.recieve("jane@example.com");
    expect(secret.current).toBe(true);
    await chat.recieve("s3cret-pass");

    expect(secret.current).toBe(false);
    expect(chat.state).toBe(ChatStates.SUCCESS);
    expect(calls[0].body).toEqual({ login: "jane@example.com", password: "s3cret-pass" });
    expect(CookiesFacade.readToken()).toBe("new-token");
    expect(setUser).toHaveBeenCalledWith({ ...session.user, token: "new-token" });
  });

  it("fails on wrong credentials without storing anything", async () => {
    mockFetch({ status: 401, body: { error: { code: "invalid_credentials", message: "invalid login or password" } } });
    const setUser = vi.fn();
    const chat = new LoginChat(setUser, { current: false });
    await chat.recieve("jane.doe1");
    await chat.recieve("wrong");
    expect(chat.state).toBe(ChatStates.FAILURE);
    expect(setUser).not.toHaveBeenCalled();
    expect(CookiesFacade.readToken()).toBeNull();
  });
});

describe("RegisterChat", () => {
  it("sends one JSON registration and hides the password while typed", async () => {
    const calls = mockFetch({ status: 201, body: { user: session.user, verification_email_sent: true } });
    const secret = { current: false };
    const chat = new RegisterChat(secret);
    await chat.recieve("jane.doe1");
    expect(secret.current).toBe(true);
    await chat.recieve("s3cret-pass");
    expect(secret.current).toBe(false);
    await chat.recieve("jane@example.com");
    await chat.recieve("");
    expect(chat.state).toBe(ChatStates.SUCCESS);
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe("POST");
    expect(calls[0].url).toBe("http://api.test/api/v1/auth/register");
    expect(calls[0].body).toEqual({ username: "jane.doe1", password: "s3cret-pass", email: "jane@example.com" });
  });
});

describe("ConfirmCodeChat", () => {
  it("verifies the email and starts a session", async () => {
    const calls = mockFetch({ status: 200, body: session });
    const setUser = vi.fn();
    const chat = new ConfirmCodeChat(setUser);
    await chat.recieve("jane.doe1");
    await chat.recieve(" 123456 ");
    expect(chat.state).toBe(ChatStates.SUCCESS);
    expect(calls[0].body).toEqual({ login: "jane.doe1", code: "123456" });
    expect(CookiesFacade.readToken()).toBe("new-token");
  });
});

describe("ResetPasswordChat", () => {
  it("resets the password with email, code and a hidden new password", async () => {
    const calls = mockFetch({ status: 204 });
    const secret = { current: false };
    const chat = new ResetPasswordChat(secret);
    await chat.recieve("jane@example.com");
    await chat.recieve("654321");
    expect(secret.current).toBe(true);
    await chat.recieve("brand-new-pass");
    expect(secret.current).toBe(false);
    expect(chat.state).toBe(ChatStates.SUCCESS);
    expect(calls[0].url).toBe("http://api.test/api/v1/auth/password/reset");
    expect(calls[0].body).toEqual({ email: "jane@example.com", code: "654321", password: "brand-new-pass" });
  });
});

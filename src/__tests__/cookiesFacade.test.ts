import { describe, it, expect, beforeEach } from "vitest";
import CookiesFacade from "@/facades/cookiesFacade";

// js-cookie reads/writes document.cookie — jsdom provides that.
beforeEach(() => {
  // Clear all cookies between tests
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
});

describe("CookiesFacade", () => {
  describe("saveToken / readToken", () => {
    it("stores and retrieves a plain token", () => {
      CookiesFacade.saveToken("abc123");
      expect(CookiesFacade.readToken()).toBe("abc123");
    });

    it("strips surrounding quotes from token", () => {
      CookiesFacade.saveToken('"quoted-token"');
      expect(CookiesFacade.readToken()).toBe("quoted-token");
    });

    it("does not strip quotes from tokens that do not start with a quote", () => {
      CookiesFacade.saveToken("no-quotes");
      expect(CookiesFacade.readToken()).toBe("no-quotes");
    });
  });

  describe("readToken", () => {
    it("returns null when no token is stored", () => {
      expect(CookiesFacade.readToken()).toBeNull();
    });
  });

  describe("removeToken", () => {
    it("clears a previously stored token", () => {
      CookiesFacade.saveToken("to-be-removed");
      CookiesFacade.removeToken();
      expect(CookiesFacade.readToken()).toBeNull();
    });
  });
});

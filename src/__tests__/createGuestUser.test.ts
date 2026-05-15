import { describe, it, expect } from "vitest";
import createGuestUser from "@/actions/user/createGuestUser";

describe("createGuestUser", () => {
  it("returns a user with username prefixed by 'guest-'", () => {
    const user = createGuestUser();
    expect(user.username).toMatch(/^guest-\d+$/);
  });

  it("id matches the numeric suffix of the username", () => {
    const user = createGuestUser();
    expect(user.username).toBe(`guest-${user.id}`);
  });

  it("generates different IDs on successive calls (probabilistic)", () => {
    const ids = new Set(Array.from({ length: 20 }, () => createGuestUser().id));
    // With range 0–9999 and 20 draws, the chance of all identical is negligible
    expect(ids.size).toBeGreaterThan(1);
  });
});

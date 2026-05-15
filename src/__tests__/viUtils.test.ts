import { describe, it, expect } from "vitest";
import { viWord, viDelete, writable } from "@/helpers/terminals/viTerminal/vi-utils";

describe("viDelete", () => {
  it("deletes a range left-to-right", () => {
    const [result, pos] = viDelete("hello world", 5, 11);
    expect(result).toBe("hello");
    expect(pos).toBe(5);
  });

  it("deletes a range right-to-left (swaps positions)", () => {
    const [result, pos] = viDelete("hello world", 11, 5);
    expect(result).toBe("hello");
    expect(pos).toBe(5);
  });

  it("deletes a single character", () => {
    const [result] = viDelete("abc", 1, 2);
    expect(result).toBe("ac");
  });

  it("returns empty string when deleting entire content", () => {
    const [result] = viDelete("abc", 0, 3);
    expect(result).toBe("");
  });

  it("is a no-op when initPos equals endPos", () => {
    const [result] = viDelete("abc", 2, 2);
    expect(result).toBe("abc");
  });
});

describe("viWord", () => {
  it("moves forward one word", () => {
    // "hello world" — from 0 forward 1 word should land at end of "hello"
    const pos = viWord("hello world", 0, 1);
    expect(pos).toBe(4);
  });

  it("moves backward one word", () => {
    const pos = viWord("hello world", 10, -1);
    expect(pos).toBe(6);
  });

  it("clamps to 0 when moving before start", () => {
    const pos = viWord("hello", 0, -1);
    expect(pos).toBeGreaterThanOrEqual(0);
  });

  it("clamps to last index when moving past end", () => {
    const str = "hello";
    const pos = viWord(str, str.length - 1, 10);
    expect(pos).toBeLessThan(str.length);
  });
});

describe("writable", () => {
  it("accepts letters", () => {
    expect(writable("a")).toBe(true);
    expect(writable("Z")).toBe(true);
  });

  it("accepts digits", () => {
    expect(writable("5")).toBe(true);
  });

  it("accepts spaces", () => {
    expect(writable(" ")).toBe(true);
  });

  it("accepts punctuation", () => {
    expect(writable("-")).toBe(true);
    expect(writable(".")).toBe(true);
  });

  it("rejects multi-character strings", () => {
    expect(writable("ab")).toBe(false);
  });

  it("rejects control keys", () => {
    expect(writable("Enter")).toBe(false);
    expect(writable("Escape")).toBe(false);
    expect(writable("Backspace")).toBe(false);
  });
});

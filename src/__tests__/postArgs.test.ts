import { describe, expect, it } from "vitest";
import { validatePostArgs } from "@/commands/PostCMD/PostChat";

describe("validatePostArgs", () => {
  it.each([
    ["ls", []],
    ["ls", ["2"]],
    ["new", []],
    ["edit", ["3"]],
    ["delete", ["3"]],
    ["rate", ["3", "5"]],
    ["unrate", ["3"]],
    ["comments", ["3"]],
    ["comments", ["3", "2"]],
    ["comment", ["3"]],
    ["uncomment", ["01HX"]],
  ])("accepts post %s %j", (cmd, args) => {
    expect(validatePostArgs(cmd, args)).toBeNull();
  });

  it.each([
    ["ls", ["zero"]],
    ["ls", ["0"]],
    ["edit", []],
    ["rate", ["3"]],
    ["rate", ["3", "6"]],
    ["rate", ["3", "0"]],
    ["comments", []],
    ["comments", ["3", "x"]],
    ["comment", []],
    ["uncomment", []],
    ["publish", []],
  ])("rejects post %s %j with a usage message", (cmd, args) => {
    expect(validatePostArgs(cmd, args)).toMatch(/^Usage: post/);
  });
});

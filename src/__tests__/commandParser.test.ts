import { describe, it, expect } from "vitest";
import commandParser from "@/mediators/CommandMediator/commandParser";

describe("commandParser", () => {
  it("returns the command lowercased", () => {
    const [cmd] = commandParser("LOGIN");
    expect(cmd).toBe("login");
  });

  it("splits command and args", () => {
    const [cmd, args] = commandParser("post edit 42");
    expect(cmd).toBe("post");
    expect(args).toEqual(["edit", "42"]);
  });

  it("returns empty command for blank input", () => {
    const [cmd, args] = commandParser("");
    expect(cmd).toBe("");
    expect(args).toEqual([]);
  });

  it("returns empty command for whitespace-only input", () => {
    const [cmd] = commandParser("   ");
    expect(cmd).toBe("");
  });

  it("collapses extra whitespace between tokens", () => {
    const [cmd, args] = commandParser("post   ls");
    expect(cmd).toBe("post");
    expect(args).toEqual(["ls"]);
  });

  it("trims leading and trailing whitespace", () => {
    const [cmd, args] = commandParser("  cv pdf  ");
    expect(cmd).toBe("cv");
    expect(args).toEqual(["pdf"]);
  });

  it("returns no args for a bare command", () => {
    const [cmd, args] = commandParser("help");
    expect(cmd).toBe("help");
    expect(args).toEqual([]);
  });
});

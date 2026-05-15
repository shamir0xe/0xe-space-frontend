import { describe, it, expect } from "vitest";
import HistoryManager from "@/helpers/terminals/viTerminal/history-manager";

describe("HistoryManager", () => {
  describe("update", () => {
    it("records a new value (undo goes to previous state, redo returns it)", () => {
      const h = HistoryManager();
      h.update("hello");
      // undo steps back to the initial empty entry
      expect(h.undo()).toBe("");
      // redo steps forward to "hello"
      expect(h.redo()).toBe("hello");
    });

    it("is idempotent for the same value (no duplicate entry)", () => {
      const h = HistoryManager();
      h.update("hello");
      h.update("hello"); // same value — should not add another entry
      // one undo takes us back to the initial empty entry
      expect(h.undo()).toBe("");
      // redo brings back "hello"
      expect(h.redo()).toBe("hello");
    });

    it("truncates future history after an update mid-history", () => {
      const h = HistoryManager();
      h.update("a");
      h.update("b");
      h.update("c");
      h.undo(); // back to "b"
      h.update("d"); // branches from "b"
      // redo should stay at "d", not go to "c"
      expect(h.redo()).toBe("d");
    });
  });

  describe("undo / redo", () => {
    it("undoes to previous value", () => {
      const h = HistoryManager();
      h.update("first");
      h.update("second");
      expect(h.undo()).toBe("first");
    });

    it("redo returns to next value", () => {
      const h = HistoryManager();
      h.update("first");
      h.update("second");
      h.undo();
      expect(h.redo()).toBe("second");
    });

    it("undo does not go below index 0", () => {
      const h = HistoryManager();
      h.update("only");
      h.undo();
      h.undo();
      expect(h.undo()).toBe("");
    });

    it("redo does not go past the last entry", () => {
      const h = HistoryManager();
      h.update("a");
      h.redo();
      h.redo();
      expect(h.redo()).toBe("a");
    });
  });

  describe("newline", () => {
    it("moves to a new row", () => {
      const h = HistoryManager();
      h.update("cmd1");
      h.newline("cmd1");
      h.update("cmd2");
      // step back one row
      expect(h.stepHistory(-1)).toBe("cmd1");
    });

    it("stepHistory stays at first row when going too far back", () => {
      const h = HistoryManager();
      h.newline("cmd1");
      h.stepHistory(-10);
      expect(h.stepHistory(-1)).toBe("cmd1");
    });
  });

  describe("stepHistory", () => {
    it("returns current value with delta 0", () => {
      const h = HistoryManager();
      h.update("current");
      expect(h.stepHistory(0)).toBe("current");
    });

    it("navigates forward and backward through rows", () => {
      const h = HistoryManager();
      h.newline("first");
      h.newline("second");
      h.newline("third");
      // We're at row 3 (empty new row). Go back.
      expect(h.stepHistory(-1)).toBe("third");
      expect(h.stepHistory(-1)).toBe("second");
      expect(h.stepHistory(+1)).toBe("third");
    });
  });
});

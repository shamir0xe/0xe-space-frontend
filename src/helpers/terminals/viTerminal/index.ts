import React from "react";
import TerminalModes from "./modes";
import Keys from "./keys";
import HistoryManager from "./history-manager";

interface ViTerminalParams {
  secretRef: React.MutableRefObject<boolean>;
  ref: React.RefObject<HTMLElement>;
  cursorRef: React.RefObject<HTMLElement>;
  getFocus?: () => boolean;
  onClick?: (e: KeyboardEvent) => void;
  onModeChange?: (mode: TerminalModes) => void;
  onLineEnd?: (line: string) => void;
}

const ViTerminal = (
  params: ViTerminalParams,
): [() => void, (e: KeyboardEvent) => void, () => void, () => void] => {
  const {
    secretRef,
    ref,
    cursorRef,
    getFocus = () => true,
    onClick = () => { },
    onModeChange = () => { },
    onLineEnd = () => { },
  } = params;
  let mode = TerminalModes.INSERT;
  let line = "";
  let count = "";
  let cursorPos = 0;
  let internalMode = InternalModes.NORMAL;
  const historyManagers = [HistoryManager()];
  const chatHistoryPush = () => {
    historyManagers.push(HistoryManager());
  };
  const chatHistoryPop = () => {
    historyManagers.pop();
  };
  const topChatHistory = () => {
    return historyManagers[historyManagers.length - 1];
  };

  const updateLine = () => {
    if (cursorPos < 0) cursorPos = 0;
    if (cursorPos > line.length) cursorPos = line.length;
    if (cursorRef.current) cursorRef.current.style.left = `${cursorPos}ch`;
    if (ref.current) {
      if (secretRef.current) {
        ref.current.innerHTML = asterisk(line.length);
      } else {
        ref.current.innerHTML = stringToHtml(line);
        topChatHistory().update(line);
      }
    }
  };

  const asterisk = (len: number): string => {
    let res = "";
    for (let i = 0; i < len; i++) res += "*";
    return res;
  };

  const internalAction = (alterPos: number): void => {
    switch (internalMode) {
      case InternalModes.DELETE:
        [line, cursorPos] = viDelete(line, cursorPos, alterPos);
        break;
      case InternalModes.DELETE_INSERT:
        [line, cursorPos] = viDelete(line, cursorPos, alterPos);
        mode = TerminalModes.INSERT;
        onModeChange(mode);
        break;
      default:
        cursorPos = alterPos;
    }
    internalMode = InternalModes.NORMAL;
    count = "";
  };
  const changeTerminalMode = (alterMode: TerminalModes) => {
    mode = alterMode;
    onModeChange(mode);
    internalMode = InternalModes.NORMAL;
  };
  const onKeyPress = (e: KeyboardEvent) => {
    if (!getFocus()) return;
    onClick(e);
    // console.log(e);
    // console.log(line);
    if (e.key === Keys.ENTER) {
      // clear the line and execute the commands
      if (secretRef.current == false) topChatHistory().newline(line);
      onLineEnd(line);
      line = "";
      cursorPos = 0;
      internalMode = InternalModes.NORMAL;
      updateLine();
      return;
    }
    switch (mode) {
      case TerminalModes.INSERT: {
        if (e.key === Keys.ESCAPE) {
          // chaning temrinal mode
          changeTerminalMode(TerminalModes.NORMAL);
          cursorPos -= 1;
        } else if (e.key === Keys.BACKSPACE) {
          line =
            line.slice(0, cursorPos - 1) + line.slice(cursorPos, line.length);
          cursorPos -= 1;
        } else if (writable(e.key)) {
          line = line.slice(0, cursorPos) + e.key + line.slice(cursorPos);
          cursorPos += 1;
        }
        updateLine();
        break;
      }
      case TerminalModes.NORMAL: {
        const castedCount = Number(count);
        const cnt = isNaN(castedCount) || castedCount == 0 ? 1 : castedCount;
        const lowerCasedKey = e.key.toLowerCase();
        if (internalMode === InternalModes.REPLACE) {
          // replace mode have been activated, so do replace stuff
          if (writable(e.key)) {
            line =
              line.slice(0, cursorPos) +
              e.key +
              line.slice(cursorPos + 1, line.length);
            internalMode = InternalModes.NORMAL;
          }
        } else if (e.key === Keys.i.toUpperCase()) {
          // [I]: go to the begining of the line, then Insert
          cursorPos = 0;
          changeTerminalMode(TerminalModes.INSERT);
        } else if (lowerCasedKey === Keys.i) {
          // [i]
          changeTerminalMode(TerminalModes.INSERT);
        } else if (e.key === Keys.a.toUpperCase()) {
          // [A]: go to the end, then Insert
          cursorPos = line.length;
          changeTerminalMode(TerminalModes.INSERT);
        } else if (lowerCasedKey === Keys.a) {
          // [a]
          changeTerminalMode(TerminalModes.INSERT);
          cursorPos += 1;
        } else if (lowerCasedKey === Keys.b) {
          // [b/B]
          internalAction(viWord(line, cursorPos, -cnt));
        } else if (lowerCasedKey === Keys.e) {
          // [e/E]
          internalAction(viWord(line, cursorPos, cnt));
        } else if (lowerCasedKey === Keys.w) {
          // [w/W]
          let alterPos = viWord(line, cursorPos - 1, 1 + cnt);
          alterPos = viWord(line, alterPos + 1, -1);
          internalAction(alterPos);
        } else if (lowerCasedKey === Keys.h || e.key === Keys.ARROW_LEFT) {
          // [h/H]
          internalAction(cursorPos - cnt);
        } else if (lowerCasedKey === Keys.l || e.key === Keys.ARROW_RIGHT) {
          // [l/L]
          internalAction(cursorPos + cnt);
        } else if (lowerCasedKey === Keys.x) {
          // [x/X]
          [line, cursorPos] = viDelete(line, cursorPos, cursorPos + cnt);
        } else if ((e.ctrlKey || e.metaKey) && lowerCasedKey == Keys.r) {
          // redo
          if (e.preventDefault) e.preventDefault();
          line = topChatHistory().redo();
        } else if (lowerCasedKey === Keys.r) {
          // [r/R]
          internalMode = InternalModes.REPLACE;
        } else if (lowerCasedKey === Keys.d) {
          // [d/D]
          if (internalMode === InternalModes.DELETE) {
            line = "";
            cursorPos = 0;
            internalMode = InternalModes.NORMAL;
          } else {
            internalMode = InternalModes.DELETE;
          }
        } else if (lowerCasedKey === Keys.c) {
          // [c/C]
          internalMode = InternalModes.DELETE_INSERT;
        } else if (lowerCasedKey === Keys.HAT || e.key === Keys.ZERO) {
          // [^/0]: go to beining of the line
          internalAction(0);
        } else if (lowerCasedKey === Keys.DOLLOR) {
          // [$]: go to the end of the line
          internalAction(line.length);
        } else if (lowerCasedKey === Keys.PERCENTAGE) {
          // [%]: match the paranthesis/bracket/...
          // TODO
        } else if (lowerCasedKey === Keys.FORWARD_SLASH) {
          // [/]: search the upcomming word
          // TODO
        } else if (isNumber(e.key)) {
          // it's a number
          count += e.key;
        } else if (lowerCasedKey === Keys.j || e.key === Keys.ARROW_DOWN) {
          line = topChatHistory().stepHistory(+1);
        } else if (lowerCasedKey === Keys.k || e.key === Keys.ARROW_UP) {
          line = topChatHistory().stepHistory(-1);
        } else if (e.key === Keys.u) {
          // undo
          line = topChatHistory().undo();
        }
        updateLine();
        break;
      }
      default:
        break;
    }
  };
  const setup = () => {
    document.addEventListener("keydown", onKeyPress);
  };
  const closure = () => {
    document.removeEventListener("keydown", onKeyPress);
  };
  closure();
  setup();
  return [closure, onKeyPress, chatHistoryPush, chatHistoryPop];
};

const stringToHtml = (str: string): string => {
  let html = "";
  for (const ch of str) {
    if (ch === " ") {
      html += "&nbsp;";
    } else {
      html += ch;
    }
  }
  return html;
};

const isAlpha = (ch: string): boolean => ch.toUpperCase() !== ch.toLowerCase();
const isSpace = (ch: string): boolean => ch === " ";
const isPunctuation = (ch: string): boolean =>
  "/\\;,.-_+=~:><\"'`$%^&*!@".includes(ch);
const isNumber = (ch: string): boolean => "0123456789".includes(ch);
const isParanthesis = (ch: string): boolean => "{}()".includes(ch);
const writable = (character: string): boolean => {
  return (
    character.length === 1 &&
    (isNumber(character) ||
      isAlpha(character) ||
      isSpace(character) ||
      isPunctuation(character) ||
      isParanthesis(character))
  );
};
const withinWord = (character: string): boolean => !isSpace(character);

const viWord = (str: string, index: number, cnt: number): number => {
  const direction = cnt / Math.abs(cnt);
  if (index >= str.length) index = str.length - 1;
  if (index < 0) index = 0;
  // console.log(`in the viWord ${index} -- direction: ${direction}`);
  const inRange = () => index < str.length && index >= 0;
  while (inRange() && cnt !== 0) {
    index += direction;
    while (inRange() && isSpace(str[index])) index += direction;
    while (inRange() && withinWord(str[index])) index += direction;
    cnt -= direction;
  }
  index -= direction;
  // console.log(`after ${index}`);
  return index;
};

const viDelete = (
  str: string,
  initPos: number,
  endPos: number,
): [string, number] => {
  if (initPos > endPos) [initPos, endPos] = [endPos, initPos];
  return [str.slice(0, initPos) + str.slice(endPos, str.length), initPos];
};

const InternalModes = {
  NORMAL: "normal",
  REPLACE: "replace",
  DELETE: "delete",
  DELETE_INSERT: "deleteInsert",
};

export default ViTerminal;

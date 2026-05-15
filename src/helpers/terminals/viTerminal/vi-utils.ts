export const isAlpha = (ch: string): boolean => ch.toUpperCase() !== ch.toLowerCase();
export const isSpace = (ch: string): boolean => ch === " ";
export const isPunctuation = (ch: string): boolean =>
  "/\\;,.-_+=~:><\"'`$%^&*!@".includes(ch);
export const isNumber = (ch: string): boolean => "0123456789".includes(ch);
export const isParanthesis = (ch: string): boolean => "{}()".includes(ch);

export const writable = (character: string): boolean =>
  character.length === 1 &&
  (isNumber(character) ||
    isAlpha(character) ||
    isSpace(character) ||
    isPunctuation(character) ||
    isParanthesis(character));

const withinWord = (character: string): boolean => !isSpace(character);

export const viWord = (str: string, index: number, cnt: number): number => {
  const direction = cnt / Math.abs(cnt);
  if (index >= str.length) index = str.length - 1;
  if (index < 0) index = 0;
  const inRange = () => index < str.length && index >= 0;
  while (inRange() && cnt !== 0) {
    index += direction;
    while (inRange() && isSpace(str[index])) index += direction;
    while (inRange() && withinWord(str[index])) index += direction;
    cnt -= direction;
  }
  index -= direction;
  return index;
};

export const viDelete = (
  str: string,
  initPos: number,
  endPos: number,
): [string, number] => {
  if (initPos > endPos) [initPos, endPos] = [endPos, initPos];
  return [str.slice(0, initPos) + str.slice(endPos, str.length), initPos];
};

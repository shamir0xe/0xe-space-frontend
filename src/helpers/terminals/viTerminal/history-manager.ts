const HistoryManager = () => {
  const history: string[][] = [];
  let row: number = 0;
  let col: number = 0;
  history.push([""]);

  const update = (line: string): void => {
    if (history[row][col] == line) return
    history[row].length = col + 1; // remove the afterwards history
    history[row].push(line);
    col = history[row].length - 1;
  }

  const newline = (line: string): void => {
    update(line);
    if (row != history.length - 1) history.push([line]);
    history.push([""]);
    row = history.length - 1;
    col = 0;
  }

  const stepHistory = (delta: number): string => {
    if (delta == 0) return history[row][col];
    row += delta;
    if (row < 0) row = 0;
    if (row >= history.length) row = history.length - 1;
    col = history[row].length - 1;
    return history[row][col];
  }

  const undo = (): string => {
    col--;
    if (col < 0) col = 0;
    if (col >= history[row].length) col = history[row].length - 1;
    return history[row][col];
  }

  const redo = (): string => {
    col++;
    if (col < 0) col = 0;
    if (col >= history[row].length) col = history[row].length - 1;
    return history[row][col];
  }

  return { update, newline, undo, redo, stepHistory }
}

export default HistoryManager;

const commandParser = (line: string): [string, string[]] => {
  line = line.trim();
  line = line.replace(/\s+/gi, " ");
  let args = line.split(" ");
  if (args.length === 0) return ["", []];
  return [args[0].toLowerCase(), args.slice(1)];
};
export default commandParser;

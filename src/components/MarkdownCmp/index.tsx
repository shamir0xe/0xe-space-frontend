import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./markdown.css";
import "highlight.js/styles/github.css";

type MarkdownCmpProps = {
  content: string;
  className?: string;
};

const MarkdownCmp = ({ content, className }: MarkdownCmpProps): JSX.Element => {
  const [value, setValue] = useState<string>(content);

  useEffect(() => {
    if (content.length && content[0] == '"') {
      content = content.slice(1, -1);
    }
    let regex: RegExp = /\\n/gi;
    content = content.replace(regex, "\n");
    console.log(content);
    setValue(content);
  }, [content]);

  return (
    <div className={`markdown-container p-4 ${className}`}>
      <Markdown rehypePlugins={[rehypeHighlight]}>{value}</Markdown>
    </div>
  );
};

export default MarkdownCmp;

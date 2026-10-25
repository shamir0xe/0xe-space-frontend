/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { Chat, ChatStates } from "@/helpers/chat/Chat";
import { useEffect, useState } from "react";
import PostLS from "./PostLS";
import PostDelete from "./PostDelete";
import PostRate from "./PostRate";
import PostComments from "./PostComments";
import PostUncomment from "./PostUncomment";

const USAGE =
  "Usage: post ls [page] | new | edit <id> | delete <id> | rate <id> <1-5> | unrate <id> | comments <id> [page] | comment <id> | uncomment <comment-id>";

const isInt = (s: string | undefined, min: number, max: number): boolean =>
  s !== undefined && /^\d+$/.test(s) && Number(s) >= min && Number(s) <= max;

/** Returns a usage message when the arguments are invalid, otherwise null. */
export const validatePostArgs = (command: string, args: string[]): string | null => {
  const [id, extra] = args;
  switch (command) {
    case "new":
      return null;
    case "ls":
      return id === undefined || isInt(id, 1, 1e9) ? null : "Usage: post ls [page]";
    case "edit":
    case "delete":
    case "unrate":
    case "comment":
      return id ? null : `Usage: post ${command} <id>`;
    case "uncomment":
      return id ? null : "Usage: post uncomment <comment-id>";
    case "rate":
      return id && isInt(extra, 1, 5) ? null : "Usage: post rate <id> <1-5>";
    case "comments":
      return id && (extra === undefined || isInt(extra, 1, 1e9))
        ? null
        : "Usage: post comments <id> [page]";
    default:
      return USAGE;
  }
};

export class PostChat extends Chat {
  command: string;
  setFocus: (focus: boolean) => void;
  postID?: string;
  title: string = "";
  content: string = "";
  editable: boolean = false;

  constructor(
    setFocus: (focus: boolean) => void,
    command: string,
    ...args: string[]
  ) {
    super();
    this.command = command;
    this.setFocus = setFocus;
    this.postID = args[0];

    const usage = validatePostArgs(command, args);
    if (usage) {
      this.state = ChatStates.FAILURE;
      this.history.push(<div className="text-left">{usage}</div>);
      return;
    }

    const id = args[0];
    switch (command) {
      case "ls":
        this.history.push(<PostLS page={id ? Number(id) : 1} />);
        this.state = ChatStates.SUCCESS;
        return;
      case "delete":
        this.history.push(<PostDelete postID={id} />);
        this.state = ChatStates.SUCCESS;
        return;
      case "rate":
        this.history.push(<PostRate postID={id} value={Number(args[1])} />);
        this.state = ChatStates.SUCCESS;
        return;
      case "unrate":
        this.history.push(<PostRate postID={id} value={null} />);
        this.state = ChatStates.SUCCESS;
        return;
      case "comments":
        this.history.push(
          <PostComments postID={id} page={args[1] ? Number(args[1]) : 1} />,
        );
        this.state = ChatStates.SUCCESS;
        return;
      case "uncomment":
        this.history.push(<PostUncomment commentID={id} />);
        this.state = ChatStates.SUCCESS;
        return;
      case "comment":
        // The next line typed in the terminal is the comment.
        this.history.push(
          <div className="text-left">Write your comment and press enter:</div>,
        );
        return;
    }

    this.history.push(
      <ValueArea
        setGlobalFocus={setFocus}
        initialize={this.initialize.bind(this)}
        onChange={({ editable, title, content }) => {
          this.editable = editable;
          this.content = content;
          this.title = title;
        }}
      />,
    );
  }

  async initialize(): Promise<OnChangeType> {
    try {
      switch (this.command) {
        case "new":
          this.editable = true;
          return Promise.resolve({
            content: "NEWW CONTENT!",
            title: "New Post",
            editable: true,
          } as OnChangeType);
        case "edit": {
          const id = this.postID ?? "";
          return BlogAPI.getPost(id).then((postValue) => {
            this.title = postValue.title ?? "";
            this.content = postValue.content ?? "";
            this.editable = true;
            return {
              content: this.content,
              title: this.title,
              editable: this.editable,
            } as OnChangeType;
          });
        }
        default:
          throw new Error("Invalid command");
      }
    } catch (error: any) {
      return Promise.reject(`error: ${error}`);
    }
  }

  async recieve(line: string = ""): Promise<JSX.Element> {
    if (this.command == "comment") {
      const content = line.trim();
      if (!content) {
        this.history.push(<div>Comment couldn't be empty</div>);
        return this.renderHistory();
      }
      try {
        await BlogAPI.addComment(this.postID ?? "", content);
        this.history.push(
          <div>Comment added. See it with: post comments {this.postID}</div>,
        );
        this.state = ChatStates.SUCCESS;
      } catch (error) {
        this.history.push(<div>Failed: {errorMessage(error)}</div>);
        this.state = ChatStates.FAILURE;
      }
      return this.renderHistory();
    }

    try {
      switch (this.command) {
        case "new":
          await BlogAPI.newPost({ title: this.title, content: this.content });
          break;
        case "edit":
          await BlogAPI.editPost({
            id: this.postID ?? "",
            title: this.title,
            content: this.content,
          });
          break;
      }
    } catch (error) {
      this.history.push(<div>Failed: {errorMessage(error)}</div>);
      this.state = ChatStates.FAILURE;
      return this.renderHistory();
    }

    this.history.push(<div>Done</div>);
    this.state = ChatStates.SUCCESS;
    return this.renderHistory();
  }
}

type OnChangeType = {
  content: string;
  title: string;
  editable: boolean;
};

type ValueAreaProps = {
  setGlobalFocus: (focus: boolean) => void;
  onChange: (info: OnChangeType) => void;
  initialize: () => Promise<OnChangeType>;
};

const ValueArea = ({
  setGlobalFocus,
  onChange,
  initialize,
}: ValueAreaProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editable, setEditable] = useState<boolean>(false);

  const handleFocus = (currentFocus: boolean) => {
    setGlobalFocus(!currentFocus);
  };

  useEffect(() => {
    onChange({
      title: title,
      content: content,
      editable: editable,
    } as OnChangeType);
  }, [content, title]);

  useEffect(() => {
    initialize()
      .then(({ content, title, editable }) => {
        setContent(content);
        setTitle(title);
        setEditable(editable);
      })
      .catch((error: unknown) => {
        setContent(`Error loading post: ${error}`);
      });
  }, []);

  return (
    <div className="p-4">
      <input
        readOnly={!editable}
        placeholder="Title..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
      />
      <textarea
        className="border border-gray-300 p-2 rounded w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-950"
        readOnly={!editable}
        rows={5} // Number of visible rows
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        placeholder="Content..."
        onFocus={() => handleFocus(true)} // Triggered when the textarea gains focus
        onBlur={() => handleFocus(false)} // Triggered when the textarea loses focus
      />
    </div>
  );
};

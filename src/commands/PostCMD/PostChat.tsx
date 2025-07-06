import { BlogAPI } from "@/facades/apiCall";
import PostFactory from "@/factories/postFactory";
import { Chat, ChatStates } from "@/helpers/chat/Chat";
import { useEffect, useState } from "react";
import PostLS from "./PostLS";
import PostDelete from "./PostDelete"

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
    if (currentFocus) {
      console.log("Text area Focused!");
    } else {
      console.log("Text area Blured!");
    }
    setGlobalFocus(!currentFocus);
  };

  useEffect(() => {
    console.log(title);
    onChange({
      title: title,
      content: content,
      editable: editable,
    } as OnChangeType);
  }, [content, title]);

  useEffect(() => {
    initialize()
      .then(({ content, title, editable }) => {
        console.log("CALLING");
        setContent(content);
        setTitle(title);
        setEditable(editable);
      })
      .catch((error: any) => {
        console.log(`errrror: ${error}`);
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

export class PostChat extends Chat {
  command: string;
  setFocus: (focus: boolean) => void;
  postID?: string;
  availableCommands = ["new", "edit", "ls", "delete"];
  title: string = "";
  content: string = "";
  editable: boolean = false;

  constructor(
    setFocus: (focus: boolean) => void,
    command: string,
    postID?: string,
  ) {
    super();
    this.command = command;
    this.setFocus = setFocus;
    this.postID = postID;
    if (
      !this.availableCommands.includes(command) ||
      (command == "edit" && !postID) ||
      (command == "delete" && !postID)
    ) {
      this.state = ChatStates.FAILURE;
      this.history.push(<div className="text-left">Invalid Arguments</div>);
      return;
    }

    if (this.command == "ls") {
      this.history.push(<PostLS />);
      this.state = ChatStates.SUCCESS;
    }
    if (this.command == "delete") {
      this.history.push(<PostDelete postID={postID} />);
      this.state = ChatStates.SUCCESS;
    }
    if (["new", "edit"].includes(this.command))
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
        case "edit":
          const id = this.postID ?? "";
          return BlogAPI.getPost(id).then((postValue) => {
            console.log(`We got it: ${postValue.title}`);
            this.title = postValue.title ?? "";
            this.content = postValue.content ?? "";
            this.editable = true;
            return {
              content: this.content,
              title: this.title,
              editable: this.editable,
            } as OnChangeType;
          });
        default:
          throw new Error("Invalid command");
      }
    } catch (error: any) {
      return Promise.reject(`error: ${error}`);
    }
  }

  async recieve(): Promise<JSX.Element> {
    try {
      let post = PostFactory.default();
      switch (this.command) {
        case "new":
          post.title = this.title;
          post.content = this.content;
          await BlogAPI.newPost(post);
          break;
        case "edit":
          post.id = this.postID ?? "";
          post.title = this.title;
          post.content = this.content;

          post = await BlogAPI.editPost(post);
          console.log(post.title);
          console.log(post.content);
          break;
      }
    } catch (error: any) {
      this.history.push(<div>Failed: {error.toString()}</div>);
      this.state = ChatStates.FAILURE;
      return this.renderHistory();
    }

    this.history.push(<div>Done</div>);
    this.state = ChatStates.SUCCESS;
    return this.renderHistory();
  }
}

import APICall from "@/facades/apiCall";
import { Chat, ChatStates } from "@/helpers/chat/Chat";
import { useEffect, useState } from "react";

type ValueAreaProps = {
  setGlobalFocus: (focus: boolean) => void;
  onChange: (value: string) => void;
  initialize: () => Promise<string>;
};

const ValueArea = ({
  setGlobalFocus,
  onChange,
  initialize,
}: ValueAreaProps) => {
  const [value, setValue] = useState<string>(""); // State to manage textarea value
  const [editable, setEditable] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value); // Update the state with the new value
    onChange(e.target.value);
  };

  const handleFocus = (currentFocus: boolean) => {
    if (currentFocus) {
      console.log("Text area Focused!");
    } else {
      console.log("Text area Blured!");
    }
    setGlobalFocus(!currentFocus);
  };

  useEffect(() => {
    initialize()
      .then((value) => {
        console.log("got the prev value");
        setValue(value);
      })
      .catch((error: any) => {
        console.log(`error occurred: ${error}`);
      })
      .finally(() => {
        setEditable(true);
      });
  }, []);

  return (
    <div className="p-4">
      <textarea
        className="border border-gray-300 p-2 rounded w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-950"
        rows={5} // Number of visible rows
        value={value}
        readOnly={!editable}
        onChange={handleChange}
        placeholder="Type something..."
        onFocus={() => handleFocus(true)} // Triggered when the textarea gains focus
        onBlur={() => handleFocus(false)} // Triggered when the textarea loses focus
      />
    </div>
  );
};

export class SetKeyChat extends Chat {
  key: string;
  setFocus: (focus: boolean) => void;
  availableKeys = [
    "about_me",
    "twitter",
    "youtube",
    "topcoder",
    "codeforces",
    "github",
    "leetcode",
    "cv",
    "email_template_verification_code",
    "email_template_welcomen"
  ];
  value: string = "";

  constructor(setFocus: (focus: boolean) => void, key: string) {
    super();
    this.key = key;
    this.setFocus = setFocus;
    if (!this.availableKeys.includes(key)) {
      this.state = ChatStates.FAILURE;
      this.history.push(<div className="text-left">Invalid Key</div>);
      return;
    }
    this.history.push(
      <ValueArea
        setGlobalFocus={setFocus}
        initialize={this.initialize.bind(this)}
        onChange={(value) => (this.value = value)}
      />,
    );
  }

  async initialize(): Promise<string> {
    try {
      this.value = await APICall.getKey(this.key);
      return Promise.resolve(this.value);
    } catch (error: any) {
      return Promise.reject(`error: ${error}`);
    }
  }

  async recieve(): Promise<JSX.Element> {
    console.log(`recieved ${this.value}`);
    try {
      await APICall.setKey(this.key, this.value);
      this.history.push(<div>Done</div>);
      this.state = ChatStates.SUCCESS;
    } catch (error: any) {
      this.history.push(<div>Failed: {error.toString()}</div>);
      this.state = ChatStates.FAILURE;
    }
    return this.renderHistory();
  }
}

import { Chat, ChatStates } from "@/helpers/chat/Chat";
import { useState } from "react";

type ValueAreaProps = {
  setGlobalFocus: (focus: boolean) => void;
};
const ValueArea = ({ setGlobalFocus }: ValueAreaProps) => {
  const [value, setValue] = useState<string>(""); // State to manage textarea value

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value); // Update the state with the new value
  };

  const handleFocus = (currentFocus: boolean) => {
    if (currentFocus) {
      console.log("Text area Focused!");
    } else {
      console.log("Text area Blured!");
    }
    setGlobalFocus(!currentFocus);
  };

  return (
    <div className="p-4">
      <textarea
        className="border border-gray-300 p-2 rounded w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-950"
        rows={5} // Number of visible rows
        value={value}
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

  constructor(setFocus: (focus: boolean) => void, key: string) {
    super();
    this.key = key;
    this.setFocus = setFocus;
    this.history.push(<ValueArea setGlobalFocus={setFocus} />);
  }

  async recieve(line: string): Promise<JSX.Element> {
    line = line.trim();
    console.log(`recieved ${line}`);
    if (line == "") {
      this.history.push(<div>Done</div>);
      this.state = ChatStates.SUCCESS;
      return this.renderHistory();
    }
    this.history.push(<div>{line}</div>);
    return this.renderHistory();
  }
}

import { GeneralAPI } from "@/facades/apiCall";
import { useState } from "react";
import { FaTwitter } from "react-icons/fa";

const TwitterCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  GeneralAPI.getKey("twitter")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <FaTwitter className="text-blue-500 w-6 h-6" aria-label="Twitter Logo" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 font-semibold hover:underline flex items-center"
      >
        <span className="ml-2">Twitter</span>
      </a>
    </div>
  );
};

export default TwitterCMD;

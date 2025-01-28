import { GeneralAPI } from "@/facades/apiCall";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa";

const YoutubeCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  GeneralAPI.getKey("youtube")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <FaYoutube className="text-red-500 w-6 h-6" aria-label="Youtube Logo" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-500 font-semibold hover:underline flex items-center"
      >
        <span className="ml-2">Youtube</span>
      </a>
    </div>
  );
};

export default YoutubeCMD;

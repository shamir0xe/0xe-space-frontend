import { GeneralAPI } from "@/facades/apiCall";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

const GithubCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  GeneralAPI.getKey("github")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <FaGithub className="text-white-500 w-6 h-6" aria-label="Github Logo" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white-500 font-semibold hover:underline flex items-center"
      >
        <span className="ml-2">Github</span>
      </a>
    </div>
  );
};

export default GithubCMD;

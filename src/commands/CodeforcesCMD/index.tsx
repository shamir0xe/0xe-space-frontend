import APICall from "@/facades/apiCall";
import { useState } from "react";
import codeforcesLogo from "@/assets/icons/codeforces.svg";

const CodeforcesCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  APICall.getKey("codeforces")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <img src={codeforcesLogo} alt="Codeforces Logo" className="w-6 h-6" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white-500 font-semibold hover:underline flex items-center"
      >
        <span className="ml-2">Codeforces</span>
      </a>
    </div>
  );
};

export default CodeforcesCMD;

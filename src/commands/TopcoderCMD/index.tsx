import { GeneralAPI } from "@/facades/apiCall";
import { useState } from "react";
import topcoderLogo from "@/assets/icons/topcoder.webp";

const TopcoderCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  GeneralAPI.getKey("topcoder")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <img src={topcoderLogo} alt="Topcoder Logo" className="w-6 h-6" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white-500 font-semibold hover:underline flex items-center"
      >
        <span className="ml-2">Topcoder</span>
      </a>
    </div>
  );
};

export default TopcoderCMD;

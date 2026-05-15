import { GeneralAPI } from "@/facades/apiCall";
import { useEffect, useState } from "react";
import leetcodeLogo from "@/assets/icons/leetcode.svg";

const LeetcodeCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    GeneralAPI.getKey("leetcode")
      .then((content: string) => setValue(content))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <img src={leetcodeLogo} alt="Leetcode Logo" className="w-6 h-6" />
      {error ? (
        <span className="ml-2 text-red-400">(unavailable)</span>
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white-500 font-semibold hover:underline flex items-center"
        >
          <span className="ml-2">Leetcode</span>
        </a>
      )}
    </div>
  );
};

export default LeetcodeCMD;

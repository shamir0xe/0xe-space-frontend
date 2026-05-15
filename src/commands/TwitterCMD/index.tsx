import { GeneralAPI } from "@/facades/apiCall";
import { useEffect, useState } from "react";
import { FaTwitter } from "react-icons/fa";

const TwitterCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    GeneralAPI.getKey("twitter")
      .then((content: string) => setValue(content))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <FaTwitter className="text-blue-500 w-6 h-6" aria-label="Twitter Logo" />
      {error ? (
        <span className="ml-2 text-red-400">(unavailable)</span>
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold hover:underline flex items-center"
        >
          <span className="ml-2">Twitter</span>
        </a>
      )}
    </div>
  );
};

export default TwitterCMD;

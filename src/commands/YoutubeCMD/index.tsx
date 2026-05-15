import { GeneralAPI } from "@/facades/apiCall";
import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa";

const YoutubeCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    GeneralAPI.getKey("youtube")
      .then((content: string) => setValue(content))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <FaYoutube className="text-red-500 w-6 h-6" aria-label="Youtube Logo" />
      {error ? (
        <span className="ml-2 text-red-400">(unavailable)</span>
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 font-semibold hover:underline flex items-center"
        >
          <span className="ml-2">Youtube</span>
        </a>
      )}
    </div>
  );
};

export default YoutubeCMD;

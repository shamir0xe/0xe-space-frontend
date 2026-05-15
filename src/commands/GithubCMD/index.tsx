import { GeneralAPI } from "@/facades/apiCall";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

const GithubCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    GeneralAPI.getKey("github")
      .then((content: string) => setValue(content))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <FaGithub className="text-white-500 w-6 h-6" aria-label="Github Logo" />
      {error ? (
        <span className="ml-2 text-red-400">(unavailable)</span>
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white-500 font-semibold hover:underline flex items-center"
        >
          <span className="ml-2">Github</span>
        </a>
      )}
    </div>
  );
};

export default GithubCMD;

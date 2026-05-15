import { GeneralAPI } from "@/facades/apiCall";
import { useEffect, useState } from "react";
import topcoderLogo from "@/assets/icons/topcoder.webp";

const TopcoderCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    GeneralAPI.getKey("topcoder")
      .then((content: string) => setValue(content))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="flex items-center space-x-2 p-4 rounded-md">
      <img src={topcoderLogo} alt="Topcoder Logo" className="w-6 h-6" />
      {error ? (
        <span className="ml-2 text-red-400">(unavailable)</span>
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white-500 font-semibold hover:underline flex items-center"
        >
          <span className="ml-2">Topcoder</span>
        </a>
      )}
    </div>
  );
};

export default TopcoderCMD;

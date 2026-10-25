import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { useEffect, useState } from "react";
import { formatRating } from "./format";

type PostRateProps = {
  postID: string;
  /** 1-5, or null to remove the rating. */
  value: number | null;
};

const PostRate = ({ postID, value }: PostRateProps) => {
  const [status, setStatus] = useState<string>("waiting...");

  useEffect(() => {
    const call =
      value === null
        ? BlogAPI.unratePost(postID)
        : BlogAPI.ratePost(postID, value);
    call
      .then((stats) =>
        setStatus(
          `${value === null ? "rating removed" : `rated ${value}`}; post #${postID} is now ${formatRating(stats)}`,
        ),
      )
      .catch((error) => setStatus(`could not rate: ${errorMessage(error)}`));
  }, [postID, value]);

  return <div>{status}</div>;
};
export default PostRate;

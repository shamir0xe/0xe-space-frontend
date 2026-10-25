import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { useEffect, useState } from "react";

const PostUncomment = ({ commentID }: { commentID: string }) => {
  const [status, setStatus] = useState<string>("waiting...");

  useEffect(() => {
    BlogAPI.deleteComment(commentID)
      .then(() => setStatus(`comment ${commentID} has been removed`))
      .catch((error) => setStatus(`could not delete the comment: ${errorMessage(error)}`));
  }, [commentID]);

  return <div>{status}</div>;
};
export default PostUncomment;

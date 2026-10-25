import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { useEffect, useState } from "react";

interface PostDeleteProps {
  postID: string;
}

const PostDelete = ({ postID }: PostDeleteProps) => {
  const [status, setStatus] = useState<string>("waiting...");

  useEffect(() => {
    BlogAPI.deletePost(postID)
      .then(() => setStatus(`post #${postID} and its comments have been removed!`))
      .catch((error) => setStatus(`could not delete the post: ${errorMessage(error)}`));
  }, [postID]);

  return <div>{status}</div>;
};
export default PostDelete;

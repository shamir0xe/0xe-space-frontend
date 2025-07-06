import { BlogAPI } from "@/facades/apiCall";
import Post from "@/models/post";
import { useEffect, useState } from "react";

interface PostDeleteProps {
  postID: string;
}

const PostDelete = ({ postID }: PostDeleteProps) => {
  const [status, setStatus] = useState<string>("waiting...");

  useEffect(() => {
    BlogAPI.deletePost(postID).then((post: Post) => {
      setStatus(`post #${post.id}: -${post.title}- have been removed!`)
    }).catch(error => {
      setStatus(`could not delete the post: ${error}`)
    });
    return () => { }
  }, []);

  return (
    <div className="">
      {status}
    </div>
  );
};
export default PostDelete;

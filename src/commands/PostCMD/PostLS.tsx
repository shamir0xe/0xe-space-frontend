import APICall from "@/facades/apiCall";
import Post from "@/models/post";
import { useEffect, useState } from "react";

const PostLS = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    APICall.getPosts().then((posts) => {
      posts.reverse();
      setPosts(posts);
    });
  }, []);

  return (
    <div className="">
      {posts.map((post, index) => {
        return (
          <div key={`post-${index}`} className="">
            <span>{post.id}: </span>
            {post.title}
          </div>
        );
      })}
    </div>
  );
};
export default PostLS;

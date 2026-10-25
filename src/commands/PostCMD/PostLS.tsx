import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import { PostSummary } from "@/models/post";
import Page from "@/models/page";
import { useEffect, useState } from "react";
import { formatRating } from "./format";

const PAGE_SIZE = 20;

const PostLS = ({ page = 1 }: { page?: number }) => {
  const [result, setResult] = useState<Page<PostSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    BlogAPI.getPosts(page, PAGE_SIZE)
      .then(setResult)
      .catch((e) => setError(errorMessage(e)));
  }, [page]);

  if (error) return <div>{error}</div>;
  if (!result) return <div>loading...</div>;
  if (result.items.length === 0) return <div>No posts on page {page}</div>;

  const pages = Math.max(1, Math.ceil(result.total / result.page_size));
  return (
    <div>
      {result.items.map((post) => (
        <div key={`post-${post.id}`}>
          <span>{post.id}: </span>
          {post.title}{" "}
          <span className="text-gray-400">{formatRating(post)}</span>
        </div>
      ))}
      {pages > 1 && (
        <div className="text-gray-400">
          page {result.page}/{pages} (post ls &lt;page&gt;)
        </div>
      )}
    </div>
  );
};
export default PostLS;

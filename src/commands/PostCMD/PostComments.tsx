import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import Comment from "@/models/comment";
import Page from "@/models/page";
import { useEffect, useState } from "react";
import { formatRating } from "./format";

const PostComments = ({ postID, page = 1 }: { postID: string; page?: number }) => {
  const [result, setResult] = useState<Page<Comment> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    BlogAPI.getComments(postID, page)
      .then(setResult)
      .catch((e) => setError(errorMessage(e)));
  }, [postID, page]);

  if (error) return <div>{error}</div>;
  if (!result) return <div>loading...</div>;
  if (result.items.length === 0)
    return <div>No comments yet. Add one with: post comment {postID}</div>;

  const pages = Math.max(1, Math.ceil(result.total / result.page_size));
  return (
    <div>
      {result.items.map((c) => (
        <div key={c.id} className="mb-1">
          <span className="text-gray-400">
            [{c.id}] @{c.author.username} · {c.created_at.toLocaleString()} ·{" "}
            {formatRating(c)}
          </span>
          <div className="whitespace-pre-wrap pl-2">{c.content}</div>
        </div>
      ))}
      {pages > 1 && (
        <div className="text-gray-400">
          page {result.page}/{pages} (post comments {postID} &lt;page&gt;)
        </div>
      )}
    </div>
  );
};
export default PostComments;

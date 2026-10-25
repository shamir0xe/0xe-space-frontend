import Button from "@/components/Button";
import Header from "@/components/Header";
import MarkdownCmp from "@/components/MarkdownCmp";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/components/AuthContext";
import isLoggedIn from "@/actions/user/isLoggedIn";
import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import Post from "@/models/post";
import { hasNextPage } from "@/models/page";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Comments from "./Comments";
import "./index.css";

const PAGE_SIZE = 5;

const Blog = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const loggedIn = isLoggedIn(user);
  const navigate = useNavigate();

  // The list carries excerpts only, so each post of the page is fetched in full.
  const loadPage = async (next: number) => {
    setLoading(true);
    setError(null);
    try {
      const summaries = await BlogAPI.getPosts(next, PAGE_SIZE);
      const full = await Promise.all(
        summaries.items.map((s) => BlogAPI.getPost(s.id)),
      );
      setPosts((prev) => (next === 1 ? full : [...prev, ...full]));
      setPage(next);
      setMore(hasNextPage(summaries));
    } catch (e) {
      setError(`Could not load the posts: ${errorMessage(e)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  const ratePost = (id: string) => async (value: number | null) => {
    const stats =
      value === null
        ? await BlogAPI.unratePost(id)
        : await BlogAPI.ratePost(id, value);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...stats } : p)));
  };

  const BlogHeader = (): JSX.Element => {
    return (
      <Header
        className="flex items-center w-full justify-between"
        bgColor="bg-cyan-500"
      >
        <div className="flex-initial min-h-12 table z-20">
          <p className="table-cell align-middle text-left">
            <strong>&lt;Blog0xe&gt;</strong>
          </p>
        </div>
        <div className="z-20 text-sm">
          Go to &nbsp;
          <Button
            onMouseDown={() => {
              navigate("/");
            }}
            className="px-1 py-1.5 mr-1 bg-cyan-900"
          >
            Terminal
          </Button>
        </div>
      </Header>
    );
  };

  const renderPosts = () => {
    return posts.map((post: Post) => (
      <div
        className="min-h-32 bg-gray-800 sm:my-5 border-transparent sm:rounded-t-[20px] blog-post"
        key={`post#${post.id}`}
      >
        <div className="p-5">
          <strong>
            <p className="text-center border rounded px-5">{post.title ?? ""}</p>
          </strong>
        </div>
        <MarkdownCmp content={post.content ?? ""} />
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-2 text-xs">
          <StarRating stats={post} onRate={loggedIn ? ratePost(post.id) : undefined} />
          <span className="text-right">
            {post.author ? `by @${post.author.username} · ` : ""}
            created at {post.created_at.toLocaleString()}
          </span>
        </div>
        <Comments postID={post.id} />
      </div>
    ));
  };

  return (
    <div className="text-white max-w-4xl m-auto">
      <BlogHeader />
      <div className="w-full sm:px-5 px-0">
        {renderPosts()}
        {!loading && !error && posts.length === 0 && (
          <div className="p-10 text-center text-gray-400">No posts yet.</div>
        )}
        {error && <div className="p-5 text-center text-red-400">{error}</div>}
        <div className="p-5 text-center">
          {loading ? (
            <span className="text-gray-400">loading...</span>
          ) : (
            (more || error) && (
              <button
                type="button"
                className="px-4 py-2 rounded bg-cyan-800 hover:bg-cyan-700"
                onClick={() => loadPage(error && page === 0 ? 1 : page + 1)}
              >
                {error ? "Retry" : "Load more"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;

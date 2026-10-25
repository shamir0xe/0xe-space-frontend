import { useAuth } from "@/components/AuthContext";
import isLoggedIn from "@/actions/user/isLoggedIn";
import StarRating from "@/components/StarRating";
import { BlogAPI } from "@/facades/apiCall";
import { errorMessage } from "@/facades/apiCall/base";
import Comment from "@/models/comment";
import { hasNextPage } from "@/models/page";
import { useState } from "react";

const PAGE_SIZE = 20;

/** Collapsible comment thread of a post. */
const Comments = ({ postID }: { postID: string }) => {
  const { user } = useAuth();
  const loggedIn = isLoggedIn(user);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (next: number) => {
    setBusy(true);
    setError(null);
    try {
      const res = await BlogAPI.getComments(postID, next, PAGE_SIZE);
      setComments((prev) => (next === 1 ? res.items : [...prev, ...res.items]));
      setPage(next);
      setMore(hasNextPage(res));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => {
    if (!open && page === 0) load(1);
    setOpen(!open);
  };

  const submit = async () => {
    const content = draft.trim();
    if (!content) return;
    setBusy(true);
    setError(null);
    try {
      const created = await BlogAPI.addComment(postID, content);
      setComments((prev) => [...prev, created]);
      setDraft("");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await BlogAPI.deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const rate = (id: string) => async (value: number | null) => {
    const stats =
      value === null
        ? await BlogAPI.unrateComment(id)
        : await BlogAPI.rateComment(id, value);
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...stats } : c)));
  };

  return (
    <div className="px-5 pb-4 text-left">
      <button type="button" className="text-cyan-400 hover:underline text-sm" onClick={toggle}>
        {open ? "Hide comments" : "Show comments"}
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {comments.length === 0 && !busy && (
            <div className="text-gray-400 text-sm">No comments yet.</div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="border-l-2 border-gray-600 pl-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  <strong className="text-gray-200">@{c.author.username}</strong> ·{" "}
                  {c.created_at.toLocaleString()}
                </span>
                {loggedIn && (c.author.id === user.id || user.is_admin) && (
                  <button type="button" className="hover:text-red-400" onClick={() => remove(c.id)}>
                    delete
                  </button>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm my-1">{c.content}</div>
              <StarRating size="sm" stats={c} onRate={loggedIn ? rate(c.id) : undefined} />
            </div>
          ))}
          {more && (
            <button type="button" disabled={busy} className="text-cyan-400 hover:underline text-sm" onClick={() => load(page + 1)}>
              Load more comments
            </button>
          )}
          {loggedIn ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full rounded p-2 text-stone-950 text-sm"
                rows={3}
                maxLength={5000}
                placeholder="Write a comment..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                type="button"
                disabled={busy || !draft.trim()}
                className="self-end px-3 py-1 rounded bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-sm"
                onClick={submit}
              >
                Comment
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Log in from the terminal to comment.</div>
          )}
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default Comments;

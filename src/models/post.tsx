import Author from "./author";
import RatingStats from "./ratingStats";

type Post = RatingStats & {
  id: string;
  created_at: Date;
  updated_at: Date;
  title: string | null;
  content: string | null;
  author: Author | null;
};

/** A post in a list: `excerpt` holds the first 200 characters of the content. */
export type PostSummary = RatingStats & {
  id: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  excerpt: string;
  author: Author | null;
};

export default Post;

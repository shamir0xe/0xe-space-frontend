import Author from "./author";
import RatingStats from "./ratingStats";

type Comment = RatingStats & {
  id: string;
  post_id: string;
  content: string;
  author: Author;
  created_at: Date;
  updated_at: Date;
};

export default Comment;

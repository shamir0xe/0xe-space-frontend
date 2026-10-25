/* eslint-disable @typescript-eslint/no-explicit-any */
import Comment from "../comment";
import ratingStatsDTO from "./ratingStatsDTO";

const commentDTO = (data: any): Comment => ({
  id: data.id,
  post_id: String(data.post_id),
  content: data.content ?? "",
  author: data.author,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
  ...ratingStatsDTO(data),
});

export default commentDTO;

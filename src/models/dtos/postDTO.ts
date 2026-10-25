/* eslint-disable @typescript-eslint/no-explicit-any */
import Post, { PostSummary } from "../post";
import ratingStatsDTO from "./ratingStatsDTO";

const postDTO = (postData: any): Post => {
  return {
    id: String(postData.id),
    created_at: new Date(postData.created_at),
    updated_at: new Date(postData.updated_at),
    content: postData.content ?? null,
    title: postData.title ?? null,
    author: postData.author ?? null,
    ...ratingStatsDTO(postData),
  };
};

export const postSummaryDTO = (data: any): PostSummary => ({
  id: String(data.id),
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
  title: data.title ?? "",
  excerpt: data.excerpt ?? "",
  author: data.author ?? null,
  ...ratingStatsDTO(data),
});

export default postDTO;

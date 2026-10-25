import Post, { PostSummary } from "@/models/post";
import Comment from "@/models/comment";
import Page from "@/models/page";
import RatingStats from "@/models/ratingStats";
import BaseAPI from "./base";
import postDTO, { postSummaryDTO } from "@/models/dtos/postDTO";
import commentDTO from "@/models/dtos/commentDTO";
import pageDTO from "@/models/dtos/pageDTO";
import ratingStatsDTO from "@/models/dtos/ratingStatsDTO";

const postPath = (id: string) => `/posts/${encodeURIComponent(id)}`;
const commentPath = (id: string) => `/comments/${encodeURIComponent(id)}`;

export class BlogAPI extends BaseAPI {
  // --- posts ---

  /** Newest first; items carry an excerpt instead of the full content. */
  static async getPosts(page = 1, pageSize = 20): Promise<Page<PostSummary>> {
    const data = await this.get("/posts", { page, page_size: pageSize });
    return pageDTO(data, postSummaryDTO);
  }

  static async getPost(postID: string): Promise<Post> {
    return postDTO(await this.get(postPath(postID)));
  }

  static async newPost(post: Pick<Post, "title" | "content">): Promise<Post> {
    return postDTO(
      await this.post("/posts", { title: post.title, content: post.content }),
    );
  }

  static async editPost(
    post: Pick<Post, "id" | "title" | "content">,
  ): Promise<Post> {
    return postDTO(
      await this.patch(postPath(post.id), {
        title: post.title,
        content: post.content,
      }),
    );
  }

  /** Also deletes the post's comments and ratings. */
  static async deletePost(postID: string): Promise<void> {
    await this.del(postPath(postID));
  }

  static async ratePost(postID: string, value: number): Promise<RatingStats> {
    return ratingStatsDTO(await this.put(`${postPath(postID)}/rating`, { value }));
  }

  static async unratePost(postID: string): Promise<RatingStats> {
    return ratingStatsDTO(await this.del(`${postPath(postID)}/rating`));
  }

  // --- comments ---

  /** Oldest first. */
  static async getComments(
    postID: string,
    page = 1,
    pageSize = 20,
  ): Promise<Page<Comment>> {
    const data = await this.get(`${postPath(postID)}/comments`, {
      page,
      page_size: pageSize,
    });
    return pageDTO(data, commentDTO);
  }

  static async addComment(postID: string, content: string): Promise<Comment> {
    return commentDTO(
      await this.post(`${postPath(postID)}/comments`, { content }),
    );
  }

  static async editComment(commentID: string, content: string): Promise<Comment> {
    return commentDTO(await this.patch(commentPath(commentID), { content }));
  }

  /** Allowed for the comment's author and for admins. */
  static async deleteComment(commentID: string): Promise<void> {
    await this.del(commentPath(commentID));
  }

  static async rateComment(commentID: string, value: number): Promise<RatingStats> {
    return ratingStatsDTO(
      await this.put(`${commentPath(commentID)}/rating`, { value }),
    );
  }

  static async unrateComment(commentID: string): Promise<RatingStats> {
    return ratingStatsDTO(await this.del(`${commentPath(commentID)}/rating`));
  }
}

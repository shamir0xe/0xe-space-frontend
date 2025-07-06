import Post from "@/models/post";
import BaseAPI from "./base";
import postDTO from "@/models/dtos/postDTO";

export class BlogAPI extends BaseAPI {
  static async deletePost(postID: string): Promise<Post> {
    try {
      const response = await this.post(`/blog/delete/${postID}`)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return postDTO(await response.json());
    } catch (error: any) {
      return Promise.reject(error)
    }
  }

  static async newPost(post: Post): Promise<Post> {
    try {
      const response = await this.post("/blog/create", {
        title: post.title,
        content: post.content
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return postDTO(await response.json());
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async editPost(post: Post): Promise<Post> {
    try {
      const response = await this.post(`/blog/update/${post.id}`, {
        title: post.title,
        content: post.content
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return postDTO(await response.json());
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async getPosts(): Promise<Post[]> {
    try {
      const response = await this.post('/blog/read')
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async getPost(postID: string): Promise<Post> {
    try {
      const response = await this.post(`/blog/read_by_id/${postID}`)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const postData = await response.json();
      return postDTO(postData);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }
};
